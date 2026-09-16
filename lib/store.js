// lib/store.js
//
// Data layer backed by Supabase (managed Postgres). Every other file in
// the app only calls these functions — if you ever need to swap the
// backing store again, this is the one file to touch.

import { nanoid } from "nanoid";
import { supabase } from "./supabase";

export async function getLeaderboard() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("total_bid", { ascending: false });

  if (error) {
    console.error("getLeaderboard error:", error.message);
    return [];
  }

  return data.map(toClientShape);
}

export async function getProject(id) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("getProject error:", error.message);
    return null;
  }

  return data ? toClientShape(data) : null;
}

// Called by the Stripe webhook once a payment actually succeeds.
// `payload` is the pending-bid data we stashed in the Checkout Session's
// metadata when it was created (see app/api/checkout/route.js).
export async function applyPaidBid(payload) {
  const { projectId, amount, name, ticker, description, logoUrl, projectUrl } =
    payload;

  const id = projectId || nanoid(8);
  const existing = await getProject(id);

  if (existing) {
    const { error } = await supabase
      .from("projects")
      .update({
        total_bid: existing.totalBid + amount,
        last_bid_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) console.error("applyPaidBid update error:", error.message);
    return;
  }

  const { error } = await supabase.from("projects").insert({
    id,
    name,
    ticker,
    description,
    logo_url: logoUrl,
    project_url: projectUrl,
    total_bid: amount,
    last_bid_at: new Date().toISOString(),
  });

  if (error) console.error("applyPaidBid insert error:", error.message);
}

function toClientShape(row) {
  return {
    id: row.id,
    name: row.name,
    ticker: row.ticker,
    description: row.description,
    logoUrl: row.logo_url,
    projectUrl: row.project_url,
    totalBid: Number(row.total_bid),
    createdAt: row.created_at,
    lastBidAt: row.last_bid_at,
  };
}
