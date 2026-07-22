
-- ===========================================
-- 0. TEMİZLİK (Eski tabloları tamamen siler)
-- ===========================================
DROP TABLE IF EXISTS 
    public.logs, public.settings, public.notifications, public.bans, public.partners, 
    public.staff, public.user_badges, public.badges, public.gallery, public.magazines, 
    public.events, public.bookmarks, public.likes, public.replies, public.topics, 
    public.forums, public.comments, public.news_tags, public.news, public.tags, 
    public.categories, public.profiles, public.seo_metadata, public.items 
CASCADE;

DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS content_status CASCADE;

-- === 00001_initial_schema.sql ===
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('Owner', 'Developer', 'Administrator', 'Moderator', 'Editor', 'Journalist', 'VIP', 'Member');
CREATE TYPE content_status AS ENUM ('Draft', 'Published', 'Scheduled', 'Archived');

-- 2. PROFILES (Extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  habbo_username TEXT,
  motto TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'Member'::user_role,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (new.id, split_part(new.email, '@', 1), '');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. CATEGORIES
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- 'news', 'forum'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TAGS
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

-- 5. NEWS
CREATE TABLE public.news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT,
  content TEXT NOT NULL,
  thumbnail_url TEXT,
  status content_status DEFAULT 'Draft'::content_status,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. NEWS_TAGS
CREATE TABLE public.news_tags (
  news_id UUID REFERENCES public.news(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (news_id, tag_id)
);

-- 7. COMMENTS
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  news_id UUID REFERENCES public.news(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. FORUMS
CREATE TABLE public.forums (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  order_index INTEGER DEFAULT 0
);

-- 9. TOPICS
CREATE TABLE public.topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  forum_id UUID REFERENCES public.forums(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. REPLIES
CREATE TABLE public.replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_solution BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. LIKES (Polymorphic-ish, using target_type and target_id)
CREATE TABLE public.likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL, -- 'news', 'topic', 'reply'
  target_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, target_type, target_id)
);

-- 12. BOOKMARKS
CREATE TABLE public.bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL, -- 'news', 'topic'
  target_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, target_type, target_id)
);

-- 13. EVENTS
-- Removed duplicate older definition of events

-- 14. MAGAZINES
-- Removed duplicate older definition of magazines

-- 15. GALLERY
-- Removed duplicate older definition of gallery

-- 16. BADGES (HabboZone specific badges)
-- Removed duplicate older definition of badges

-- 17. USER_BADGES
-- Removed duplicate older definition of user_badges

-- 18. STAFF
CREATE TABLE public.staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  position TEXT NOT NULL,
  order_index INTEGER DEFAULT 0
);

-- 19. PARTNERS
CREATE TABLE public.partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  logo_url TEXT,
  description TEXT
);

-- 20. BANS
CREATE TABLE public.bans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  banned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reason TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 21. NOTIFICATIONS
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 22. SETTINGS
-- Removed duplicate older definition of settings

-- 23. LOGS
CREATE TABLE public.logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS (Row Level Security) POLICIES --

-- Helper function to check admin roles
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  current_role user_role;
BEGIN
  SELECT role INTO current_role FROM public.profiles WHERE id = auth.uid();
  RETURN current_role IN ('Owner', 'Developer', 'Administrator', 'Moderator');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Anyone can read, only user can update their own
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- News: Anyone can read published, only admins/editors can insert/update
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published news are viewable by everyone." ON public.news FOR SELECT USING (status = 'Published' OR public.is_admin());
CREATE POLICY "Admins can insert news." ON public.news FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update news." ON public.news FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete news." ON public.news FOR DELETE USING (public.is_admin());

-- Comments: Anyone can read, auth users can insert, users can delete own, admins can delete any
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comments viewable by everyone." ON public.comments FOR SELECT USING (true);
CREATE POLICY "Auth users can insert comment." ON public.comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can delete own comment." ON public.comments FOR DELETE USING (auth.uid() = author_id OR public.is_admin());


