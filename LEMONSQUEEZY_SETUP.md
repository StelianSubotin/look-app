# LemonSqueezy Integration Setup Guide

## Step 1: Get Your LemonSqueezy Credentials

1. Go to [LemonSqueezy Dashboard](https://app.lemonsqueezy.com)
2. Navigate to **Settings** → **API**
3. Copy your **API Key**
4. Note your **Store ID** (found in your store URL or settings)

## Step 2: Create a Product and Variant

1. Go to **Products** in LemonSqueezy dashboard
2. Click **"Create Product"**
3. Set up your Pro Plan:
   - Name: "Pro Plan" or "Lookscout Pro"
   - Price: $9/month (or your preferred price)
   - Billing: Recurring (Monthly)
   - Description: "Unlimited downloads, priority support, and early access to new features"
4. After creating, note the **Variant ID** (you'll see it in the product details)

## Step 3: Set Up Webhook

1. Go to **Settings** → **Webhooks** in LemonSqueezy
2. Click **"Create Webhook"**
3. Set the webhook URL to: `https://your-vercel-url.vercel.app/api/webhooks/lemonsqueezy`
4. Select these events:
   - `subscription_created`
   - `subscription_updated`
   - `subscription_cancelled`
   - `subscription_expired`
   - `subscription_payment_success`
   - `subscription_payment_failed`
5. Copy the **Webhook Secret** (you'll need this for verification)

## Step 4: Add Environment Variables

Add these to your Vercel project settings (Environment Variables):

```
LEMONSQUEEZY_API_KEY=your_api_key_here
LEMONSQUEEZY_STORE_ID=your_store_id_here
LEMONSQUEEZY_VARIANT_ID_PRO=your_variant_id_here
LEMONSQUEEZY_WEBHOOK_SECRET=your_webhook_secret_here
```

## Step 5: Update Database (Optional)

If you want to store subscription data in a separate table, run this SQL in Supabase:

```sql
-- Create subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id TEXT UNIQUE,
  status TEXT,
  plan TEXT DEFAULT 'free',
  renews_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_subscription_id ON user_subscriptions(subscription_id);
```

## Step 6: Test the Integration

1. Deploy your changes to Vercel
2. Go to your profile page
3. Click "Upgrade to Pro"
4. Complete a test checkout (use LemonSqueezy test mode)
5. Check that the webhook is received and user is updated

## Troubleshooting

- **Webhook not working?** Check Vercel function logs and ensure the webhook URL is correct
- **Checkout not creating?** Verify your API key and variant ID are correct
- **User not updating?** Check webhook signature verification and Supabase admin permissions

## Next Steps

- Add subscription management (cancel, resume)
- Add usage limits based on plan
- Add billing history page
- Add email notifications for subscription events


