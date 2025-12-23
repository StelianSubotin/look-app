#!/bin/bash

# Quick deploy script for Lookscout app
# Usage: ./deploy.sh (uses default message) OR ./deploy.sh "your custom message"

cd ~/Desktop/login-app

# Use provided message or default
if [ -z "$1" ]; then
  COMMIT_MSG="Update app - $(date +'%Y-%m-%d %H:%M:%S')"
else
  COMMIT_MSG="$1"
fi

# Stage all changes
git add .

# Commit with message
git commit -m "$COMMIT_MSG"

# Push to GitHub (triggers Vercel deployment)
git push

echo "✅ Changes pushed! Vercel will deploy automatically."
echo "Check deployment status at: https://vercel.com/dashboard"

