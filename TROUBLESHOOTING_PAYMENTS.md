# Troubleshooting Payment Integration

## Common Issues

### 1. "LemonSqueezy not configured" Error

**Check:**
- Go to Vercel → Your Project → Settings → Environment Variables
- Verify these are set:
  - `LEMONSQUEEZY_API_KEY`
  - `LEMONSQUEEZY_STORE_ID`
  - `LEMONSQUEEZY_VARIANT_ID_PRO`
  - `LEMONSQUEEZY_WEBHOOK_SECRET`

**Fix:**
- Add missing variables
- Redeploy your app after adding variables

### 2. Button Does Nothing / No Response

**Check:**
- Open browser console (F12 → Console tab)
- Click "Upgrade to Pro" button
- Look for error messages

**Common errors:**
- `401 Unauthorized` - User not logged in
- `500 Internal Server Error` - Check Vercel function logs
- `Failed to create checkout session` - LemonSqueezy API issue

### 3. Check Vercel Function Logs

1. Go to Vercel Dashboard
2. Click on your project
3. Go to "Functions" tab
4. Click on `/api/checkout` function
5. Check "Logs" for errors

### 4. Test LemonSqueezy API Directly

You can test if your API key works:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Accept: application/vnd.api+json" \
     https://api.lemonsqueezy.com/v1/stores
```

### 5. Verify Variant ID

1. Go to LemonSqueezy Dashboard
2. Products → Your Pro Plan Product
3. Click on the variant
4. Copy the Variant ID from the URL or product details
5. Make sure it matches `LEMONSQUEEZY_VARIANT_ID_PRO` in Vercel

### 6. Check Network Tab

1. Open browser DevTools (F12)
2. Go to "Network" tab
3. Click "Upgrade to Pro"
4. Look for `/api/checkout` request
5. Check:
   - Status code (should be 200)
   - Response body (should have `checkoutUrl`)
   - Request payload

### 7. Alternative: Direct Checkout URL

If API method doesn't work, you can use a direct checkout URL:

```typescript
// In profile page, replace handleUpgrade with:
const handleUpgrade = () => {
  const variantId = process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_ID
  const storeId = process.env.NEXT_PUBLIC_LEMONSQUEEZY_STORE_ID
  const checkoutUrl = `https://${storeId}.lemonsqueezy.com/checkout/buy/${variantId}?checkout[custom][user_id]=${user?.id}&checkout[custom][email]=${encodeURIComponent(user?.email || '')}`
  window.location.href = checkoutUrl
}
```

## Quick Debug Steps

1. ✅ Check environment variables in Vercel
2. ✅ Check browser console for errors
3. ✅ Check Vercel function logs
4. ✅ Verify LemonSqueezy API key works
5. ✅ Verify Variant ID is correct
6. ✅ Test with direct checkout URL as fallback

## Still Not Working?

Share:
- Browser console errors
- Vercel function logs
- Network tab response
- Any error messages you see


