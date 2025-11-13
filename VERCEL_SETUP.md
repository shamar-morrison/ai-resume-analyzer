# Vercel Deployment Setup Guide

## 🚀 Deploy MongoDB + Clerk Webhooks to Vercel

### Step 1: Update Environment Variables in Vercel

1. Go to your Vercel project dashboard: https://vercel.com/dashboard
2. Navigate to your project: **ai-resume-analyzer**
3. Click **Settings** → **Environment Variables**

4. Add the following environment variables:

#### MongoDB Configuration
- **Variable Name**: `MONGODB_URI`
- **Value**: `mongodb+srv://shamar2000:4Ih8wpo10Coh0r5v@ai-resume-analyzer.dbrceqq.mongodb.net/ai-resume-analyzer?appName=ai-resume-analyzer`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

#### Clerk Webhook Secret
- **Variable Name**: `CLERK_WEBHOOK_SECRET`
- **Value**: `whsec_8cAJS+XnOLlHHelDQL8YZ9uk0fNG7HGt`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

#### Existing Clerk Variables (verify these are set)
- **Variable Name**: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- **Value**: `pk_test_dXNlZnVsLWhlcm1pdC0xLmNsZXJrLmFjY291bnRzLmRldiQ`

- **Variable Name**: `CLERK_SECRET_KEY`
- **Value**: `sk_test_clQ5xysDmJ8mdg9Oe2y3r9L2HJbbnIam1HfGy4vY2Y`

### Step 2: Redeploy Your Application

After adding environment variables, you need to redeploy:

**Option A: Push to Git (Recommended)**
```bash
git add .
git commit -m "Add MongoDB and webhook integration"
git push origin main
```
Vercel will automatically deploy the changes.

**Option B: Manual Redeploy**
1. Go to **Deployments** tab in Vercel
2. Click the **...** menu on your latest deployment
3. Click **Redeploy**
4. Check ✅ "Use existing Build Cache"
5. Click **Redeploy**

### Step 3: Verify Webhook Endpoint

Your webhook URL should be:
```
https://ai-resume-analyzer-sigma-pearl.vercel.app/api/webhooks/clerk
```

Make sure this is configured in Clerk dashboard:
1. Go to https://dashboard.clerk.com
2. Navigate to **Webhooks**
3. Verify the endpoint URL matches
4. Ensure these events are subscribed:
   - ✅ `user.created`
   - ✅ `user.updated`
   - ✅ `user.deleted`

### Step 4: Test the Integration

**Method 1: Retry Failed Webhook**
1. Go to Clerk Dashboard → Webhooks → Your endpoint
2. Find the failed `user.created` event
3. Click **Resend**
4. Check the response - should be 201 with success message

**Method 2: Create a New User**
1. Create a new user in your app
2. Check Clerk Dashboard → Webhooks for the event
3. Verify status is 200/201 (success)

### Step 5: Check Logs

**Vercel Function Logs:**
1. Go to Vercel project → **Logs** tab
2. Filter for `/api/webhooks/clerk`
3. Look for these log messages:
   - 🔔 Webhook received
   - ✅ Webhook secret found
   - ✅ Webhook signature verified
   - 📋 Event type: user.created
   - 💾 Attempting to create user in MongoDB
   - ✅ User created successfully

**MongoDB Atlas Logs:**
1. Go to MongoDB Atlas dashboard
2. Check **Database** → **Browse Collections**
3. Select `ai-resume-analyzer` database
4. You should see a `users` collection with your synced users

### Troubleshooting

#### Error: "CLERK_WEBHOOK_SECRET not found"
- Solution: Verify environment variable is added in Vercel and redeploy

#### Error: "Verification failed"
- Solution: Ensure webhook secret matches exactly (copy from Clerk dashboard)

#### Error: "Failed to create user"
- Solution: Check MongoDB URI is correct and includes database name `/ai-resume-analyzer`
- Verify MongoDB Atlas allows connections from anywhere (IP whitelist: 0.0.0.0/0)

#### MongoDB Connection Issues
1. Go to MongoDB Atlas
2. Navigate to **Network Access**
3. Click **Add IP Address**
4. Click **Allow Access from Anywhere** (0.0.0.0/0)
5. Save changes

#### Still Getting Errors?
Check Vercel function logs for detailed error messages with:
- Error message
- Stack trace
- Database name being used
- Event type

---

## ✅ Success Indicators

Your integration is working correctly when:
1. ✅ Clerk webhooks show 201 status for `user.created` events
2. ✅ Clerk webhooks show 200 status for `user.updated` and `user.deleted` events
3. ✅ MongoDB `ai-resume-analyzer` database has a `users` collection
4. ✅ User documents appear in MongoDB when users sign up
5. ✅ Vercel logs show successful webhook processing

---

## 🔐 Security Notes

**Important**: The credentials in this file are from your development environment. For production:

1. **Use separate MongoDB cluster** for production
2. **Rotate Clerk keys** if they've been exposed
3. **Use Vercel's secret management** instead of committing sensitive values
4. **Enable MongoDB IP whitelist** to only allow Vercel IPs (after testing)

To get Vercel's outbound IPs:
https://vercel.com/docs/concepts/edge-network/regions#region-list
