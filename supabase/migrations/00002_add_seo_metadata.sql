-- Add seo_metadata column to news table
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS seo_metadata JSONB DEFAULT '{}'::jsonb;

-- Add RLS for categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories viewable by everyone." ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can insert categories." ON public.categories FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update categories." ON public.categories FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete categories." ON public.categories FOR DELETE USING (public.is_admin());

-- Add RLS for tags
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tags viewable by everyone." ON public.tags FOR SELECT USING (true);
CREATE POLICY "Admins can insert tags." ON public.tags FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update tags." ON public.tags FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete tags." ON public.tags FOR DELETE USING (public.is_admin());

