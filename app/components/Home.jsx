"use client";

import { useState } from "react";
import BidModal from "./BidModal";
import Crown from "./Crown";

function money(n) {
  return `$${n.toLocaleString("en-US")}`;
}

function initials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Logo({ name, size = 56 }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-char text-cream/80 font-mono font-medium"
      style={{ width: size, height: size, fontSize: size * 0.32 }}
    >
      {initials(name)}
    </div>
  );
}

export default function Home({ projects }) {
  const [modalTarget, setModalTarget] = useState(null); // null | "new" | project

  const [leader, ...rest] = projects;

  return (
    <main className="mx-auto max-w-3xl px-6 pb-32">
      {/* Header */}
      <header className="flex items-center justify-between py-8">
        <div className="flex items-center gap-2">
          <Crown className="h-6 w-6 text-volt" />
          <span className="text-lg font-bold tracking-tight">MemeBid</span>
        </div>
        <button
          onClick={() => setModalTarget("new")}
          className="rounded border border-cream/20 px-4 py-2 text-sm font-medium text-cream/90 transition-colors hover:border-volt hover:text-volt"
        >
          List your project
        </button>
      </header>

      {/* Hero */}
      <section className="py-16 sm:py-24">
        <h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl">
          Outbid.
          <br />
          Take #1.
        </h1>
        <p className="mt-6 max-w-md text-lg text-bone">
          One leaderboard. No votes, no vibes — the project willing to pay
          the most holds the top spot. The internet decides.
        </p>
        <button
          onClick={() => setModalTarget("new")}
          className="mt-9 rounded bg-volt px-6 py-3 font-mono text-sm font-bold text-ink transition-transform hover:scale-[1.02]"
        >
          Enter the arena
        </button>
      </section>

      {/* Leaderboard */}
      {leader && (
        <section className="border-t border-cream/10 pt-12">
          <div className="flex items-center justify-between rounded-lg border border-gold/30 bg-char p-6">
            <div className="flex items-center gap-4">
              <Crown className="h-8 w-8 shrink-0 text-gold" filled />
              <Logo name={leader.name} size={64} />
              <div>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-2xl font-bold">{leader.name}</h2>
                  {leader.ticker && (
                    <span className="font-mono text-sm text-bone">
                      {leader.ticker}
                    </span>
                  )}
                </div>
                <p className="mt-1 max-w-xs text-sm text-bone">
                  {leader.description}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-2xl font-bold text-gold">
                {money(leader.totalBid)}
              </div>
              <button
                onClick={() => setModalTarget(leader)}
                className="mt-2 text-xs font-medium text-bone underline decoration-cream/30 underline-offset-4 hover:text-volt"
              >
                Take this spot
              </button>
            </div>
          </div>

          <ol className="mt-3 divide-y divide-cream/10 border-y border-cream/10">
            {rest.map((p, i) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-4 py-4"
              >
                <div className="flex items-center gap-4">
                  <span className="w-6 shrink-0 font-mono text-sm text-bone">
                    {i + 2}
                  </span>
                  <Logo name={p.name} size={40} />
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold">{p.name}</span>
                      {p.ticker && (
                        <span className="font-mono text-xs text-bone">
                          {p.ticker}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-bone">{p.description}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  <span className="font-mono text-sm text-cream/90">
                    {money(p.totalBid)}
                  </span>
                  <button
                    onClick={() => setModalTarget(p)}
                    className="rounded border border-cream/20 px-3 py-1.5 text-xs font-medium hover:border-volt hover:text-volt"
                  >
                    Outbid
                  </button>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {modalTarget && (
        <BidModal target={modalTarget} onClose={() => setModalTarget(null)} />
      )}
    </main>
  );
}
