# Quick Start Guide - Authentication

Get authentication up and running in 5 minutes!

## Step 1: Get Clerk Keys (2 minutes)

1. Visit [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Create an account or sign in
3. Create a new application
4. Enable **Email** and **Google** authentication
5. Go to **API Keys** and copy both keys

## Step 2: Configure Environment Variables (1 minute)

1. Open `.env.local` in the project root
2. Paste your keys:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
CLERK_SECRET_KEY=sk_test_YOUR_KEY_HERE
```

3. Save the file

## Step 3: Run the App (2 minutes)

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## That's It! 🎉

You should now see:
- **Home page** with a "Sign In" button
- Click "Sign In" → Modal appears
- Try signing up or signing in
- After login → Dashboard page

## What's Available

### Routes
- `/` - Home page (public)
- `/login` - Login page
- `/register` - Register page
- `/dashboard` - Protected dashboard (requires login)

### Features
- ✅ Email/password authentication
- ✅ Google OAuth login
- ✅ Email verification
- ✅ Password strength indicator
- ✅ Modal & dedicated page flows
- ✅ Protected routes
- ✅ Custom UI (no Clerk prebuilt components)

## Need Help?

See [SETUP.md](./SETUP.md) for detailed instructions.
See [AUTH_REFERENCE.md](./AUTH_REFERENCE.md) for technical details.

## Troubleshooting

**"Invalid publishable key" error?**
- Double-check your keys in `.env.local`
- Restart the dev server: `npm run dev`

**Google OAuth not working?**
- Enable Google in Clerk dashboard: User & Authentication → Social Connections
- Add `http://localhost:3000/sso-callback` to allowed redirect URLs

**Can't access dashboard?**
- Make sure you're signed in
- Check that middleware.ts exists in project root
