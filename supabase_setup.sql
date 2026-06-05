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

-- Create user_quiz_results table for quiz progress tracking
CREATE TABLE IF NOT EXISTS user_quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  answers JSONB,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_results_user_module ON user_quiz_results(user_id, module_id);

ALTER TABLE user_quiz_results ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own quiz results
CREATE POLICY "Users can insert their own quiz results" ON user_quiz_results
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own quiz results
CREATE POLICY "Users can view their own quiz results" ON user_quiz_results
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to update their own quiz results
CREATE POLICY "Users can update their own quiz results" ON user_quiz_results
  FOR UPDATE
  USING (auth.uid() = user_id);
