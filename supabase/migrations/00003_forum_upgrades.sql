-- 00003_forum_upgrades.sql

-- 1. Topics tablosuna yeni kolonlar ekleme
ALTER TABLE public.topics 
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_solved BOOLEAN DEFAULT FALSE;

-- 2. Likes tablosuna reaction_type ekleme (XenForo tarzı Beğen, İnanılmaz, Üzgün, Kızgın, Kahkaha vb. için)
ALTER TABLE public.likes 
ADD COLUMN IF NOT EXISTS reaction_type TEXT DEFAULT 'like';

-- 3. Polls (Anketler) Tablosu
CREATE TABLE IF NOT EXISTS public.polls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  is_multiple_choice BOOLEAN DEFAULT FALSE,
  ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Poll Options (Anket Seçenekleri) Tablosu
CREATE TABLE IF NOT EXISTS public.poll_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  order_index INTEGER DEFAULT 0
);

-- 5. Poll Votes (Anket Oyları) Tablosu
CREATE TABLE IF NOT EXISTS public.poll_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_option_id UUID REFERENCES public.poll_options(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(poll_option_id, user_id)
);

-- 6. Storage Bucket for Forum Attachments
INSERT INTO storage.buckets (id, name, public) VALUES ('forum_attachments', 'forum_attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Kuralları for forum_attachments
CREATE POLICY "Public forum_attachments view" ON storage.objects FOR SELECT USING (bucket_id = 'forum_attachments');
CREATE POLICY "Authenticated users can upload forum_attachments" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'forum_attachments' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own forum_attachments" ON storage.objects FOR UPDATE USING (bucket_id = 'forum_attachments' AND auth.uid() = owner);
CREATE POLICY "Users can delete own forum_attachments" ON storage.objects FOR DELETE USING (bucket_id = 'forum_attachments' AND auth.uid() = owner);

-- 7. Polls RLS Kuralları
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkes anketleri görebilir" ON public.polls FOR SELECT USING (true);
CREATE POLICY "Herkes anket seçeneklerini görebilir" ON public.poll_options FOR SELECT USING (true);
CREATE POLICY "Herkes anket oylarını görebilir" ON public.poll_votes FOR SELECT USING (true);

-- Giriş yapmış kullanıcılar oy verebilir (Kendi adlarına)
CREATE POLICY "Giriş yapmış üyeler oy verebilir" ON public.poll_votes 
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Üyeler oylarını değiştirebilir" ON public.poll_votes 
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Üyeler oylarını silebilir" ON public.poll_votes 
FOR DELETE USING (auth.uid() = user_id);

-- Konuyu açan kişiler anket oluşturabilir
CREATE POLICY "Kullanıcılar anket oluşturabilir" ON public.polls 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Kullanıcılar anket seçenekleri oluşturabilir" ON public.poll_options 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');
