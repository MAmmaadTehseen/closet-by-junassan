-- Closet by Junassan — 0001 initial schema
-- Run migrations in order in the Supabase SQL editor.

create extension if not exists pgcrypto;

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null check (length(name) between 1 and 200),
  description text check (description is null or length(description) <= 2000),
  brand text check (brand is null or length(brand) <= 120),
  category text not null check (category in ('men','women','kids','shoes','bags')),
  price_pkr integer not null check (price_pkr >= 0),
  original_price_pkr integer check (original_price_pkr is null or original_price_pkr >= 0),
  size text check (size is null or length(size) <= 20),
  condition text check (condition is null or length(condition) <= 40),
  stock integer not null default 1 check (stock >= 0),
  original_stock integer check (original_stock is null or original_stock >= 0),
  fabric text check (fabric is null or length(fabric) <= 200),
  measurements text check (measurements is null or length(measurements) <= 300),
  care text check (care is null or length(care) <= 300),
  images text[] not null default '{}',
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_created_idx
  on products (category, created_at desc);
create index if not exists products_tags_gin_idx
  on products using gin (tags);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  public_code text unique not null,
  full_name text not null check (length(full_name) between 2 and 80),
  phone text not null check (phone ~ '^03[0-9]{9}$'),
  city text not null check (length(city) between 2 and 60),
  address text not null check (length(address) between 5 and 300),
  notes text check (notes is null or length(notes) <= 500),
  subtotal_pkr integer not null check (subtotal_pkr >= 0),
  total_pkr integer not null check (total_pkr >= 0),
  status text not null default 'pending'
    check (status in ('pending','confirmed','shipped','delivered','cancelled')),
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_created_idx on orders (created_at desc);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  name text not null,
  price_pkr integer not null check (price_pkr >= 0),
  quantity integer not null check (quantity > 0 and quantity <= 10),
  size text
);

create index if not exists order_items_order_idx on order_items (order_id);

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 1 and 80),
  email text not null check (length(email) between 3 and 200),
  message text not null check (length(message) between 1 and 2000),
  ip_hash text,
  created_at timestamptz not null default now()
);

create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  phone text unique check (phone is null or phone ~ '^03[0-9]{9}$'),
  email text unique check (email is null or length(email) between 3 and 200),
  created_at timestamptz not null default now()
);

-- updated_at trigger
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_products_updated_at on products;
create trigger trg_products_updated_at before update on products
  for each row execute function set_updated_at();

drop trigger if exists trg_orders_updated_at on orders;
create trigger trg_orders_updated_at before update on orders
  for each row execute function set_updated_at();
