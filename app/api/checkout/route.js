import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { stripe } from "@/lib/stripe";

// Minimum bid enforced server-side — never trust a client-sent price.
const MIN_BID_USD = 10;

export async function POST(req) {
  const body = await req.json();
  const { projectId, amount, name, ticker, description, logoUrl, projectUrl } =
    body || {};

  const bidAmount = Number(amount);
  if (!Number.isFinite(bidAmount) || bidAmount < MIN_BID_USD) {
    return NextResponse.json(
      { error: `Minimum bid is $${MIN_BID_USD}` },
      { status: 400 }
    );
  }

  // New projects must supply a name; existing ones just need a projectId.
  if (!projectId && !name) {
    return NextResponse.json(
      { error: "Missing project name" },
      { status: 400 }
    );
  }

  const origin = req.headers.get("origin") || process.env.APP_URL;

  // Stash everything the webhook needs to apply the bid once payment
  // actually clears. Stripe metadata values must be strings.
  const metadata = {
    projectId: projectId || nanoid(8),
    amount: String(bidAmount),
    name: name || "",
    ticker: ticker || "",
    description: description || "",
    logoUrl: logoUrl || "",
    projectUrl: projectUrl || "",
  };

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: projectId
              ? `Outbid on MemeBid — ${name || projectId}`
              : `Join the MemeBid leaderboard — ${name}`,
            description: "Ranking spot on the MemeBid live leaderboard.",
          },
          unit_amount: Math.round(bidAmount * 100),
        },
        quantity: 1,
      },
    ],
    metadata,
    success_url: `${origin}/?paid=1`,
    cancel_url: `${origin}/?paid=0`,
  });

  return NextResponse.json({ url: session.url });
}
