-- Add access_level column to figma_components table
-- Run this in Supabase SQL Editor

-- Add access_level column (defaults to 'free' for existing components)
ALTER TABLE figma_components 
ADD COLUMN IF NOT EXISTS access_level TEXT DEFAULT 'free' CHECK (access_level IN ('free', 'paid'));

-- Update existing components to be free by default
UPDATE figma_components 
SET access_level = 'free' 
WHERE access_level IS NULL;

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_figma_components_access_level ON figma_components(access_level);


