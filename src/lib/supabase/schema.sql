-- ============================================================================
-- OmniPic — Supabase schema
-- ============================================================================
-- Run this in the Supabase SQL editor (or via `supabase db push`) to
-- provision the application tables, indexes, RLS policies, and helper
-- functions used by the OmniPic app.
--
-- Safe to re-run: uses `if not exists` / `create or replace` guards.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Extensions
-- ----------------------------------------------------------------------------
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'plan_type') then
    create type plan_type as enum ('weekly', 'monthly', 'annual');
  end if;

  if not exists (select 1 from pg_type where typname = 'subscription_status') then
    create type subscription_status as enum (
      'active', 'trialing', 'past_due', 'canceled',
      'unpaid', 'incomplete', 'incomplete_expired'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'payment_status') then
    create type payment_status as enum ('succeeded', 'pending', 'failed', 'refunded');
  end if;

  if not exists (select 1 from pg_type where typname = 'image_processing_status') then
    create type image_processing_status as enum ('queued', 'processing', 'completed', 'failed');
  end if;
end$$;

-- ----------------------------------------------------------------------------
-- Users (mirrors auth.users, extended with profile data)
-- ----------------------------------------------------------------------------
create table if not exists public.users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  name text,
  avatar_url text,
  provider text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists users_email_idx on public.users(email);

-- ----------------------------------------------------------------------------
-- Subscriptions
-- ----------------------------------------------------------------------------
create table if not exists public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  plan_type plan_type not null,
  status subscription_status not null default 'incomplete',
  stripe_customer_id text,
  stripe_subscription_id text unique,
  stripe_product_id text,
  stripe_price_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  canceled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);
create index if not exists subscriptions_status_idx on public.subscriptions(status);
create index if not exists subscriptions_stripe_customer_idx on public.subscriptions(stripe_customer_id);

-- ----------------------------------------------------------------------------
-- Payments
-- ----------------------------------------------------------------------------
create table if not exists public.payments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  stripe_payment_intent_id text,
  stripe_invoice_id text,
  amount_cents integer not null,
  currency text not null default 'usd',
  status payment_status not null default 'pending',
  description text,
  receipt_url text,
  created_at timestamptz not null default now()
);

create index if not exists payments_user_id_idx on public.payments(user_id);
create index if not exists payments_subscription_id_idx on public.payments(subscription_id);
create index if not exists payments_created_at_idx on public.payments(created_at desc);

-- ----------------------------------------------------------------------------
-- Image processing jobs
-- ----------------------------------------------------------------------------
create table if not exists public.image_processing (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  service_type text not null,
  status image_processing_status not null default 'queued',
  input_url text,
  output_url text,
  metadata jsonb,
  error_message text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists image_processing_user_id_idx on public.image_processing(user_id);
create index if not exists image_processing_status_idx on public.image_processing(status);
create index if not exists image_processing_created_at_idx on public.image_processing(created_at desc);

-- ----------------------------------------------------------------------------
-- Updated-at trigger
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at
before update on public.users
for each row execute function public.set_updated_at();

drop trigger if exists subscriptions_set_updated_at on public.subscriptions;
create trigger subscriptions_set_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------
alter table public.users enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payments enable row level security;
alter table public.image_processing enable row level security;

-- ------- Users -------
drop policy if exists "users_select_own" on public.users;
create policy "users_select_own" on public.users
for select using (auth.uid() = id);

drop policy if exists "users_update_own" on public.users;
create policy "users_update_own" on public.users
for update using (auth.uid() = id) with check (auth.uid() = id);

-- ------- Subscriptions -------
drop policy if exists "subscriptions_select_own" on public.subscriptions;
create policy "subscriptions_select_own" on public.subscriptions
for select using (auth.uid() = user_id);

-- Writes are done server-side with the service role (webhooks), so no
-- insert/update/delete policies are exposed to regular users.

-- ------- Payments -------
drop policy if exists "payments_select_own" on public.payments;
create policy "payments_select_own" on public.payments
for select using (auth.uid() = user_id);

-- ------- Image processing -------
drop policy if exists "image_processing_select_own" on public.image_processing;
create policy "image_processing_select_own" on public.image_processing
for select using (auth.uid() = user_id);

drop policy if exists "image_processing_insert_own" on public.image_processing;
create policy "image_processing_insert_own" on public.image_processing
for insert with check (auth.uid() = user_id);

drop policy if exists "image_processing_update_own" on public.image_processing;
create policy "image_processing_update_own" on public.image_processing
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- Helper view: latest active subscription per user
-- ----------------------------------------------------------------------------
create or replace view public.active_subscriptions as
select distinct on (user_id) *
from public.subscriptions
where status in ('active', 'trialing')
order by user_id, current_period_end desc nulls last, created_at desc;

-- ============================================================================
-- End of schema
-- ============================================================================
