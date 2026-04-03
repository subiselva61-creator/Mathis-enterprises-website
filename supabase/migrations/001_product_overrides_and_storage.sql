-- Run in Supabase SQL Editor (or Supabase CLI). The Next.js app uses the service role server-side; no anon policies are required on `product_overrides`.
--
-- After running:
-- 1. Authentication → disable public sign-ups (or restrict providers); create an admin user with email + password.
-- 2. Copy project URL, anon key, and service role key into `.env.local` (see `.env.example`).
-- 3. Set `ADMIN_EMAILS` to the same email as the admin user (comma-separated if multiple).

create table if not exists public.product_overrides (
  product_id text primary key,
  price numeric,
  description text,
  images jsonb,
  price_on_request boolean,
  skip_indiamart_price boolean not null default false,
  updated_at timestamptz not null default now()
);

create index if not exists product_overrides_updated_at_idx on public.product_overrides (updated_at desc);

alter table public.product_overrides enable row level security;

-- No GRANT to anon/authenticated on this table: only the service role (used server-side) can read/write.

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "product_images_public_read" on storage.objects;
create policy "product_images_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'product-images');
