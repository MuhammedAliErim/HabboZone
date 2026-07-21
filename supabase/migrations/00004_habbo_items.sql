-- 1. Eşya Kategorileri
CREATE TABLE public.habbo_item_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Eşyalar
CREATE TABLE public.habbo_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES public.habbo_item_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  current_value NUMERIC DEFAULT 0,
  currency_type TEXT DEFAULT 'Kredi', -- 'Kredi', 'Elmas', vs.
  is_ltd BOOLEAN DEFAULT false,
  ltd_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Değer Geçmişi (Logları)
CREATE TABLE public.habbo_item_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID REFERENCES public.habbo_items(id) ON DELETE CASCADE,
  value NUMERIC NOT NULL,
  currency_type TEXT NOT NULL,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS POLICIES --

-- habbo_item_categories
ALTER TABLE public.habbo_item_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories viewable by everyone" ON public.habbo_item_categories FOR SELECT USING (true);
CREATE POLICY "Categories insertable by admins" ON public.habbo_item_categories FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Categories updatable by admins" ON public.habbo_item_categories FOR UPDATE USING (public.is_admin());
CREATE POLICY "Categories deletable by admins" ON public.habbo_item_categories FOR DELETE USING (public.is_admin());

-- habbo_items
ALTER TABLE public.habbo_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Items viewable by everyone" ON public.habbo_items FOR SELECT USING (true);
CREATE POLICY "Items insertable by admins" ON public.habbo_items FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Items updatable by admins" ON public.habbo_items FOR UPDATE USING (public.is_admin());
CREATE POLICY "Items deletable by admins" ON public.habbo_items FOR DELETE USING (public.is_admin());

-- habbo_item_values
ALTER TABLE public.habbo_item_values ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Item values viewable by everyone" ON public.habbo_item_values FOR SELECT USING (true);
CREATE POLICY "Item values insertable by admins" ON public.habbo_item_values FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Item values deletable by admins" ON public.habbo_item_values FOR DELETE USING (public.is_admin());

-- STORAGE BUCKETS --
-- Requires running as superuser in Supabase.
INSERT INTO storage.buckets (id, name, public) VALUES ('habbo_items', 'habbo_items', true) ON CONFLICT (id) DO NOTHING;
