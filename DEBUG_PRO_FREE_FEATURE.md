# Debugging Pro/Free Component Access Feature

## Checklist

### 1. ✅ Code Changes
- [x] Admin always has "paid" access (implemented)
- [x] Components filtered by access_level (implemented)
- [x] Component cards show locked state (implemented)

### 2. ⚠️ Database Setup (REQUIRED)
**You MUST run the SQL script in Supabase:**
1. Go to Supabase → SQL Editor
2. Open `update-component-access-levels.sql`
3. Copy and paste the SQL
4. Click "Run"

**Or manually set access levels:**
```sql
-- Set "yyy" to paid
UPDATE figma_components SET access_level = 'paid' WHERE name = 'yyy';

-- Set others to free
UPDATE figma_components SET access_level = 'free' WHERE name != 'yyy';
```

### 3. ⚠️ Deployment (REQUIRED)
**Push changes to GitHub:**
```bash
cd ~/Desktop/login-app
git push
```

Wait for Vercel to deploy (check Vercel dashboard).

### 4. Testing

**Test as Admin (steliansubotin@gmail.com):**
- Should see ALL components (including "yyy")
- All components should be unlocked
- "yyy" should show "PRO" badge

**Test as Regular User (e.g., tegoma8853@mucate.com):**
- Should see free components unlocked
- "yyy" should be LOCKED (blurred, with "Upgrade to Pro" button)
- Clicking locked component should redirect to /profile

### 5. Debug Console Logs

Open browser console (F12) and check:
- `User plan check:` - Shows user email, isAdmin, plan
- `Fetched components:` - Shows components with their access_level

### 6. Common Issues

**Issue: All components show as unlocked**
- ✅ Are you logged in as admin? (Admin sees everything)
- ❌ Did you run the SQL script? (Components need access_level set)
- ❌ Are changes deployed? (Check Vercel)

**Issue: No components showing**
- Check browser console for errors
- Check Supabase database has components
- Verify API route is working

**Issue: Components don't have access_level**
- Run the SQL script in Supabase
- Or manually set access_level in Supabase dashboard


