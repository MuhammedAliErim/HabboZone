-- ============================================================
-- COMPLETE MISSING TABLES, COLUMNS, AND RLS POLICIES
-- ============================================================

-- 1. MISSING TABLES
-- 1a. Groups
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  badge_url TEXT,
  cover_url TEXT,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.group_members (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, group_id)
);

-- 1b. Market Items
CREATE TABLE IF NOT EXISTS public.market_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 1c. Wiki Categories
CREATE TABLE IF NOT EXISTS public.wiki_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 1d. Wiki Items
CREATE TABLE IF NOT EXISTS public.wiki_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.wiki_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  rarity_level TEXT DEFAULT 'Common',
  market_value TEXT,
  release_date TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 1e. Magazine Pages
CREATE TABLE IF NOT EXISTS public.magazine_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  magazine_id UUID REFERENCES public.magazines(id) ON DELETE CASCADE,
  page_number INTEGER NOT NULL,
  layout_data JSONB DEFAULT '{}',
  background_color TEXT DEFAULT '#0f172a',
  background_image TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(magazine_id, page_number)
);

-- 1f. Taggables (polymorphic)
CREATE TABLE IF NOT EXISTS public.taggables (
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (tag_id, target_type, target_id)
);

-- 2. MISSING COLUMNS ON EXISTING TABLES

-- 2a. Badges: add how_to_get column if not exists
ALTER TABLE public.badges ADD COLUMN IF NOT EXISTS how_to_get TEXT;

-- 2b. Events: add event_type column if not exists
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS event_type TEXT DEFAULT 'Genel';

-- 3. RLS POLICIES FOR TABLES THAT HAVE NONE

-- 3a. Forums
ALTER TABLE public.forums ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Forums viewable by everyone" ON public.forums;
CREATE POLICY "Forums viewable by everyone" ON public.forums FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage forums" ON public.forums;
CREATE POLICY "Admins can manage forums" ON public.forums FOR ALL USING (public.is_admin());

-- 3b. Topics
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Topics viewable by everyone" ON public.topics;
CREATE POLICY "Topics viewable by everyone" ON public.topics FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can create topics" ON public.topics;
CREATE POLICY "Authenticated users can create topics" ON public.topics FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Authors can update own topics" ON public.topics;
CREATE POLICY "Authors can update own topics" ON public.topics FOR UPDATE USING (auth.uid() = author_id OR public.is_admin());
DROP POLICY IF EXISTS "Admins can delete topics" ON public.topics;
CREATE POLICY "Admins can delete topics" ON public.topics FOR DELETE USING (public.is_admin());

-- 3c. Replies
ALTER TABLE public.replies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Replies viewable by everyone" ON public.replies;
CREATE POLICY "Replies viewable by everyone" ON public.replies FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can create replies" ON public.replies;
CREATE POLICY "Authenticated users can create replies" ON public.replies FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Authors can update own replies" ON public.replies;
CREATE POLICY "Authors can update own replies" ON public.replies FOR UPDATE USING (auth.uid() = author_id OR public.is_admin());
DROP POLICY IF EXISTS "Admins can delete replies" ON public.replies;
CREATE POLICY "Admins can delete replies" ON public.replies FOR DELETE USING (public.is_admin());

-- 3d. Likes
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Likes viewable by everyone" ON public.likes;
CREATE POLICY "Likes viewable by everyone" ON public.likes FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can manage own likes" ON public.likes;
CREATE POLICY "Authenticated users can manage own likes" ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own likes" ON public.likes;
CREATE POLICY "Users can delete own likes" ON public.likes FOR DELETE USING (auth.uid() = user_id OR public.is_admin());

-- 3e. Bookmarks
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can view own bookmarks" ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can create own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can create own bookmarks" ON public.bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can delete own bookmarks" ON public.bookmarks FOR DELETE USING (auth.uid() = user_id);

-- 3f. News Tags (junction)
ALTER TABLE public.news_tags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "News tags viewable by everyone" ON public.news_tags;
CREATE POLICY "News tags viewable by everyone" ON public.news_tags FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage news tags" ON public.news_tags;
CREATE POLICY "Admins can manage news tags" ON public.news_tags FOR ALL USING (public.is_admin());

-- 3g. Staff
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Staff viewable by everyone" ON public.staff;
CREATE POLICY "Staff viewable by everyone" ON public.staff FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage staff" ON public.staff;
CREATE POLICY "Admins can manage staff" ON public.staff FOR ALL USING (public.is_admin());

-- 3h. Partners (revived table)
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Partners viewable by everyone" ON public.partners;
CREATE POLICY "Partners viewable by everyone" ON public.partners FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage partners" ON public.partners;
CREATE POLICY "Admins can manage partners" ON public.partners FOR ALL USING (public.is_admin());

