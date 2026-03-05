import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { serviceId, salonId } = req.body;

  // Get salon details from DB
  const salon = await db.salon.findById(salonId);
  const service = await db.services.findById(serviceId);

  if (!salon.stripe_account_id) {
    return res.status(400).json({ error: "Salon has not connected Stripe" });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: service.title },
          unit_amount: Math.round(service.price * 100), // cents
        },
        quantity: 1,
      },
    ],
    payment_intent_data: {
      transfer_data: {
        destination: salon.stripe_account_id,
      },
    },
    success_url: `${process.env.NEXT_PUBLIC_URL}/booking-success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/booking-cancel`,
  });

  res.status(200).json({ url: session.url });
}