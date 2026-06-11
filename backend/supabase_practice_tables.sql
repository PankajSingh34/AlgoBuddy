-- Create user_progress table
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    problem_id TEXT NOT NULL,
    status TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, problem_id)
);

-- Create user_practice_stats table
CREATE TABLE user_practice_stats (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_active_date DATE,
    visualized_count INTEGER DEFAULT 0,
    version INTEGER NOT NULL DEFAULT 0
);

-- Enable RLS (Row Level Security)
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_practice_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for user_progress
CREATE POLICY "Users can view their own progress" 
ON user_progress FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" 
ON user_progress FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
ON user_progress FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policies for user_practice_stats
CREATE POLICY "Users can view their own stats" 
ON user_practice_stats FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" 
ON user_practice_stats FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats" 
ON user_practice_stats FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create problem_bookmarks table
CREATE TABLE problem_bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    problem_id TEXT NOT NULL,
    topic_slug TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, problem_id)
);

-- Enable RLS and Policies for problem_bookmarks
ALTER TABLE problem_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookmarks" 
ON problem_bookmarks FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks" 
ON problem_bookmarks FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" 
ON problem_bookmarks FOR DELETE 
USING (auth.uid() = user_id);

-- ─── My Sheet table ──────────────────────────────────────────────────────────
-- Stores user-curated personal problem lists (distinct from bookmarks)
CREATE TABLE IF NOT EXISTS my_sheet (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    problem_id TEXT NOT NULL,
    note TEXT DEFAULT '',
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, problem_id)
);

-- Enable RLS
ALTER TABLE my_sheet ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sheet"
ON my_sheet FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own sheet"
ON my_sheet FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sheet"
ON my_sheet FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own sheet"
ON my_sheet FOR DELETE
USING (auth.uid() = user_id);
