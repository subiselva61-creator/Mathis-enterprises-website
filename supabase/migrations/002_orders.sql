-- COD checkout orders. Inserts use the Supabase service role from server actions only (no anon policies).

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  shipping_address jsonb not null,
  line_items jsonb not null,
  subtotal_cents integer not null,
  currency text not null,
  payment_method text not null default 'cod' check (payment_method = 'cod'),
  status text not null default 'pending'
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);

alter table public.orders enable row level security;

-- Explicit API access (helps if PostgREST role grants differ from defaults).
grant usage on schema public to postgres, anon, authenticated, service_role;
grant all on table public.orders to postgres, service_role;
grant select on table public.orders to authenticated;

-- Allow service_role when RLS is evaluated for that role.
create policy "orders_service_role_all"
  on public.orders
  for all
  to service_role
  using (true)
  with check (true);
