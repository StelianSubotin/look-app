# Password Reset Email Troubleshooting

## Common Issues and Solutions

### 1. ✅ Check Supabase Redirect URLs

**Go to:** Supabase Dashboard → Authentication → URL Configuration

**Add these Redirect URLs:**
- `https://look-app-eight.vercel.app/reset-password`
- `http://localhost:3001/reset-password` (for local testing)

**Important:** The redirect URL in the code must match exactly what's configured in Supabase.

### 2. ✅ Check Email Service Status

**Go to:** Supabase Dashboard → Settings → Auth

**Check:**
- Email service is enabled
- SMTP settings are configured (if using custom SMTP)
- Default Supabase email service is active

### 3. ✅ Check Spam/Junk Folder

- Password reset emails might go to spam
- Check your email's spam/junk folder
- Add Supabase emails to your contacts/whitelist

### 4. ✅ Check Email Rate Limiting

Supabase has rate limits on password reset emails:
- **Free tier:** Limited emails per hour
- **Pro tier:** Higher limits

**If you hit the limit:**
- Wait 1 hour and try again
- Or upgrade your Supabase plan

### 5. ✅ Verify Email Address

Make sure:
- The email address exists in your Supabase database
- The email is correctly formatted
- You're using the same email you signed up with

### 6. ✅ Check Browser Console

Open browser console (F12) and look for:
- `Sending password reset email to: [email]`
- `Redirect URL: [url]`
- Any error messages

### 7. ✅ Check Supabase Logs

**Go to:** Supabase Dashboard → Logs → Auth Logs

Look for:
- Password reset attempts
- Email sending errors
- Rate limiting messages

### 8. ✅ Test with Different Email

Try:
- A different email address
- A Gmail account (usually works best)
- Check if the issue is email-specific

### 9. ✅ Verify Site URL

**Go to:** Supabase Dashboard → Settings → Auth

**Site URL should be:**
- `https://look-app-eight.vercel.app`

### 10. ✅ Manual Email Check

If emails aren't coming through:
1. Check Supabase dashboard for email logs
2. Try using a different email provider
3. Check if your email domain blocks Supabase emails

## Quick Test Steps

1. Go to `/forgot-password`
2. Enter your email
3. Check browser console for logs
4. Check email (including spam)
5. Check Supabase Auth logs
6. Verify redirect URL is configured

## Still Not Working?

1. **Check Supabase Status:** https://status.supabase.com
2. **Try Custom SMTP:** Configure your own email service in Supabase
3. **Contact Support:** Supabase support or check their Discord


