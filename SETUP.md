# Authentication Setup Guide

This guide will help you set up Clerk authentication for the ResumeAI application.

## Prerequisites

- Node.js 18+ installed
- A Clerk account (free tier available)

## Step 1: Create a Clerk Application

1. Go to [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Sign up or sign in to your account
3. Click "Add application" or select an existing one
4. Choose a name for your application (e.g., "ResumeAI")
5. Select "Email" and "Google" as authentication methods
6. Click "Create application"

## Step 2: Configure Google OAuth (Optional but Recommended)

1. In your Clerk dashboard, navigate to **"User & Authentication"** → **"Social Connections"**
2. Find **"Google"** in the list
3. Toggle it **ON**
4. Click **"Configure"** and follow Clerk's instructions to set up Google OAuth
5. Save the configuration

## Step 3: Get Your API Keys

1. In your Clerk dashboard, go to **"API Keys"** in the sidebar
2. You'll see two keys:
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`)

## Step 4: Configure Environment Variables

1. Open the `.env.local` file in the project root
2. Replace the placeholder values with your actual Clerk keys:

```env
# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXXX
CLERK_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXXXX

# Clerk URLs (keep these as-is)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

**Important:** Never commit `.env.local` to version control!

## Step 5: Configure Redirect URLs in Clerk

1. In your Clerk dashboard, go to **"Paths"** in the sidebar
2. Configure the following paths:
   - **Sign-in URL:** `/login`
   - **Sign-up URL:** `/register`
   - **After sign-in URL:** `/dashboard`
   - **After sign-up URL:** `/dashboard`

3. Under **"Allowed redirect URLs"**, add:
   - `http://localhost:3000/sso-callback`
   - `http://localhost:3000/dashboard`
   - (Add your production URLs when deploying)

## Step 6: Install Dependencies (if not already done)

```bash
npm install
```

## Step 7: Run the Application

```bash
npm run dev
```

The application should now be running at [http://localhost:3000](http://localhost:3000)

## Testing Authentication

### Test the Modal Flow
1. Go to [http://localhost:3000](http://localhost:3000)
2. Click the "Sign In" button in the header
3. A modal should appear with login/register tabs
4. Try signing up with email or Google

### Test the Dedicated Pages
1. Visit [http://localhost:3000/login](http://localhost:3000/login)
2. Try signing in with email or Google
3. Visit [http://localhost:3000/register](http://localhost:3000/register)
4. Try creating a new account

### Test Protected Routes
1. While signed out, try visiting [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
2. You should be redirected to the login page
3. After signing in, you should be redirected to the dashboard

## Features Implemented

✅ **Custom UI** - No Clerk prebuilt components, fully custom design
✅ **Email/Password Authentication** - Sign up and sign in with email
✅ **Google OAuth** - One-click sign in with Google
✅ **Email Verification** - Automatic email verification on registration
✅ **Password Validation** - Minimum 8 characters, uppercase, lowercase, number
✅ **Password Strength Indicator** - Real-time feedback on password quality
✅ **Modal Authentication** - Quick access via dialog
✅ **Dedicated Auth Pages** - `/login` and `/register` routes
✅ **Protected Routes** - Dashboard requires authentication
✅ **User Management** - User profile with Clerk UserButton
✅ **Responsive Design** - Works on mobile, tablet, and desktop

## Troubleshooting

### "Invalid publishable key" error
- Double-check that you copied the correct key from Clerk dashboard
- Make sure the key starts with `pk_test_` or `pk_live_`
- Restart the dev server after updating `.env.local`

### Google OAuth not working
- Ensure you enabled Google in Clerk dashboard under "Social Connections"
- Check that redirect URLs are properly configured
- Make sure you're using HTTPS in production

### Redirects not working
- Verify the environment variables for redirect URLs are set correctly
- Check that the paths match in both `.env.local` and Clerk dashboard

### "Module not found" errors
- Run `npm install` to ensure all dependencies are installed
- Clear `.next` folder: `rm -rf .next`
- Restart the dev server

## Production Deployment

When deploying to production:

1. Update `.env.local` with production Clerk keys
2. Add production URLs to Clerk's allowed redirect URLs
3. Update environment variables in your hosting platform (Vercel, Netlify, etc.)
4. Ensure HTTPS is enabled

## Need Help?

- [Clerk Documentation](https://clerk.com/docs)
- [Next.js 14 + Clerk Guide](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk Discord Community](https://clerk.com/discord)

## Security Notes

- Never expose `CLERK_SECRET_KEY` in client-side code
- Always use environment variables for sensitive data
- Enable 2FA for your Clerk dashboard account
- Regularly review user sessions and security logs in Clerk dashboard
