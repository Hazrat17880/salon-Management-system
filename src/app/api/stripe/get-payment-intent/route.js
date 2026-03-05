// app/api/bookings/get-payment-intent/route.js (UPDATED)
import { NextResponse } from 'next/server';
import { query } from '@/lib/dbConnection';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { appointmentId } = await request.json(); // Changed from bookingId

    if (!appointmentId) {
      return NextResponse.json({ error: 'appointmentId is required' }, { status: 400 });
    }

    // Get appointment with payment details
    // Make sure to join with services to get service name
    const appointments = await query(
      `SELECT a.*, s.Title as service_name 
       FROM appointments a
       LEFT JOIN services s ON a.service_id = s.id
       WHERE a.id = ? AND a.user_id = ?`,
      [appointmentId, session.user.id]
    );

    if (appointments.length === 0) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    const appointment = appointments[0];

    // Check if payment_intent_id exists and if it's actually a client_secret
    // In your create-payment API, you stored payment_intent_id and payment_client_secret
    let clientSecret = appointment.payment_client_secret;
    
    // If you only stored payment_intent_id, you need to fetch from Stripe
    if (!clientSecret && appointment.payment_intent_id) {
      // You'd need Stripe to retrieve the client_secret
      // This requires importing Stripe
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      const paymentIntent = await stripe.paymentIntents.retrieve(appointment.payment_intent_id);
      clientSecret = paymentIntent.client_secret;
    }

    return NextResponse.json({
      success: true,
      clientSecret: clientSecret,
      appointment: {
        id: appointment.id,
        service_name: appointment.service_name || 'Service',
        amount: appointment.amount,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status
      }
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}