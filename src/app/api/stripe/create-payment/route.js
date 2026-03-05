// app/api/bookings/create-payment/route.js (FIXED)
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { query } from '@/lib/dbConnection';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { 
      amount,
      salonId,
      customerId,
      serviceId,
      appointmentTime,
      appointmentId,
      platformFeePercent = 10
    } = await request.json();

    if (!amount || !salonId || !customerId || !serviceId || !appointmentTime || !appointmentId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get salon with Stripe account
    const salons = await query(
      `SELECT stripe_account_id, stripe_onboarded, salon_name FROM salons WHERE id = ?`,
      [salonId]
    );

    if (salons.length === 0) {
      return NextResponse.json(
        { error: 'Salon not found' },
        { status: 404 }
      );
    }

    const salon = salons[0];

    if (!salon?.stripe_account_id) {
      return NextResponse.json(
        { error: 'Salon has not connected Stripe account' },
        { status: 400 }
      );
    }

    if (!salon?.stripe_onboarded) {
      return NextResponse.json(
        { error: 'Salon has not completed Stripe onboarding' },
        { status: 400 }
      );
    }

    // Calculate platform fee
    const platformFee = Math.round(amount * (platformFeePercent / 100));

    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      transfer_data: {
        destination: salon.stripe_account_id,
      },
      application_fee_amount: platformFee,
      metadata: {
        appointment_id: appointmentId,
        salon_id: salonId,
        customer_id: customerId,
        service_id: serviceId,
        salon_name: salon.salon_name
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // FIXED: Use correct table name 'appointments' (check your actual table name)
    await query(
      `UPDATE appointments 
       SET payment_intent_id = ?, 
           payment_client_secret = ?,
           amount = ?, 
           platform_fee = ?,
           payment_status = 'pending'
       WHERE id = ?`,
      [paymentIntent.id, paymentIntent.client_secret, amount, platformFee, appointmentId]
    );

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      appointmentId: appointmentId,
      amount: amount,
      platformFee: platformFee
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment' },
      { status: 500 }
    );
  }
}