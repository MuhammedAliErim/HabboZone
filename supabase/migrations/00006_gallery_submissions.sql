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
