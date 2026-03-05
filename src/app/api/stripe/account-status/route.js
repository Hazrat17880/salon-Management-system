// app/api/stripe/account-status/route.js
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { query } from '@/lib/dbConnection';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { accountId, salonId } = await request.json();

    if (!accountId) {
      return NextResponse.json(
        { error: 'accountId is required' },
        { status: 400 }
      );
    }

    // Retrieve the account from Stripe
    const account = await stripe.accounts.retrieve(accountId);

    // Check if onboarding is complete
    // For Express accounts, charges_enabled indicates they've completed onboarding
    const isOnboarded = account.charges_enabled && account.payouts_enabled;

    // If they've completed onboarding, update your database
    if (isOnboarded && salonId) {
      await query.salon.update({
        where: { id: salonId },
        data: { 
          stripe_onboarded: true,
          stripe_account_status: 'active'
        }
      });
    }

    return NextResponse.json({
      onboarded: isOnboarded,
      account: {
        id: account.id,
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
        details_submitted: account.details_submitted
      }
    });
  } catch (error) {
    console.error('Error checking account status:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}