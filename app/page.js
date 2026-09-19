import { getLeaderboard, getTodayLeaderboard, getHallOfFame } from "@/lib/store";
import Home from "./components/Home";

// The leaderboard changes every time someone pays, so it must never be
// served from a stale, build-time cache.
export const dynamic = "force-dynamic";

export default async function Page() {
  const [allTimeProjects, todayProjects, hallOfFame] = await Promise.all([
    getLeaderboard(),
    getTodayLeaderboard(),
    getHallOfFame(),
  ]);

  return (
    <Home
      allTimeProjects={allTimeProjects}
      todayProjects={todayProjects}
      hallOfFame={hallOfFame}
    />
  );
}
