-- Create proposals table for Proposal Generator
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Client Information
  client_name TEXT NOT NULL,
  client_logo_url TEXT,
  client_email TEXT,
  client_company TEXT,
  
  -- Project Details
  project_title TEXT NOT NULL,
  project_description TEXT,
  project_goals TEXT[],
  
  -- Deliverables
  deliverables JSONB DEFAULT '[]'::jsonb, -- Array of {title, description, timeline}
  
  -- Timeline & Pricing
  timeline_start DATE,
  timeline_end DATE,
  total_price DECIMAL(10, 2),
  payment_terms TEXT,
  
  -- Additional Sections
  about_us TEXT,
  portfolio_items TEXT[], -- URLs to portfolio pieces
  testimonials JSONB DEFAULT '[]'::jsonb, -- Array of {name, company, quote}
  terms_conditions TEXT,
  
  -- Metadata
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected')),
  share_link TEXT UNIQUE, -- Unique shareable link ID
  viewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_proposals_user_id ON proposals(user_id);
CREATE INDEX IF NOT EXISTS idx_proposals_share_link ON proposals(share_link);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_created_at ON proposals(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own proposals
CREATE POLICY "Users can view own proposals"
  ON proposals
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can create their own proposals
CREATE POLICY "Users can create proposals"
  ON proposals
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own proposals
CREATE POLICY "Users can update own proposals"
  ON proposals
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own proposals
CREATE POLICY "Users can delete own proposals"
  ON proposals
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Anyone can view proposals via share link (public access)
CREATE POLICY "Anyone can view shared proposals"
  ON proposals
  FOR SELECT
  USING (share_link IS NOT NULL);

-- Add trigger to update updated_at automatically
CREATE OR REPLACE FUNCTION update_proposals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_proposals_updated_at
  BEFORE UPDATE ON proposals
  FOR EACH ROW
  EXECUTE FUNCTION update_proposals_updated_at();

-- Generate unique share link on insert if not provided
CREATE OR REPLACE FUNCTION generate_proposal_share_link()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.share_link IS NULL THEN
    NEW.share_link = LOWER(SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 12));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_proposal_share_link
  BEFORE INSERT ON proposals
  FOR EACH ROW
  EXECUTE FUNCTION generate_proposal_share_link();

