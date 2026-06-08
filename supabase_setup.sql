-- Add joined_community column to user_profiles for Join Community Button
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS joined_community BOOLEAN DEFAULT false;

-- Create community_contributors table for the Contributors Grid section
CREATE TABLE IF NOT EXISTS community_contributors (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'Contributor',
  github_url TEXT,
  "order" INTEGER DEFAULT 0
);

ALTER TABLE community_contributors ENABLE ROW LEVEL SECURITY;

-- Allow public read access (unauthenticated users can view contributors)
CREATE POLICY "Allow public read access" ON community_contributors
  FOR SELECT
  USING (true);