-- 3i. Bans
ALTER TABLE public.bans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view bans" ON public.bans;
CREATE POLICY "Admins can view bans" ON public.bans FOR SELECT USING (public.is_admin());
DROP POLICY IF EXISTS "Admins can manage bans" ON public.bans;
CREATE POLICY "Admins can manage bans" ON public.bans FOR ALL USING (public.is_admin());

-- 3j. Notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- 3k. Logs
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view logs" ON public.logs;
CREATE POLICY "Admins can view logs" ON public.logs FOR SELECT USING (public.is_admin());
DROP POLICY IF EXISTS "System can insert logs" ON public.logs;
CREATE POLICY "System can insert logs" ON public.logs FOR INSERT WITH CHECK (true);

-- 3l. Groups
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Groups viewable by everyone" ON public.groups;
CREATE POLICY "Groups viewable by everyone" ON public.groups FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can create groups" ON public.groups;
CREATE POLICY "Authenticated users can create groups" ON public.groups FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Admins can manage groups" ON public.groups;
CREATE POLICY "Admins can manage groups" ON public.groups FOR ALL USING (public.is_admin());

-- 3m. Group Members
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Group members viewable by everyone" ON public.group_members;
CREATE POLICY "Group members viewable by everyone" ON public.group_members FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can manage own membership" ON public.group_members;
CREATE POLICY "Users can manage own membership" ON public.group_members FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can manage group members" ON public.group_members;
CREATE POLICY "Admins can manage group members" ON public.group_members FOR ALL USING (public.is_admin());

-- 3n. Market Items
ALTER TABLE public.market_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Market items viewable by everyone" ON public.market_items;
CREATE POLICY "Market items viewable by everyone" ON public.market_items FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage market items" ON public.market_items;
CREATE POLICY "Admins can manage market items" ON public.market_items FOR ALL USING (public.is_admin());

-- 3o. Wiki Categories
ALTER TABLE public.wiki_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Wiki categories viewable by everyone" ON public.wiki_categories;
CREATE POLICY "Wiki categories viewable by everyone" ON public.wiki_categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage wiki categories" ON public.wiki_categories;
CREATE POLICY "Admins can manage wiki categories" ON public.wiki_categories FOR ALL USING (public.is_admin());

-- 3p. Wiki Items
ALTER TABLE public.wiki_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Wiki items viewable by everyone" ON public.wiki_items;
CREATE POLICY "Wiki items viewable by everyone" ON public.wiki_items FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage wiki items" ON public.wiki_items;
CREATE POLICY "Admins can manage wiki items" ON public.wiki_items FOR ALL USING (public.is_admin());

-- 3q. Magazine Pages
ALTER TABLE public.magazine_pages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Magazine pages viewable by everyone" ON public.magazine_pages;
CREATE POLICY "Magazine pages viewable by everyone" ON public.magazine_pages FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage magazine pages" ON public.magazine_pages;
CREATE POLICY "Admins can manage magazine pages" ON public.magazine_pages FOR ALL USING (public.is_admin());

-- 3r. Taggables
ALTER TABLE public.taggables ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Taggables viewable by everyone" ON public.taggables;
CREATE POLICY "Taggables viewable by everyone" ON public.taggables FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage taggables" ON public.taggables;
CREATE POLICY "Admins can manage taggables" ON public.taggables FOR ALL USING (public.is_admin());

-- 3s. Announcements
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Active announcements viewable by everyone" ON public.announcements;
CREATE POLICY "Active announcements viewable by everyone" ON public.announcements FOR SELECT USING (is_active = true OR public.is_admin());
DROP POLICY IF EXISTS "Admins can manage announcements" ON public.announcements;
CREATE POLICY "Admins can manage announcements" ON public.announcements FOR ALL USING (public.is_admin());

-- 3t. Rooms
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Rooms viewable by everyone" ON public.rooms;
CREATE POLICY "Rooms viewable by everyone" ON public.rooms FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage rooms" ON public.rooms;
CREATE POLICY "Admins can manage rooms" ON public.rooms FOR ALL USING (public.is_admin());

-- 4. INDEXES
CREATE INDEX IF NOT EXISTS idx_groups_slug ON public.groups(slug);
CREATE INDEX IF NOT EXISTS idx_groups_owner_id ON public.groups(owner_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON public.group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON public.group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_market_items_slug ON public.market_items(slug);
CREATE INDEX IF NOT EXISTS idx_wiki_categories_slug ON public.wiki_categories(slug);
CREATE INDEX IF NOT EXISTS idx_wiki_items_slug ON public.wiki_items(slug);
CREATE INDEX IF NOT EXISTS idx_wiki_items_category_id ON public.wiki_items(category_id);
CREATE INDEX IF NOT EXISTS idx_magazine_pages_magazine_id ON public.magazine_pages(magazine_id);
CREATE INDEX IF NOT EXISTS idx_taggables_target ON public.taggables(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_taggables_tag_id ON public.taggables(tag_id);
