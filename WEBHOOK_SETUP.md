# Webhook Setup - Important!

## Service Role Key Required

The webhook handler needs the **Supabase Service Role Key** to update user metadata. The anon key doesn't have permission to update user data.

## Step 1: Get Your Service Role Key

1. Go to Supabase Dashboard → Settings → API
2. Find **"service_role"** key (NOT the anon key)
3. Copy it (it starts with `eyJ...`)

⚠️ **Important:** This key has admin privileges. Never expose it in client-side code!

## Step 2: Add to Vercel Environment Variables

In Vercel → Settings → Environment Variables, add:

```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Step 3: Redeploy

After adding the environment variable, redeploy your app.

## How It Works

1. User completes payment on LemonSqueezy
2. LemonSqueezy sends webhook to `/api/webhooks/lemonsqueezy`
3. Webhook handler extracts user ID from custom data
4. Uses service role key to update user metadata: `plan: 'paid'`
5. User's profile page shows "Pro Plan" instead of "Free Plan"

## Testing

After setup, you can test by:
1. Making a test payment
2. Checking Vercel function logs for webhook events
3. Verifying user metadata is updated in Supabase Dashboard

## Troubleshooting

**Webhook not updating user:**
- Check if `SUPABASE_SERVICE_ROLE_KEY` is set in Vercel
- Check Vercel function logs for errors
- Verify webhook is receiving events (check LemonSqueezy webhook logs)

**User ID not found:**
- Check that custom data is being sent in checkout
- Verify user ID format in webhook payload

