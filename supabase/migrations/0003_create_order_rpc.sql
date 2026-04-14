-- Closet by Junassan — 0003 atomic order creation RPC
-- Trusted price rehydration + atomic stock decrement + row locking.

create or replace function create_order_rpc(
  p_full_name  text,
  p_phone      text,
  p_city       text,
  p_address    text,
  p_notes      text,
  p_items      jsonb,      -- [{ product_id: uuid, quantity: int }]
  p_ip_hash    text,
  p_user_agent text
) returns table(order_id uuid, public_code text, total_pkr integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id   uuid;
  v_public     text;
  v_item       jsonb;
  v_product    products%rowtype;
  v_qty        int;
  v_subtotal   int := 0;
begin
  -- Lock each product row and validate stock, compute trusted subtotal.
  for v_item in select * from jsonb_array_elements(p_items) loop
    v_qty := coalesce((v_item->>'quantity')::int, 0);
    if v_qty <= 0 or v_qty > 10 then
      raise exception 'invalid_quantity';
    end if;

    select * into v_product from products
      where id = (v_item->>'product_id')::uuid
      for update;
    if not found then
      raise exception 'product_not_found';
    end if;
    if v_product.stock < v_qty then
      raise exception 'out_of_stock';
    end if;

    update products
       set stock = stock - v_qty
     where id = v_product.id;

    v_subtotal := v_subtotal + v_product.price_pkr * v_qty;
  end loop;

  v_public := 'CBJ-' || upper(substring(replace(gen_random_uuid()::text,'-','') for 8));

  insert into orders(
    public_code, full_name, phone, city, address, notes,
    subtotal_pkr, total_pkr, ip_hash, user_agent
  ) values (
    v_public, p_full_name, p_phone, p_city, p_address, p_notes,
    v_subtotal, v_subtotal, p_ip_hash, p_user_agent
  )
  returning id into v_order_id;

  insert into order_items(order_id, product_id, name, price_pkr, quantity, size)
  select
    v_order_id,
    (i->>'product_id')::uuid,
    p.name,
    p.price_pkr,
    (i->>'quantity')::int,
    p.size
  from jsonb_array_elements(p_items) i
  join products p on p.id = (i->>'product_id')::uuid;

  return query select v_order_id, v_public, v_subtotal;
end;
$$;

revoke all on function create_order_rpc(text,text,text,text,text,jsonb,text,text) from public;
grant execute on function create_order_rpc(text,text,text,text,text,jsonb,text,text) to service_role;
