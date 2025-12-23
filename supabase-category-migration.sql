-- Add category and platform fields to figma_components table
-- Run this in Supabase SQL Editor

-- Add category column
ALTER TABLE figma_components 
ADD COLUMN IF NOT EXISTS category TEXT;

-- Add platform column (web, dashboard, mobile)
ALTER TABLE figma_components 
ADD COLUMN IF NOT EXISTS platform TEXT DEFAULT 'web' CHECK (platform IN ('web', 'dashboard', 'mobile'));

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_figma_components_category ON figma_components(category);
CREATE INDEX IF NOT EXISTS idx_figma_components_platform ON figma_components(platform);

-- Update existing components to have default platform
UPDATE figma_components 
SET platform = 'web' 
WHERE platform IS NULL;

