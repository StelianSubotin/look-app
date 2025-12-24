# Quick Deploy Guide

## Option 1: Use the Deploy Script (Easiest)

```bash
cd ~/Desktop/login-app
./deploy.sh "Your commit message here"
```

**Example:**
```bash
./deploy.sh "Update admin messages to centered dialogs"
```

## Option 2: Manual Commands

```bash
cd ~/Desktop/login-app
git add .
git commit -m "Your commit message"
git push
```

## Option 3: Create a Terminal Alias (One-time setup)

Add this to your `~/.zshrc` file:

```bash
alias deploy='cd ~/Desktop/login-app && git add . && git commit -m "$1" && git push'
```

Then reload your shell:
```bash
source ~/.zshrc
```

Now you can just type:
```bash
deploy "Your commit message"
```

## What Happens After Push?

1. ✅ Changes are pushed to GitHub
2. ✅ Vercel automatically detects the push
3. ✅ Vercel starts building (1-2 minutes)
4. ✅ Vercel deploys to your live site

## Check Deployment Status

Visit: https://vercel.com/dashboard


