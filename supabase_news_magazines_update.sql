-- 1. MAGAZINES TABLOSUNU OLUŞTUR VEYA GÜNCELLE
CREATE TABLE IF NOT EXISTS public.magazines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    issue_number INT UNIQUE,
    cover_image_url TEXT NOT NULL,
    pdf_url TEXT,
    read_link TEXT,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security) Ayarları
ALTER TABLE public.magazines ENABLE ROW LEVEL SECURITY;

-- Herkes dergileri okuyabilir
CREATE POLICY "Public can view published magazines"
ON public.magazines FOR SELECT
USING (published_at <= NOW());

-- Sadece admin ve yetkililer dergi ekleyip silebilir
CREATE POLICY "Staff can insert magazines"
ON public.magazines FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.staff 
        WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Staff can update magazines"
ON public.magazines FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.staff 
        WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Staff can delete magazines"
ON public.magazines FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.staff 
        WHERE user_id = auth.uid()
    )
);

-- 2. NEWS TABLOSUNU GÜNCELLE
-- Eğer "status" veya "published_at" yoksa ekle
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Published';
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ DEFAULT NOW();

-- 3. MAGAZINES İÇİN STORAGE BUCKET OLUŞTUR
INSERT INTO storage.buckets (id, name, public) 
VALUES ('magazines', 'magazines', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policyleri (Dergiler Bucket'ı için)
CREATE POLICY "Public Access for magazines bucket" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'magazines' );

CREATE POLICY "Staff can upload to magazines bucket" 
ON storage.objects FOR INSERT 
WITH CHECK ( 
    bucket_id = 'magazines' 
    AND EXISTS (
        SELECT 1 FROM public.staff WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Staff can delete from magazines bucket" 
ON storage.objects FOR DELETE 
USING ( 
    bucket_id = 'magazines' 
    AND EXISTS (
        SELECT 1 FROM public.staff WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Staff can update magazines bucket" 
ON storage.objects FOR UPDATE 
USING ( 
    bucket_id = 'magazines' 
    AND EXISTS (
        SELECT 1 FROM public.staff WHERE user_id = auth.uid()
    )
);
