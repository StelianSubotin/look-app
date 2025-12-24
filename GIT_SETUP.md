# Git & GitHub Setup Instructions

## Step 1: Open Terminal
Open Terminal on your Mac (Applications → Utilities → Terminal, or press Cmd+Space and type "Terminal")

## Step 2: Navigate to Your Project
```bash
cd ~/Desktop/login-app
```

## Step 3: Initialize Git
```bash
git init
```

## Step 4: Add All Files
```bash
git add .
```

## Step 5: Make Your First Commit
```bash
git commit -m "Initial commit - Lookscout Figma components app"
```

## Step 6: Create GitHub Repository

### Option A: Using GitHub Website (Easiest)
1. Go to https://github.com and sign in
2. Click the "+" icon in the top right → "New repository"
3. Name it (e.g., "lookscout-app" or "figma-components")
4. **DO NOT** check "Initialize with README" (we already have files)
5. Click "Create repository"

### Option B: Using GitHub CLI (if you have it installed)
```bash
gh repo create lookscout-app --public --source=. --remote=origin --push
```

## Step 7: Connect to GitHub (if using Option A)
After creating the repo on GitHub, you'll see a page with instructions. Copy the commands, or use these:

```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git branch -M main
git push -u origin main
```

**Replace:**
- `YOUR-USERNAME` with your GitHub username
- `YOUR-REPO-NAME` with the repository name you created

## Step 8: Verify
Go to your GitHub repository page - you should see all your files!

## Troubleshooting

**If you get "fatal: not a git repository":**
- Make sure you're in the `/Users/stel/Desktop/login-app` directory
- Run `pwd` to check your current directory

**If you get authentication errors:**
- GitHub no longer accepts passwords for git operations
- You need to use a Personal Access Token:
  1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
  2. Generate new token (classic)
  3. Give it "repo" permissions
  4. Copy the token
  5. When pushing, use the token as your password

**If .env.local is being committed:**
- Check that `.gitignore` includes `.env*.local` (it should)
- If it's already committed, run:
  ```bash
  git rm --cached .env.local
  git commit -m "Remove .env.local from git"
  ```


