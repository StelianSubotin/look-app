-- Run this SQL in your Supabase SQL Editor to create the components table
-- Go to: SQL Editor > New Query > Paste this > Run

CREATE TABLE IF NOT EXISTS figma_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  clipboard_string TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_figma_components_created_at ON figma_components(created_at DESC);

-- Add a trigger to update updated_at automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_figma_components_updated_at 
    BEFORE UPDATE ON figma_components 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();


