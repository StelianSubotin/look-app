# LemonSqueezy "The related resource does not exist" Error

## What This Error Means

"The related resource does not exist" from LemonSqueezy API means one of these:
1. **Store ID is incorrect** - The store doesn't exist or you don't have access
2. **Variant ID is incorrect** - The variant doesn't exist or belongs to a different store
3. **API Key doesn't have access** - Your API key can't access this store/variant

## How to Fix

### Step 1: Verify Your Store ID

1. Go to LemonSqueezy Dashboard
2. Click on your Store
3. Look at the URL: `https://app.lemonsqueezy.com/stores/12345`
   - The number at the end (`12345`) is your Store ID
4. Make sure this matches `LEMONSQUEEZY_STORE_ID` in Vercel

### Step 2: Verify Your Variant ID

1. Go to LemonSqueezy Dashboard → Products
2. Click on your Pro Plan product
3. Click on the variant
4. Look at the URL: `https://app.lemonsqueezy.com/products/.../variants/67890`
   - The number at the end (`67890`) is your Variant ID
5. Make sure this matches `LEMONSQUEEZY_VARIANT_ID_PRO` in Vercel

### Step 3: Verify API Key Has Access

1. Go to LemonSqueezy Dashboard → Settings → API
2. Make sure your API key is active
3. Test the API key with this command:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Accept: application/vnd.api+json" \
     https://api.lemonsqueezy.com/v1/stores
```

This should return your stores. If it doesn't, your API key is invalid.

### Step 4: Check Environment Variables Format

In Vercel, make sure your environment variables are:
- **Just the numbers** - No URLs, no extra text
- Example: `LEMONSQUEEZY_STORE_ID=12345` (not `https://...` or `store_12345`)

### Step 5: Test Direct Checkout URL

As a fallback, you can test with a direct checkout URL:

```
https://YOUR_STORE_ID.lemonsqueezy.com/checkout/buy/YOUR_VARIANT_ID
```

Replace:
- `YOUR_STORE_ID` with your actual store ID
- `YOUR_VARIANT_ID` with your actual variant ID

If this works, the issue is with the API call format, not the IDs.

## Quick Checklist

- [ ] Store ID is correct (just the number from URL)
- [ ] Variant ID is correct (just the number from URL)
- [ ] API Key is valid and active
- [ ] Environment variables are set in Vercel
- [ ] Redeployed after setting environment variables
- [ ] Store ID and Variant ID are strings (not URLs)

## Still Not Working?

Share:
1. Your Store ID format (first 2-3 digits, e.g., "123...")
2. Your Variant ID format (first 2-3 digits, e.g., "678...")
3. Whether the API key test command works
4. Whether direct checkout URL works

