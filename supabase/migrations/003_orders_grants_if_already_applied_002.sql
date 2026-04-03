-- Run this if you already applied an older 002_orders.sql before grants/policies were added.
-- Safe to run multiple times.

grant all on table public.orders to postgres, service_role;

drop policy if exists "orders_service_role_all" on public.orders;
create policy "orders_service_role_all"
  on public.orders
  for all
  to service_role
  using (true)
  with check (true);
