-- ============================================================
-- Migration 0021: Accessories category + sub-categories
-- Adds an "accessories" parent and three sub-slugs (caps, belts,
-- bracelets) so the new /accessories page can filter by tile.
-- ============================================================

INSERT INTO public.categories (slug, label, parent_slug, sort_order) VALUES
  ('accessories', 'Accessories', NULL,           6),
  ('caps',        'Caps',        'accessories',  7),
  ('belts',       'Belts',       'accessories',  8),
  ('bracelets',   'Bracelets',   'accessories',  9)
ON CONFLICT (slug) DO NOTHING;
