-- Run this once in Supabase → SQL Editor to create the leaderboard table.

create table if not exists projects (
  id text primary key,
  name text not null,
  ticker text,
  description text,
  logo_url text,
  project_url text,
  total_bid numeric not null default 0,
  created_at timestamptz not null default now(),
  last_bid_at timestamptz not null default now()
);

-- The app talks to this table only through the service-role key from
-- server-side code (API routes), so Row Level Security can stay on with
-- no public policies — nothing but your server can touch it.
alter table projects enable row level security;

-- Optional: seed a couple of example rows so the leaderboard isn't empty
-- the first time you open the site. Safe to delete once real projects
-- start bidding.
insert into projects (id, name, ticker, description, total_bid)
values
  ('seed-01', 'DogeKing', '$DKING', 'Community-driven, deflationary, and unreasonably confident.', 1250),
  ('seed-02', 'Pepe Prime', '$PPRIME', 'The frog that refuses to stay dormant.', 800),
  ('seed-03', 'Turbo Cat', '$TCAT', 'Nine lives, zero patience.', 300)
on conflict (id) do nothing;
