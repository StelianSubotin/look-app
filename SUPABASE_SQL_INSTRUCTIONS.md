# How to Run SQL Script in Supabase

## Step-by-Step Instructions

### 1. Go to Supabase Dashboard
- Visit: https://supabase.com/dashboard
- Select your project

### 2. Open SQL Editor
- Click **"SQL Editor"** in the left sidebar
- Click **"New query"** button (top right)

### 3. Copy and Paste This SQL:

```sql
-- Update component access levels
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
```

### 4. Run the Query
- Click the **"Run"** button (or press `Ctrl+Enter` / `Cmd+Enter`)
- Wait for "Success" message

### 5. Verify Results
- You should see a table showing all components with their `access_level`
- "yyy" should show `access_level = 'paid'`
- All other components should show `access_level = 'free'`

## Alternative: Manual Update via Table Editor

If you prefer using the UI:

1. Go to **"Table Editor"** in left sidebar
2. Select **"figma_components"** table
3. Find the component named "yyy"
4. Click on the `access_level` cell
5. Change it to `paid`
6. Click "Save" or press Enter
7. For other components, set `access_level` to `free`

## Troubleshooting

**If you get an error:**
- Make sure the table name is exactly `figma_components`
- Make sure the column `access_level` exists (run the paywall migration if needed)
- Check that component names match exactly (case-sensitive)

**To check if access_level column exists:**
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'figma_components' 
AND column_name = 'access_level';
```


