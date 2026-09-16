import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { applyPaidBid } from "@/lib/store";

// Stripe needs the raw request body to verify the signature, so this
// route can't use the default JSON body parsing.
export const runtime = "nodejs";

export async function POST(req) {
  const sig = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const m = session.metadata || {};

    await applyPaidBid({
      projectId: m.projectId,
      amount: Number(m.amount),
      name: m.name,
      ticker: m.ticker,
      description: m.description,
      logoUrl: m.logoUrl,
      projectUrl: m.projectUrl,
    });
  }

  return NextResponse.json({ received: true });
}
