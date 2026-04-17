-- ============================================================
-- Migration 0004: Dynamic Categories
-- Creates categories table and migrates products.category
-- from a hard-coded enum to a plain text column.
-- ============================================================

-- 1. Create the categories table
CREATE TABLE IF NOT EXISTS public.categories (
  slug        TEXT PRIMARY KEY,
  label       TEXT NOT NULL,
  parent_slug TEXT REFERENCES public.categories(slug) ON DELETE SET NULL,
  cover_image TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Seed the five original categories (idempotent)
INSERT INTO public.categories (slug, label, sort_order) VALUES
  ('men',   'Men',   1),
  ('women', 'Women', 2),
  ('kids',  'Kids',  3),
  ('shoes', 'Shoes', 4),
  ('bags',  'Bags',  5)
ON CONFLICT (slug) DO NOTHING;

-- 3. Migrate products.category from enum to text
--    (Safe: TEXT is a superset of the enum values.)
DO $$
BEGIN
  -- Only alter if the column type is not already text
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'products'
      AND column_name  = 'category'
      AND data_type   != 'text'
  ) THEN
    ALTER TABLE public.products
      ALTER COLUMN category TYPE TEXT USING category::TEXT;
  END IF;
END $$;

-- Drop the enum type if it still exists (after the column migration)
DROP TYPE IF EXISTS public.product_category CASCADE;

-- 4. Enable RLS on categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Public read (anyone can see categories)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'categories'
      AND policyname = 'categories_public_read'
  ) THEN
    CREATE POLICY "categories_public_read" ON public.categories
      FOR SELECT USING (true);
  END IF;
END $$;
