-- 1. user_follows (Takipçi Sistemi)
CREATE TABLE IF NOT EXISTS public.user_follows (
  follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (follower_id, following_id)
);

-- 2. user_rooms (Kullanıcı Odaları)
CREATE TABLE IF NOT EXISTS public.user_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  room_id TEXT NOT NULL, -- Habbo'daki oda ID'si
  room_name TEXT NOT NULL,
  room_description TEXT,
  thumbnail_url TEXT,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for user_follows
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_follows are viewable by everyone" ON public.user_follows FOR SELECT USING (true);
CREATE POLICY "Users can follow others" ON public.user_follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can unfollow" ON public.user_follows FOR DELETE USING (auth.uid() = follower_id);

-- RLS for user_rooms
ALTER TABLE public.user_rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_rooms are viewable by everyone" ON public.user_rooms FOR SELECT USING (true);
CREATE POLICY "Users can insert own rooms" ON public.user_rooms FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own rooms" ON public.user_rooms FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own rooms" ON public.user_rooms FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage user_rooms" ON public.user_rooms FOR ALL USING (public.is_admin());
