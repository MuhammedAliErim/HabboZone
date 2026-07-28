-- Add missing columns to events table
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS room_link TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
