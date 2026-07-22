-- Add hz_points to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hz_points INTEGER DEFAULT 0;

-- Optional: Create a function to award points
CREATE OR REPLACE FUNCTION award_hz_points(user_id_param UUID, amount INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles
  SET hz_points = COALESCE(hz_points, 0) + amount
  WHERE id = user_id_param;
END;
$$;
