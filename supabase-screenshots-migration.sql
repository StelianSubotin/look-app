-- Create screenshots table for inspiration/design gallery
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS screenshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT, -- "Hero Section", "Landing Page", "Dashboard", "Pricing", etc.
  platform TEXT DEFAULT 'web' CHECK (platform IN ('web', 'mobile')),
  style_tags TEXT[], -- Array of style tags: "Minimalist", "Colorful", "Dark mode", etc.
  image_url TEXT NOT NULL, -- Full screenshot stored in Supabase Storage
  thumbnail_url TEXT, -- Optional smaller version
  viewport_width INT DEFAULT 1920,
  viewport_height INT DEFAULT 1080,
  access_level TEXT DEFAULT 'free' CHECK (access_level IN ('free', 'paid')),
  captured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_screenshots_category ON screenshots(category);
CREATE INDEX IF NOT EXISTS idx_screenshots_platform ON screenshots(platform);
CREATE INDEX IF NOT EXISTS idx_screenshots_access_level ON screenshots(access_level);
CREATE INDEX IF NOT EXISTS idx_screenshots_created_at ON screenshots(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_screenshots_style_tags ON screenshots USING GIN(style_tags);

-- Enable Row Level Security (RLS)
ALTER TABLE screenshots ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view screenshots (public gallery)
CREATE POLICY "Anyone can view screenshots"
  ON screenshots
  FOR SELECT
  USING (true);

-- Policy: Only admins can insert screenshots (handled by service role key in API)
-- No policy needed as we use service role key in API routes

-- Add trigger to update updated_at automatically
CREATE TRIGGER update_screenshots_updated_at 
  BEFORE UPDATE ON screenshots 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

