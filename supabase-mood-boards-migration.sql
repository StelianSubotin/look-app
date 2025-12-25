-- Create mood_boards table for Mood Board Creator
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS mood_boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Untitled Board',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  share_link TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_mood_boards_user_id ON mood_boards(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_boards_share_link ON mood_boards(share_link);
CREATE INDEX IF NOT EXISTS idx_mood_boards_updated_at ON mood_boards(updated_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE mood_boards ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own boards
CREATE POLICY "Users can view own boards"
  ON mood_boards
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can create their own boards
CREATE POLICY "Users can create boards"
  ON mood_boards
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own boards
CREATE POLICY "Users can update own boards"
  ON mood_boards
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own boards
CREATE POLICY "Users can delete own boards"
  ON mood_boards
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Anyone can view boards via share link (public access)
CREATE POLICY "Anyone can view shared boards"
  ON mood_boards
  FOR SELECT
  USING (share_link IS NOT NULL);

-- Add trigger to update updated_at automatically
CREATE OR REPLACE FUNCTION update_mood_boards_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_mood_boards_updated_at
  BEFORE UPDATE ON mood_boards
  FOR EACH ROW
  EXECUTE FUNCTION update_mood_boards_updated_at();

