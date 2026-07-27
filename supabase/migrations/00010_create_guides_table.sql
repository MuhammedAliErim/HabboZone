CREATE TABLE IF NOT EXISTS guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Genel',
  content TEXT,
  read_time TEXT DEFAULT '4 dk okuma',
  image_url TEXT,
  slug TEXT UNIQUE,
  summary TEXT,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'Published',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_guides_slug ON guides(slug);
CREATE INDEX IF NOT EXISTS idx_guides_status ON guides(status);
CREATE INDEX IF NOT EXISTS idx_guides_author_id ON guides(author_id);
CREATE INDEX IF NOT EXISTS idx_guides_created_at ON guides(created_at DESC);
