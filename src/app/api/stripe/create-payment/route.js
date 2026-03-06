// app/api/stripe/create-payment/route.js
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { query } from '@/lib/dbConnection';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  console.log("🔵 Create payment API called");
  
  try {
    // Log all cookies to debug
    const cookieHeader = request.headers.get('cookie');
    console.log("📦 Cookies present:", !!cookieHeader);
    
    if (cookieHeader) {
      const hasNextAuthCookie = cookieHeader.includes('next-auth.session-token') || 
                                cookieHeader.includes('__Secure-next-auth.session-token');
      console.log("🔑 NextAuth cookie present:", hasNextAuthCookie);
    }

    const session = await getServerSession(authOptions);
    console.log("👤 Session found:", !!session);
    
    if (session) {
      console.log("👤 User ID:", session.user?.id);
      console.log("👤 User role:", session.user?.role);
    }

    if (!session) {
      console.log("❌ No session found - returning 401");
      return NextResponse.json(
        { error: 'Unauthorized - No valid session' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log("📦 Request body:", { 
      ...body, 
      amount: body.amount,
      salonId: body.salonId,
      serviceId: body.serviceId,
      appointmentId: body.appointmentId 
    });

    const { 
      amount,
      salonId,
      serviceId,
      appointmentTime,
      appointmentId,
      platformFeePercent = 10
    } = body;
    
    const customerId = session.user.id;

    if (!amount || !salonId || !serviceId || !appointmentTime || !appointmentId) {
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
    console.log("💈 Salon found:", salon.salon_name);
    console.log("💳 Stripe account:", salon.stripe_account_id ? "Present" : "Missing");
    console.log("✅ Stripe onboarded:", salon.stripe_onboarded);

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
    console.log("💳 Creating Stripe payment intent...");
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
    console.log("✅ Payment intent created:", paymentIntent.id);

    // Update appointment
    await query(
      `UPDATE appointment 
       SET payment_intent_id = ?, 
           payment_client_secret = ?,
           amount = ?, 
           platform_fee = ?,
           payment_status = 'pending'
       WHERE id = ?`,
      [paymentIntent.id, paymentIntent.client_secret, amount, platformFee, appointmentId]
    );
    console.log("✅ Appointment updated with payment info");

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      appointmentId: appointmentId,
      amount: amount,
      platformFee: platformFee
    });

  } catch (error) {
    console.error('❌ Payment creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment' },
      { status: 500 }
    );
  }
}