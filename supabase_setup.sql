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

-- ====================================================================
-- RLS Policies for user_progress table
-- ====================================================================
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Users can read only their own progress
CREATE POLICY "Users can read own progress" ON user_progress
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own progress
CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE
  USING (auth.uid() = user_id);

-- ====================================================================
-- RLS Policies for problem_bookmarks table
-- ====================================================================
ALTER TABLE problem_bookmarks ENABLE ROW LEVEL SECURITY;

-- Users can read only their own bookmarks
CREATE POLICY "Users can read own bookmarks" ON problem_bookmarks
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own bookmarks
CREATE POLICY "Users can insert own bookmarks" ON problem_bookmarks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own bookmarks
CREATE POLICY "Users can update own bookmarks" ON problem_bookmarks
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks" ON problem_bookmarks
  FOR DELETE
  USING (auth.uid() = user_id);

-- ====================================================================
-- RLS Policies for user_profiles table
-- ====================================================================
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON user_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can upsert their own profile
CREATE POLICY "Users can upsert own profile" ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- ====================================================================
-- RLS Policies for user_activity table
-- ====================================================================
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

-- Users can read their own activity
CREATE POLICY "Users can read own activity" ON user_activity
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own activity
CREATE POLICY "Users can insert own activity" ON user_activity
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own activity
CREATE POLICY "Users can update own activity" ON user_activity
  FOR UPDATE
  USING (auth.uid() = user_id);
