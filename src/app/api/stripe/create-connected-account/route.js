import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { query } from '@/lib/dbConnection';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    // Check if body exists
    const text = await request.text();
    if (!text) {
      return NextResponse.json(
        { error: 'Request body is empty' },
        { status: 400 }
      );
    }

    // Parse JSON
    const body = JSON.parse(text);
    const salonId = body.salonId;

    if (!salonId) {
      return NextResponse.json(
        { error: 'salonId is required' },
        { status: 400 }
      );
    }

    // 1️⃣ Create a new Express connected account
    const account = await stripe.accounts.create({
      type: "express",
      business_type: "individual",
    });

    // 2️⃣ Save account.id in DB for this salon
await query('UPDATE salons SET stripe_account_id = ? WHERE id = ?', [account.id, salonId]);

    // 3️⃣ Create account link (for onboarding)
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_URL}/salon/profile`,
      return_url: `${process.env.NEXT_PUBLIC_URL}/salon-dashboard/bank-account`,
      type: "account_onboarding",
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error) {
    console.error('Error:', error);
    
    // Handle JSON parsing errors specifically
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message }, 
      { status: 500 }
    );
  }
}