import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { query } from '@/lib/dbConnection';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { salonId } = await request.json();

    console.log("your salon id are :", salonId);

    if (!salonId) {
      return NextResponse.json(
        { error: 'Salon ID is required' },
        { status: 400 }
      );
    }

    // Get salon data from database - MySQL syntax with ?
    const rows = await query(
      `SELECT 
        id, 
        stripe_account_id, 
        stripe_onboarded, 
        stripe_account_status 
       FROM salons 
       WHERE id = ?`,
      [salonId]
    );

    // Check if rows array exists and has data
    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: 'Salon not found' },
        { status: 404 }
      );
    }

    // Get the first row (salon data)
    const salon = rows[0];
    
    // If no stripe_account_id, definitely not connected
    if (!salon.stripe_account_id) {
      return NextResponse.json({
        success: true,
        data: {
          isConnected: false,
          message: 'No Stripe account found'
        }
      });
    }

    // Verify with Stripe to ensure the account is actually active
    try {
      const stripeAccount = await stripe.accounts.retrieve(salon.stripe_account_id);
      
      const isStripeActive = stripeAccount.charges_enabled && 
                             stripeAccount.payouts_enabled;
      
      // If Stripe says it's active but our DB doesn't, update the DB
      if (isStripeActive && (!salon.stripe_onboarded || salon.stripe_account_status !== 'active')) {
        await query(
          `UPDATE salons 
           SET stripe_onboarded = 1, 
               stripe_account_status = 'active',
               updated_at = NOW()
           WHERE id = ?`,
          [salonId]
        );
        
        return NextResponse.json({
          success: true,
          data: {
            isConnected: true,
            message: 'Bank account is connected (status updated)',
            updated: true
          }
        });
      }
      
      // Return the actual status
      return NextResponse.json({
        success: true,
        data: {
          isConnected: isStripeActive,
          stripe_account_id: salon.stripe_account_id,
          stripe_onboarded: salon.stripe_onboarded === 1,
          stripe_account_status: salon.stripe_account_status,
          stripe_details: {
            charges_enabled: stripeAccount.charges_enabled,
            payouts_enabled: stripeAccount.payouts_enabled,
            details_submitted: stripeAccount.details_submitted
          },
          message: isStripeActive ? 'Bank account is connected' : 'Bank account is not fully set up'
        }
      });
      
    } catch (stripeError) {
      console.error('Stripe verification error:', stripeError);
      
      // If Stripe account is not found or invalid, update DB
      if (stripeError.code === 'resource_missing') {
        await query(
          `UPDATE salons 
           SET stripe_account_id = NULL, 
               stripe_onboarded = 0, 
               stripe_account_status = 'inactive'
           WHERE id = ?`,  // Fixed: changed $1 to ?
          [salonId]
        );
        
        return NextResponse.json({
          success: true,
          data: {
            isConnected: false,
            message: 'Stripe account not found, database updated'
          }
        });
      }
      
      throw stripeError;
    }
    
  } catch (error) {
    console.error('Error verifying bank account:', error);
    return NextResponse.json(
      { error: 'Failed to verify bank account status' },
      { status: 500 }
    );
  }
}