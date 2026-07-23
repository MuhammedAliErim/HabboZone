-- 1. ANNOUNCEMENTS (SON DAKİKA) TABLOSU
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active announcements"
ON public.announcements FOR SELECT
USING (is_active = true);

CREATE POLICY "Staff can view all announcements"
ON public.announcements FOR SELECT
USING (
    EXISTS (SELECT 1 FROM public.staff WHERE user_id = auth.uid())
);

CREATE POLICY "Staff can insert announcements"
ON public.announcements FOR INSERT
WITH CHECK (
    EXISTS (SELECT 1 FROM public.staff WHERE user_id = auth.uid())
);

CREATE POLICY "Staff can update announcements"
ON public.announcements FOR UPDATE
USING (
    EXISTS (SELECT 1 FROM public.staff WHERE user_id = auth.uid())
);

CREATE POLICY "Staff can delete announcements"
ON public.announcements FOR DELETE
USING (
    EXISTS (SELECT 1 FROM public.staff WHERE user_id = auth.uid())
);


-- 2. EVENTS (ETKİNLİKLER) TABLOSU
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    host_username VARCHAR(100) NOT NULL,
    event_time TIMESTAMPTZ NOT NULL,
    event_type VARCHAR(100) DEFAULT 'Genel',
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view events"
ON public.events FOR SELECT
USING (true);

CREATE POLICY "Staff can insert events"
ON public.events FOR INSERT
WITH CHECK (
    EXISTS (SELECT 1 FROM public.staff WHERE user_id = auth.uid())
);

CREATE POLICY "Staff can update events"
ON public.events FOR UPDATE
USING (
    EXISTS (SELECT 1 FROM public.staff WHERE user_id = auth.uid())
);

CREATE POLICY "Staff can delete events"
ON public.events FOR DELETE
USING (
    EXISTS (SELECT 1 FROM public.staff WHERE user_id = auth.uid())
);


-- 3. BADGES (ROZETLER) TABLOSU
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    how_to_get TEXT,
    image_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view badges"
ON public.badges FOR SELECT
USING (true);

CREATE POLICY "Staff can insert badges"
ON public.badges FOR INSERT
WITH CHECK (
    EXISTS (SELECT 1 FROM public.staff WHERE user_id = auth.uid())
);

CREATE POLICY "Staff can update badges"
ON public.badges FOR UPDATE
USING (
    EXISTS (SELECT 1 FROM public.staff WHERE user_id = auth.uid())
);

CREATE POLICY "Staff can delete badges"
ON public.badges FOR DELETE
USING (
    EXISTS (SELECT 1 FROM public.staff WHERE user_id = auth.uid())
);


-- 4. BADGES İÇİN STORAGE BUCKET OLUŞTUR
INSERT INTO storage.buckets (id, name, public) 
VALUES ('badges', 'badges', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policyleri (Rozetler Bucket'ı için)
CREATE POLICY "Public Access for badges bucket" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'badges' );

CREATE POLICY "Staff can upload to badges bucket" 
ON storage.objects FOR INSERT 
WITH CHECK ( 
    bucket_id = 'badges' 
    AND EXISTS (
        SELECT 1 FROM public.staff WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Staff can delete from badges bucket" 
ON storage.objects FOR DELETE 
USING ( 
    bucket_id = 'badges' 
    AND EXISTS (
        SELECT 1 FROM public.staff WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Staff can update badges bucket" 
ON storage.objects FOR UPDATE 
USING ( 
    bucket_id = 'badges' 
    AND EXISTS (
        SELECT 1 FROM public.staff WHERE user_id = auth.uid()
    )
);
