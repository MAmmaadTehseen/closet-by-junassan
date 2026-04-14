-- Closet by Junassan — 0002 RLS hardening
-- Default-deny everything except anon read on products.
-- All writes (orders, contact_messages, subscribers) MUST go through
-- SUPABASE_SERVICE_ROLE_KEY on the server, which bypasses RLS.

alter table products          enable row level security;
alter table orders            enable row level security;
alter table order_items       enable row level security;
alter table contact_messages  enable row level security;
alter table subscribers       enable row level security;

-- Drop any legacy permissive policies from earlier schemas.
drop policy if exists "public read products"      on products;
drop policy if exists "public insert orders"      on orders;
drop policy if exists "public insert order_items" on order_items;

-- Products: anon & authenticated may SELECT. No insert/update/delete policy => default deny.
create policy "anon read products" on products
  for select to anon, authenticated using (true);

-- Orders: NO policies. Default-deny. Only service_role can read/write.
-- Order items: NO policies. Same.
-- Contact messages: NO policies. Same.
-- Subscribers: NO policies. Same.
