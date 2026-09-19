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

function Ticker({ projects }) {
  const items = [...projects].sort((a, b) => b.totalBid - a.totalBid);
  const line = items.map((p, i) => (
    <span key={p.id} className="inline-flex items-center gap-2 px-6">
      <span className="text-bone">#{i + 1}</span>
      <span className="font-semibold text-cream">{p.name}</span>
      {p.ticker && <span className="text-bone">{p.ticker}</span>}
      <span className="text-volt">{money(p.totalBid)}</span>
    </span>
  ));

  return (
    <div className="marquee-group overflow-hidden border-y border-cream/10 bg-char py-2 font-mono text-sm">
      <div className="marquee-track flex w-max">
        <div className="flex">{line}</div>
        <div className="flex" aria-hidden="true">
          {line}
        </div>
      </div>
    </div>
  );
}

export default function Home({ projects }) {
  const [modalTarget, setModalTarget] = useState(null); // null | "new" | project

  const [leader, ...rest] = projects;
  const totalPot = projects.reduce((sum, p) => sum + p.totalBid, 0);

  return (
    <main className="min-h-screen bg-grid">
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-7">
        <div className="flex items-center gap-2">
          <Crown className="h-6 w-6 text-volt" />
          <span className="text-lg font-bold tracking-tight">Memvoro</span>
        </div>
        <button
          onClick={() => setModalTarget("new")}
          className="rounded border border-cream/20 px-4 py-2 text-sm font-medium text-cream/90 transition-colors hover:border-volt hover:text-volt"
        >
          List your project
        </button>
      </header>

      {projects.length > 0 && <Ticker projects={projects} />}

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:py-20 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl">
            Outbid.
            <br />
            Take #1.
          </h1>
          <p className="mt-6 text-lg text-bone">
            One leaderboard. No votes, no vibes — the project willing to pay
            the most holds the top spot. The internet decides.
          </p>
          <div className="mt-9 flex items-center gap-6">
            <button
              onClick={() => setModalTarget("new")}
              className="rounded bg-volt px-6 py-3 font-mono text-sm font-bold text-ink transition-transform hover:scale-[1.02]"
            >
              Enter the arena
            </button>
            <div>
              <div className="font-mono text-xl font-bold text-cream">
                {money(totalPot)}
              </div>
              <div className="text-xs text-bone">total pot, all-time</div>
            </div>
          </div>
        </div>

        {leader && (
          <div className="relative w-full max-w-sm rounded-lg border border-gold/30 bg-char p-6 lg:w-80">
            <div className="absolute -top-3 left-6 flex items-center gap-1.5 rounded-full bg-ink px-3 py-1 text-xs font-medium text-gold">
              <Crown className="h-3.5 w-3.5" filled />
              Currently #1
            </div>
            <div className="mt-3 flex items-center gap-4">
              <Logo name={leader.name} size={56} />
              <div>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-xl font-bold">{leader.name}</h2>
                </div>
                {leader.ticker && (
                  <span className="font-mono text-xs text-bone">
                    {leader.ticker}
                  </span>
                )}
              </div>
            </div>
            <p className="mt-4 text-sm text-bone">{leader.description}</p>
            <div className="mt-5 flex items-end justify-between">
              <div className="font-mono text-2xl font-bold text-gold">
                {money(leader.totalBid)}
              </div>
              <button
                onClick={() => setModalTarget(leader)}
                className="text-xs font-medium text-bone underline decoration-cream/30 underline-offset-4 hover:text-volt"
              >
                Take this spot
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Leaderboard */}
      {rest.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-32">
          <ol className="divide-y divide-cream/10 border-y border-cream/10">
            {rest.map((p, i) => {
              const share = leader ? Math.max(4, (p.totalBid / leader.totalBid) * 100) : 0;
              return (
                <li key={p.id} className="relative overflow-hidden py-5">
                  <div
                    className="absolute inset-y-0 left-0 bg-cream/[0.03]"
                    style={{ width: `${share}%` }}
                    aria-hidden="true"
                  />
                  <div className="relative flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className="w-6 shrink-0 font-mono text-sm text-bone">
                        {i + 2}
                      </span>
                      <Logo name={p.name} size={44} />
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-semibold">{p.name}</span>
                          {p.ticker && (
                            <span className="font-mono text-xs text-bone">
                              {p.ticker}
                            </span>
                          )}
                        </div>
                        <p className="max-w-md text-sm text-bone">
                          {p.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-5">
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
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {modalTarget && (
        <BidModal target={modalTarget} onClose={() => setModalTarget(null)} />
      )}
    </main>
  );
}
