-- Create sites table to group screenshots by product/brand (Mobbin-style)
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE, -- "ClickUp", "Figma", "Notion", etc.
  slug TEXT NOT NULL UNIQUE, -- URL-friendly: "click-up", "figma", "notion"
  description TEXT,
  logo_url TEXT, -- Logo/icon for the site
  website_url TEXT, -- Official website
  industry TEXT, -- "Productivity", "Design", "Finance", etc.
  style_tags TEXT[], -- Overall style: "Modern", "Minimalist", "Colorful"
  screenshot_count INT DEFAULT 0, -- Cached count
  access_level TEXT DEFAULT 'free' CHECK (access_level IN ('free', 'paid')),
  featured BOOLEAN DEFAULT false, -- Show on homepage
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add site_id column to screenshots table
ALTER TABLE screenshots ADD COLUMN IF NOT EXISTS site_id UUID REFERENCES sites(id) ON DELETE SET NULL;

-- Add page_name column to distinguish different pages within a site
ALTER TABLE screenshots ADD COLUMN IF NOT EXISTS page_name TEXT; -- "Homepage", "Dashboard", "Pricing", etc.

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_screenshots_site_id ON screenshots(site_id);
CREATE INDEX IF NOT EXISTS idx_sites_slug ON sites(slug);
CREATE INDEX IF NOT EXISTS idx_sites_industry ON sites(industry);
CREATE INDEX IF NOT EXISTS idx_sites_featured ON sites(featured);
CREATE INDEX IF NOT EXISTS idx_sites_style_tags ON sites USING GIN(style_tags);

-- Enable RLS on sites table
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view sites
CREATE POLICY "Anyone can view sites"
  ON sites
  FOR SELECT
  USING (true);

-- Add trigger to update updated_at automatically
CREATE OR REPLACE FUNCTION update_sites_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sites_updated_at
  BEFORE UPDATE ON sites
  FOR EACH ROW
  EXECUTE FUNCTION update_sites_updated_at();

-- Function to update screenshot count
CREATE OR REPLACE FUNCTION update_site_screenshot_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE sites 
    SET screenshot_count = screenshot_count + 1 
    WHERE id = NEW.site_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE sites 
    SET screenshot_count = screenshot_count - 1 
    WHERE id = OLD.site_id;
  ELSIF TG_OP = 'UPDATE' AND NEW.site_id != OLD.site_id THEN
    -- Moved to different site
    UPDATE sites 
    SET screenshot_count = screenshot_count - 1 
    WHERE id = OLD.site_id;
    UPDATE sites 
    SET screenshot_count = screenshot_count + 1 
    WHERE id = NEW.site_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_screenshot_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON screenshots
  FOR EACH ROW
  EXECUTE FUNCTION update_site_screenshot_count();

