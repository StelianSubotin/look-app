# Deployment Guide

## Option 1: Vercel (Recommended for Next.js)

### Step 1: Prepare Your Code
1. Make sure your code is in a Git repository (GitHub, GitLab, or Bitbucket)
2. Push your code to the repository

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New Project"
3. Import your Git repository
4. Vercel will auto-detect Next.js settings

### Step 3: Configure Environment Variables
In Vercel project settings → Environment Variables, add:

```
DATABASE_URL=postgresql://postgres:Y6ExKyGQryPZlimI@db.tqtwfgjzzjtkevitkrnj.supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://tqtwfgjzzjtkevitkrnj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_NWJemkI4TS23ttRKSsNa1A_5tt5XbSi
NEXT_PUBLIC_SITE_URL=https://your-app-name.vercel.app
```

**Important:** Replace `NEXT_PUBLIC_SITE_URL` with your actual Vercel URL after first deployment.

### Step 4: Update Supabase Redirect URLs
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Set **Site URL** to: `https://your-app-name.vercel.app`
3. Add **Redirect URLs**:
   ```
   https://your-app-name.vercel.app/api/auth/callback
   https://your-app-name.vercel.app/api/auth/callback?type=signup
   https://your-app-name.vercel.app/api/auth/callback?next=/components
   ```

### Step 5: Deploy
Click "Deploy" and wait for it to complete!

---

## Option 2: Netlify

### Step 1: Install Netlify CLI (Optional)
```bash
npm install -g netlify-cli
```

### Step 2: Create netlify.toml
See `netlify.toml` file in project root

### Step 3: Deploy
1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`

### Step 4: Configure Environment Variables
In Netlify → Site settings → Environment variables, add the same variables as Vercel

### Step 5: Update Supabase Redirect URLs
Same as Vercel, but use your Netlify URL instead

---

## After Deployment

1. **Test the app** - Visit your deployed URL
2. **Test signup/login** - Create an account and verify email works
3. **Update admin password** - Change the hardcoded `admin123` password in production!

## Troubleshooting

- **Build fails?** Check the build logs in your hosting platform
- **Environment variables not working?** Make sure they're set for the correct environment (Production, Preview, Development)
- **Email verification not working?** Double-check Supabase redirect URLs match your deployed URL


