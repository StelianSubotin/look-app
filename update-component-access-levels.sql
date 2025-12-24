-- Update component access levels
-- Run this in Supabase SQL Editor

-- Set "yyy" component to paid (Pro users only)
UPDATE figma_components 
SET access_level = 'paid' 
WHERE name = 'yyy';

-- Set all other components to free (accessible to all users)
UPDATE figma_components 
SET access_level = 'free' 
WHERE name != 'yyy' OR name IS NULL;

-- Verify the changes
SELECT id, name, access_level 
FROM figma_components 
ORDER BY name;


