-- =========================================================================
-- ALGOBUDDY DATABASE SETUP & RE-MIGRATION SQL
-- Copy and run this script in your Supabase SQL Editor (https://supabase.com)
-- This creates the correct schema, seeds modules, sets up policies & grants.
-- =========================================================================

-- 1. Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS public.user_progress CASCADE;
DROP TABLE IF EXISTS public.user_activity CASCADE;
DROP TABLE IF EXISTS public.modules CASCADE;
DROP TABLE IF EXISTS public.problem_bookmarks CASCADE;

-- 2. Create the modules table
CREATE TABLE public.modules (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT,
  estimated_time TEXT,
  order_index INT NOT NULL,
  image TEXT NOT NULL
);

-- 3. Create the user_progress table
CREATE TABLE public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id TEXT REFERENCES public.modules(id) ON DELETE CASCADE,
  is_done BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, module_id)
);

-- 4. Create the user_activity table
CREATE TABLE public.user_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_date TEXT NOT NULL, -- Holds local dates like '2026-06-01'
  type TEXT NOT NULL,          -- Activity type like 'site_visit'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4.5. Create the problem_bookmarks table
CREATE TABLE public.problem_bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_id TEXT NOT NULL,
  topic_slug TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, problem_id)
);

-- 5. Seed the modules table with all 17 completed visualizer modules
INSERT INTO public.modules (id, title, description, difficulty, estimated_time, order_index, image) VALUES
  ('378adcd8-7356-4d10-84cf-1dad1cbd496a', 'Linear Search', 'Find an element in an array sequentially.', 'Beginner', '10 mins', 1, 'linearSearch.png'),
  ('e527f92a-7962-4b0b-a46a-52ecf08a73ef', 'Binary Search', 'Find an element in a sorted array logarithmically.', 'Beginner', '15 mins', 2, 'binarySearch.png'),
  ('b1387e6d-ebf8-4b52-9c5d-ab8c94f8eda4', 'Bubble Sort', 'Repeatedly swap adjacent elements if they are in the wrong order.', 'Beginner', '15 mins', 3, 'bubbleSort.png'),
  ('f8ae92e2-1371-4852-a615-0354011f8f48', 'Insertion Sort', 'Build a sorted array one element at a time.', 'Beginner', '15 mins', 4, 'insertionSort.png'),
  ('7dffce41-ff4c-4700-8cfe-04b8793cc25c', 'Selection Sort', 'Repeatedly select the minimum element and swap it to the front.', 'Beginner', '15 mins', 5, 'selectionSort.png'),
  ('d6704302-d35c-4c32-a259-9518dec15920', 'Merge Sort', 'A divide-and-conquer sorting algorithm using recursion.', 'Intermediate', '25 mins', 6, 'mergeSort.png'),
  ('19ad8f43-b858-4e80-998c-49c5e0f69f8c', 'Quick Sort', 'Divide and conquer using a pivot element for sorting.', 'Intermediate', '30 mins', 7, 'quickSort.png'),
  ('48138388-914b-4f84-8468-683175ce1a1e', 'Push & Pop', 'Understand core Stack operations LIFO style.', 'Beginner', '10 mins', 8, 'pushPop.png'),
  ('fd95f8af-fb22-413f-9080-ebb558b53e70', 'Peek', 'Retrieve the top element of a stack without removing it.', 'Beginner', '5 mins', 9, 'peek.png'),
  ('05ecbddd-e3d4-4fa1-aa45-71accac97d79', 'Is Empty', 'Check if a stack has no elements remaining.', 'Beginner', '5 mins', 10, 'isEmpty.png'),
  ('54301ec9-0586-48f0-a6db-18a41adeb856', 'Is Full', 'Verify if a stack has reached its maximum capacity.', 'Beginner', '5 mins', 11, 'isFull.png'),
  ('ca3daf8d-23f8-4ade-adfd-4bd0a88d3da2', 'Postfix', 'Evaluate expressions in Reverse Polish Notation.', 'Intermediate', '20 mins', 12, 'postfix.png'),
  ('a2971df4-5e48-4320-bc91-3de3242cac48', 'Prefix', 'Evaluate expressions in Polish Notation.', 'Intermediate', '20 mins', 13, 'prefix.png'),
  ('4e0dd1e0-a8c7-4066-845c-b5917383d5c2', 'Using Array (Stack)', 'Implement a stack structure using fixed-size contiguous memory.', 'Intermediate', '15 mins', 14, 'stackArray.png'),
  ('69ecfabf-97d3-433e-972e-54ea4c91374f', 'Using Linked List (Stack)', 'Implement a stack dynamically using linked nodes.', 'Intermediate', '20 mins', 15, 'stackLinkedList.png'),
  ('0f8a94c9-c8e1-4407-bc03-11fac79e1331', 'Enqueue & Dequeue', 'Master standard FIFO Queue insert and remove operations.', 'Beginner', '12 mins', 16, 'enqueueDequeue.png'),
  ('77ebf769-59c5-43e6-8b2a-fb8aef51a9ab', 'Peek Front', 'Retrieve the front-most queue element without dequeuing.', 'Beginner', '5 mins', 17, 'peekFront.png');

-- 6. Enable Row Level Security (RLS) on all tables
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problem_bookmarks ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS Policies
-- Modules: Anyone (including anonymous users) can read modules
CREATE POLICY "Public read modules" ON public.modules 
  FOR SELECT USING (true);

-- User Progress: Authenticated users can read/write their own progress
CREATE POLICY "Users manage own progress" ON public.user_progress 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

-- User Activity: Authenticated users can read/write their own activity logs
CREATE POLICY "Users manage own activity" ON public.user_activity 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

-- Problem Bookmarks: Authenticated users can read/write their own bookmarks
CREATE POLICY "Users manage own bookmarks" ON public.problem_bookmarks 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

-- 8. Explicitly grant permissions on schema & tables to bypass "permission denied" errors
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT SELECT ON TABLE public.modules TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.modules TO postgres, service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.user_progress TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.user_progress TO postgres, service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.user_activity TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.user_activity TO postgres, service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.problem_bookmarks TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.problem_bookmarks TO postgres, service_role;