-- STORAGE BUCKETS --
-- Note: Requires running as superuser in Supabase. Supabase automatically creates storage schema.
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('news', 'news', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('magazines', 'magazines', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('staff', 'staff', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('badges', 'badges', true);

-- Enable RLS on storage objects
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow public access to read files
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id IN ('avatars', 'news', 'magazines', 'gallery', 'staff', 'badges'));

-- Allow admins to insert/update/delete any file
CREATE POLICY "Admin Upload Access" ON storage.objects FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin Update Access" ON storage.objects FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin Delete Access" ON storage.objects FOR DELETE USING (public.is_admin());

-- Allow users to upload their own avatar
CREATE POLICY "User Avatar Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "User Avatar Update" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);


-- === 00002_add_seo_metadata.sql ===
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



-- === 00003_forum_upgrades.sql ===
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


-- === 00004_habbo_items.sql ===
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


-- === 00005_remaining_tables.sql ===
-- 1. BADGES
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- 2. GALLERY
CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MAGAZINES
CREATE TABLE magazines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  issue_number INT,
  cover_image_url TEXT NOT NULL,
  pdf_url TEXT,
  read_link TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. EVENTS
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  image_url TEXT,
  reward_text VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SETTINGS
CREATE TABLE settings (
  id VARCHAR(50) PRIMARY KEY, -- 'site_config'
  site_name VARCHAR(255) DEFAULT 'HabboZone',
  site_description TEXT,
  logo_url TEXT,
  favicon_url TEXT,
  maintenance_mode BOOLEAN DEFAULT false,
  discord_url TEXT,
  instagram_url TEXT,
  x_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Insert default settings row
INSERT INTO settings (id, site_name, site_description) VALUES ('site_config', 'HabboZone', 'Habbo Türkiye Fansitesi') ON CONFLICT (id) DO NOTHING;

-- RLS POLICIES

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE magazines ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Badges
CREATE POLICY "Badges are viewable by everyone" ON badges FOR SELECT USING (true);
CREATE POLICY "Admins can insert badges" ON badges FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update badges" ON badges FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete badges" ON badges FOR DELETE USING (public.is_admin());

-- User Badges
CREATE POLICY "User badges are viewable by everyone" ON user_badges FOR SELECT USING (true);
CREATE POLICY "Admins can assign badges" ON user_badges FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can delete assigned badges" ON user_badges FOR DELETE USING (public.is_admin());

-- Gallery
CREATE POLICY "Gallery is viewable by everyone" ON gallery FOR SELECT USING (true);
CREATE POLICY "Admins can manage gallery" ON gallery FOR ALL USING (public.is_admin());

-- Magazines
CREATE POLICY "Magazines are viewable by everyone" ON magazines FOR SELECT USING (true);
CREATE POLICY "Admins can manage magazines" ON magazines FOR ALL USING (public.is_admin());

-- Events
CREATE POLICY "Events are viewable by everyone" ON events FOR SELECT USING (true);
CREATE POLICY "Admins can manage events" ON events FOR ALL USING (public.is_admin());

-- Settings
CREATE POLICY "Settings are viewable by everyone" ON settings FOR SELECT USING (true);
CREATE POLICY "Admins can update settings" ON settings FOR UPDATE USING (public.is_admin());

-- STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public) VALUES ('badges', 'badges', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('magazines', 'magazines', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('events', 'events', true) ON CONFLICT (id) DO NOTHING;

-- Storage Policies
-- Badges
CREATE POLICY "Badge images are public" ON storage.objects FOR SELECT USING (bucket_id = 'badges');
CREATE POLICY "Admins can upload badge images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'badges' AND public.is_admin());
CREATE POLICY "Admins can delete badge images" ON storage.objects FOR DELETE USING (bucket_id = 'badges' AND public.is_admin());

-- Gallery
CREATE POLICY "Gallery images are public" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Admins can upload gallery images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery' AND public.is_admin());
CREATE POLICY "Admins can delete gallery images" ON storage.objects FOR DELETE USING (bucket_id = 'gallery' AND public.is_admin());

-- Magazines
CREATE POLICY "Magazine files are public" ON storage.objects FOR SELECT USING (bucket_id = 'magazines');
CREATE POLICY "Admins can upload magazine files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'magazines' AND public.is_admin());
CREATE POLICY "Admins can delete magazine files" ON storage.objects FOR DELETE USING (bucket_id = 'magazines' AND public.is_admin());

-- Events
CREATE POLICY "Event images are public" ON storage.objects FOR SELECT USING (bucket_id = 'events');
CREATE POLICY "Admins can upload event images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'events' AND public.is_admin());
CREATE POLICY "Admins can delete event images" ON storage.objects FOR DELETE USING (bucket_id = 'events' AND public.is_admin());

-- Also create a generic settings bucket for logo etc.
INSERT INTO storage.buckets (id, name, public) VALUES ('settings', 'settings', true) ON CONFLICT (id) DO NOTHING;
CREATE POLICY "Settings images are public" ON storage.objects FOR SELECT USING (bucket_id = 'settings');
CREATE POLICY "Admins can upload settings images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'settings' AND public.is_admin());
CREATE POLICY "Admins can delete settings images" ON storage.objects FOR DELETE USING (bucket_id = 'settings' AND public.is_admin());


-- === 00006_gallery_submissions.sql ===
-- Add is_approved to gallery
ALTER TABLE gallery ADD COLUMN is_approved BOOLEAN DEFAULT false;

-- Add description to gallery (the plan mentioned title and description)
ALTER TABLE gallery ADD COLUMN description TEXT;

-- Drop existing select policy so we can recreate it
DROP POLICY IF EXISTS "Gallery is viewable by everyone" ON gallery;

-- Recreate select policy: everyone can view approved, users can view their own, admins can view all
CREATE POLICY "Gallery view policy" ON gallery FOR SELECT USING (
  is_approved = true OR 
  auth.uid() = author_id OR 
  public.is_admin()
);

-- Allow authenticated users to insert to gallery
CREATE POLICY "Users can insert to gallery" ON gallery FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND 
  auth.uid() = author_id
);

-- Note: We already have "Admins can manage gallery" which covers UPDATE/DELETE/etc for admins.

-- Allow users to upload images to the 'gallery' storage bucket
CREATE POLICY "Users can upload gallery images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'gallery' AND 
  auth.role() = 'authenticated'
);


