-- Dummy thrift products. Run after schema.sql.
insert into products (slug, name, description, brand, category, price_pkr, size, condition, stock, images, tags) values
('vintage-denim-jacket','Vintage Washed Denim Jacket','Pre-loved classic denim jacket in a relaxed fit.','Levi''s','men',3200,'L','9/10',1,
 array['https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=900&q=80'], array['new','limited']),
('oversized-linen-shirt','Oversized Linen Shirt','Breathable linen in off-white.','Zara','men',1800,'M','9/10',2,
 array['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80'], array['new']),
('silk-slip-dress','Silk Slip Dress','Elegant silk slip dress in champagne tone.','Mango','women',3500,'S','9/10',1,
 array['https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=80'], array['new','limited','trending']),
('white-leather-sneakers','White Leather Sneakers','Clean white leather sneakers, barely worn.','Adidas','shoes',3800,'42','9/10',1,
 array['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80'], array['new','limited','trending']),
('leather-tote-bag','Leather Tote Bag','Spacious leather tote in caramel.','Mango','bags',3400,'Free','9/10',1,
 array['https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80'], array['new','limited','trending']),
('kids-hoodie','Kids Cozy Hoodie','Soft fleece hoodie for kids.','Gap Kids','kids',1400,'M','9/10',2,
 array['https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=900&q=80'], array['new']);
-- Add more rows as needed — seed-data.ts contains 24 products you can mirror here.
