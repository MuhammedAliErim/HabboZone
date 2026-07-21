-- Authors Table
CREATE TABLE authors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    habbo_username VARCHAR(100), -- To fetch Habbo avatar dynamically
    role VARCHAR(50) DEFAULT 'Editor',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- News Table
CREATE TABLE news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    thumbnail_url VARCHAR(500),
    author_id UUID REFERENCES authors(id) ON DELETE SET NULL,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Magazines Table
CREATE TABLE magazines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    issue_number INTEGER NOT NULL,
    cover_image_url VARCHAR(500),
    pdf_url VARCHAR(500),
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security) and add basic policies if needed.
-- Example: Allow public read access to published news.
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." 
ON news FOR SELECT USING (is_published = true);

ALTER TABLE magazines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public magazines are viewable by everyone." 
ON magazines FOR SELECT USING (true);

ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public authors are viewable by everyone." 
ON authors FOR SELECT USING (true);
