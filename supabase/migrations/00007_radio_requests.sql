-- 00007_radio_requests.sql
CREATE TABLE IF NOT EXISTS public.radio_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_name VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  song_request VARCHAR(255),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.radio_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert requests" ON public.radio_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage requests" ON public.radio_requests FOR ALL USING (public.is_admin());
