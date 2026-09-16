import { getLeaderboard } from "@/lib/store";
import Home from "./components/Home";

// The leaderboard changes every time someone pays, so it must never be
// served from a stale, build-time cache.
export const dynamic = "force-dynamic";

export default async function Page() {
  const projects = await getLeaderboard();
  return <Home projects={projects} />;
}
