// app/api/stripe/get-payment-intent/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/dbConnection';
import { getServerSession } from 'next-auth';
import { authOptions } from "../../auth/[...nextauth]/route"

export async function POST(request) {
  console.log("get payment intent API called");
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { appointmentId } = await request.json();
    console.log("Appointment ID:", appointmentId);

    if (!appointmentId) {
      return NextResponse.json({ error: 'appointmentId is required' }, { status: 400 });
    }

    // Get the numeric user ID from database using provider_id (Google ID)
    const users = await query(
      `SELECT id FROM users WHERE provider_id = ? OR email = ?`,
      [session.user.id, session.user.email]
    );

    console.log("Users found:", users);

    if (users.length === 0) {
      return NextResponse.json({ 
        error: 'User not found in database',
        googleId: session.user.id,
        email: session.user.email
      }, { status: 404 });
    }

    const numericUserId = users[0].id;
    console.log("Numeric User ID:", numericUserId);

    // Get the appointment using the numeric user ID
    const appointments = await query(
      `SELECT a.*, s.Title as service_name 
       FROM appointment a
       LEFT JOIN salon_services s ON a.services_id = s.id
       WHERE a.id = ? AND a.user_id = ?`,
      [appointmentId, numericUserId]
    );

    console.log("Appointments found:", appointments);

    if (appointments.length === 0) {
      return NextResponse.json({ 
        error: 'Appointment not found for this user',
        appointmentId,
        numericUserId
      }, { status: 404 });
    }

    const appointment = appointments[0];

    // Get client secret
    let clientSecret = appointment.payment_client_secret;
    
    if (!clientSecret && appointment.payment_intent_id) {
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