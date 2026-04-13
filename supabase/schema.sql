-- Closet by Junassan — Supabase schema
-- Run in the Supabase SQL editor.

create extension if not exists pgcrypto;

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  brand text,
  category text not null check (category in ('men','women','kids','shoes','bags')),
  price_pkr integer not null,
  size text,
  condition text,
  stock integer not null default 1,
  images text[] not null default '{}',
  tags text[] not null default '{}',
  created_at timestamptz default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  city text not null,
  address text not null,
  notes text,
  subtotal_pkr integer not null,
  status text not null default 'pending',
  created_at timestamptz default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid,
  name text not null,
  price_pkr integer not null,
  quantity integer not null
);

alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

drop policy if exists "public read products" on products;
create policy "public read products" on products for select using (true);

drop policy if exists "public insert orders" on orders;
create policy "public insert orders" on orders for insert with check (true);

drop policy if exists "public insert order_items" on order_items;
create policy "public insert order_items" on order_items for insert with check (true);
