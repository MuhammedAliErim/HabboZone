-- 1. MAGAZINES GÜNCELLEMESİ (Zamanlama için)
ALTER TABLE public.magazines ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Zaten published_at sütunu var, aktifleri ve saati gelmiş olanları göstermek için bir policy güncelleyelim.
DROP POLICY IF EXISTS "Magazines are viewable by everyone" ON public.magazines;
CREATE POLICY "Public can view published magazines" ON public.magazines 
FOR SELECT USING (is_active = true AND published_at <= NOW() OR public.is_admin());


-- 2. ODALAR (ROOMS) TABLOSU
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    owner VARCHAR(100) NOT NULL,
    description TEXT,
    max_users INTEGER DEFAULT 100,
    current_users INTEGER DEFAULT 0,
    image_url TEXT,
    category VARCHAR(100) DEFAULT 'Popüler', -- 'Popüler', 'Yeni', 'Etkinlik', 'Resmi'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view rooms"
ON public.rooms FOR SELECT
USING (true);

CREATE POLICY "Staff can insert rooms"
ON public.rooms FOR INSERT
WITH CHECK (public.is_admin());

CREATE POLICY "Staff can update rooms"
ON public.rooms FOR UPDATE
USING (public.is_admin());

CREATE POLICY "Staff can delete rooms"
ON public.rooms FOR DELETE
USING (public.is_admin());


-- 3. REHBERLER (GUIDES) TABLOSU
CREATE TABLE IF NOT EXISTS public.guides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'Temel Rehber', 'Ticaret', 'Güvenlik', 'Mimari'
    content TEXT NOT NULL,
    read_time VARCHAR(50),
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view guides"
ON public.guides FOR SELECT
USING (true);

CREATE POLICY "Staff can insert guides"
ON public.guides FOR INSERT
WITH CHECK (public.is_admin());

CREATE POLICY "Staff can update guides"
ON public.guides FOR UPDATE
USING (public.is_admin());

CREATE POLICY "Staff can delete guides"
ON public.guides FOR DELETE
USING (public.is_admin());


-- 4. BUCKETS (Odalar ve Rehberler için resim yükleme alanları)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('rooms', 'rooms', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Room images are public" ON storage.objects FOR SELECT USING (bucket_id = 'rooms');
CREATE POLICY "Admins can upload room images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'rooms' AND public.is_admin());
CREATE POLICY "Admins can delete room images" ON storage.objects FOR DELETE USING (bucket_id = 'rooms' AND public.is_admin());

INSERT INTO storage.buckets (id, name, public) 
VALUES ('guides', 'guides', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Guide images are public" ON storage.objects FOR SELECT USING (bucket_id = 'guides');
CREATE POLICY "Admins can upload guide images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'guides' AND public.is_admin());
CREATE POLICY "Admins can delete guide images" ON storage.objects FOR DELETE USING (bucket_id = 'guides' AND public.is_admin());
