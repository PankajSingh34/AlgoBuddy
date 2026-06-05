-- 2026-06-05-community-supabase-setup.sql
-- Migration: Community feature — tables, RLS, and seed data
-- Apply via Supabase SQL editor or `psql -f` against the project's database.

-- ── community_team ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS community_team (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('founder', 'co-founder', 'lead-designer', 'tech-lead', 'devops')),
  title TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  "order" INTEGER DEFAULT 0
);

ALTER TABLE community_team ENABLE ROW LEVEL SECURITY;

CREATE POLICY "community_team_select_public"
  ON community_team FOR SELECT
  USING (true);

-- ── community_contributors ──────────────────────────────────
CREATE TABLE IF NOT EXISTS community_contributors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT,
  github_url TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE community_contributors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "community_contributors_select_public"
  ON community_contributors FOR SELECT
  USING (true);

-- ── user_profiles — extend existing table ───────────────────
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS followers_count INTEGER DEFAULT 0;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS following_count INTEGER DEFAULT 0;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS projects_count INTEGER DEFAULT 0;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS github_url TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS twitter_url TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS devto_url TEXT;
-- joined_community already added by earlier migration; ensure it exists
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS joined_community BOOLEAN DEFAULT false;

-- RLS: users can update their own row only
-- (Assumes user_profiles RLS is already enabled; if not, uncomment:)
-- ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policy first to make this re-runnable
DROP POLICY IF EXISTS "user_profiles_update_own" ON user_profiles;
CREATE POLICY "user_profiles_update_own"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ── Seed data ───────────────────────────────────────────────
INSERT INTO community_team (name, avatar_url, role, title, github_url, linkedin_url, twitter_url, "order")
VALUES
  ('Pankaj Singh', NULL, 'founder', 'Founder & CEO', 'https://github.com/PankajSingh34', 'https://linkedin.com/in/pankajsingh34', NULL, 1),
  ('Jane Doe', NULL, 'co-founder', 'Co-Founder & COO', 'https://github.com/janedoe', NULL, NULL, 2),
  ('Alice Wang', NULL, 'lead-designer', 'Lead Designer', 'https://github.com/alicewang', NULL, NULL, 3),
  ('Bob Smith', NULL, 'tech-lead', 'Tech Lead', 'https://github.com/bobsmith', NULL, NULL, 4),
  ('Carol Davis', NULL, 'devops', 'DevOps Engineer', 'https://github.com/caroldavis', NULL, NULL, 5)
ON CONFLICT DO NOTHING;

INSERT INTO community_contributors (name, avatar_url, role, github_url, "order")
VALUES
  ('Dev Patel', NULL, 'Contributor', 'https://github.com/devpatel', 1),
  ('Emily Chen', NULL, 'Contributor', 'https://github.com/emilychen', 2),
  ('Frank Wilson', NULL, 'Contributor', 'https://github.com/frankwilson', 3),
  ('Grace Kim', NULL, 'Contributor', 'https://github.com/gracekim', 4),
  ('Henry Brown', NULL, 'Contributor', 'https://github.com/henrybrown', 5),
  ('Ivy Lee', NULL, 'Contributor', 'https://github.com/ivylee', 6),
  ('Jack Johnson', NULL, 'Contributor', 'https://github.com/jackjohnson', 7),
  ('Karen White', NULL, 'Contributor', 'https://github.com/karenwhite', 8),
  ('Leo Martinez', NULL, 'Contributor', 'https://github.com/leomartinez', 9),
  ('Mia Taylor', NULL, 'Contributor', 'https://github.com/miataylor', 10),
  ('Noah Anderson', NULL, 'Contributor', 'https://github.com/noahanderson', 11),
  ('Olivia Thomas', NULL, 'Contributor', 'https://github.com/oliviathomas', 12)
ON CONFLICT DO NOTHING;
