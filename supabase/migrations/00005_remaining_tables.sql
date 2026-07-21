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
