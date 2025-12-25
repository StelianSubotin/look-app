-- Proposal Generator V2 - Enhanced Features Migration
-- Run this in Supabase SQL Editor AFTER the initial proposals migration

-- Add new columns to proposals table
ALTER TABLE proposals 
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS password_hash TEXT,
ADD COLUMN IF NOT EXISTS vanity_slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS last_viewed_at TIMESTAMP WITH TIME ZONE;

-- Create index for vanity slug lookups
CREATE INDEX IF NOT EXISTS idx_proposals_vanity_slug ON proposals(vanity_slug);

-- Create proposal_views table for analytics
CREATE TABLE IF NOT EXISTS proposal_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  viewer_ip TEXT,
  viewer_location TEXT,
  user_agent TEXT,
  referrer TEXT,
  time_spent_seconds INTEGER,
  sections_viewed TEXT[],
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for proposal_views
CREATE INDEX IF NOT EXISTS idx_proposal_views_proposal_id ON proposal_views(proposal_id);
CREATE INDEX IF NOT EXISTS idx_proposal_views_viewed_at ON proposal_views(viewed_at DESC);

-- Create proposal_comments table
CREATE TABLE IF NOT EXISTS proposal_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT,
  content TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false, -- Internal comments only visible to proposal owner
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for proposal_comments
CREATE INDEX IF NOT EXISTS idx_proposal_comments_proposal_id ON proposal_comments(proposal_id);
CREATE INDEX IF NOT EXISTS idx_proposal_comments_created_at ON proposal_comments(created_at DESC);

-- Enable RLS on new tables
ALTER TABLE proposal_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_comments ENABLE ROW LEVEL SECURITY;

-- Policies for proposal_views
-- Anyone can insert a view (tracking)
CREATE POLICY "Anyone can log proposal views"
  ON proposal_views
  FOR INSERT
  WITH CHECK (true);

-- Proposal owners can view their analytics
CREATE POLICY "Owners can view their proposal analytics"
  ON proposal_views
  FOR SELECT
  USING (
    proposal_id IN (
      SELECT id FROM proposals WHERE user_id = auth.uid()
    )
  );

-- Policies for proposal_comments
-- Anyone can add comments to shared proposals
CREATE POLICY "Anyone can comment on shared proposals"
  ON proposal_comments
  FOR INSERT
  WITH CHECK (
    proposal_id IN (
      SELECT id FROM proposals WHERE share_link IS NOT NULL
    )
  );

-- Proposal owners can view all comments
CREATE POLICY "Owners can view comments on their proposals"
  ON proposal_comments
  FOR SELECT
  USING (
    proposal_id IN (
      SELECT id FROM proposals WHERE user_id = auth.uid()
    )
  );

-- Public can view non-internal comments
CREATE POLICY "Public can view non-internal comments"
  ON proposal_comments
  FOR SELECT
  USING (
    is_internal = false AND
    proposal_id IN (
      SELECT id FROM proposals WHERE share_link IS NOT NULL
    )
  );

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_proposal_views(proposal_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE proposals 
  SET 
    view_count = view_count + 1,
    last_viewed_at = NOW()
  WHERE id = proposal_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to accept a proposal
CREATE OR REPLACE FUNCTION accept_proposal(proposal_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE proposals 
  SET 
    status = 'accepted',
    accepted_at = NOW()
  WHERE id = proposal_id_param AND status != 'accepted';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION increment_proposal_views(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION accept_proposal(UUID) TO anon, authenticated;

