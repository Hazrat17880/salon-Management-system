// app/api/stripe/webhook/route.js
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { query } from '@/lib/dbConnection';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    console.log('✅ Webhook received:', event.type);
  } catch (err) {
    console.error(`❌ Webhook signature verification failed:`, err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'account.updated':
      const account = event.data.object;
      console.log('Account updated:', account.id);
      
      // FIXED: Use raw SQL instead of query.salons.updateMany
      await query(
        `UPDATE salons 
         SET stripe_onboarded = ?, 
             stripe_account_status = ?,
             updated_at = NOW()
         WHERE stripe_account_id = ?`,
        [
          account.charges_enabled && account.payouts_enabled ? 1 : 0,
          account.charges_enabled ? 'active' : 'pending',
          account.id
        ]
      );
      
      console.log(`Account ${account.id} updated, onboarded: ${account.charges_enabled}`);
      break;

    case 'account.application.deauthorized':
      const deauthorizedAccount = event.data.object;
      console.log('Account deauthorized:', deauthorizedAccount.id);
      
      // FIXED: Use raw SQL
      await query(
        `UPDATE salons 
         SET stripe_onboarded = 0, 
             stripe_account_status = 'deauthorized',
             updated_at = NOW()
         WHERE stripe_account_id = ?`,
        [deauthorizedAccount.id]
      );
      
      console.log(`Account ${deauthorizedAccount.id} deauthorized`);
      break;

    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent succeeded:', paymentIntent.id);
      
      // Update appointment status
      if (paymentIntent.metadata?.appointment_id) {
        await query(
          `UPDATE appointments 
           SET payment_status = 'paid', 
               status = 'confirmed'
           WHERE payment_intent_id = ?`,
          [paymentIntent.id]
        );
        console.log(`Appointment ${paymentIntent.metadata.appointment_id} confirmed`);
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      
      if (failedPayment.metadata?.appointment_id) {
        await query(
          `UPDATE appointments 
           SET payment_status = 'failed'
           WHERE payment_intent_id = ?`,
          [failedPayment.id]
        );
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}