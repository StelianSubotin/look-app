-- Add dark mode support to figma_components table
-- Run this in Supabase SQL Editor

-- Add dark mode clipboard string column
ALTER TABLE figma_components 
ADD COLUMN IF NOT EXISTS clipboard_string_dark TEXT;

-- Add dark mode image URL (optional - if you want separate images for dark mode)
ALTER TABLE figma_components 
ADD COLUMN IF NOT EXISTS image_url_dark TEXT;

-- Update existing components to have dark mode fields (set to null initially)
-- This is safe to run multiple times


