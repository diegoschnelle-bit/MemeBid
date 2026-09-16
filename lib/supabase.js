import { createClient } from "@supabase/supabase-js";

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    "SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set. The leaderboard will not load until you add them to .env.local"
  );
}

// Service-role client — full read/write, no row-level-security checks.
// Only ever import this from server code (API routes, server components).
// Never send this key to the browser.
export const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  { auth: { persistSession: false } }
);
