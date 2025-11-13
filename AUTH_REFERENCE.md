# Authentication System Reference

## Architecture Overview

The authentication system uses **Clerk** with fully custom UI components built with shadcn/ui and Tailwind CSS.

## File Structure

```
/app
  /(auth)                    # Auth route group (no layout wrapper)
    /login
      page.tsx              # Dedicated login page
    /register
      page.tsx              # Dedicated register page
  /dashboard
    page.tsx                # Protected dashboard (requires auth)
  /sso-callback
    page.tsx                # OAuth callback handler
  layout.tsx                # Root layout with ClerkProvider
  page.tsx                  # Public home page with auth modal

/components
  /auth
    auth-dialog.tsx         # Modal with login/register tabs
    login-form.tsx          # Custom login form (email + Google)
    register-form.tsx       # Custom register form with email verification
  /ui                       # shadcn/ui components
    button.tsx
    input.tsx
    label.tsx
    dialog.tsx
    tabs.tsx
    separator.tsx
    form.tsx

/lib
  /validations
    auth.schema.ts          # Zod validation schemas for forms
  utils.ts                  # Utility functions

middleware.ts               # Route protection middleware
.env.local                  # Environment variables (not in git)
.env.example               # Template for environment variables
```

## Key Components

### 1. AuthDialog (`components/auth/auth-dialog.tsx`)
- **Purpose:** Modal dialog for quick authentication
- **Features:**
  - Tabs to switch between Login and Sign Up
  - Links to dedicated pages
  - Controlled by open/onOpenChange props
- **Usage:**
  ```tsx
  const [open, setOpen] = useState(false)
  <AuthDialog open={open} onOpenChange={setOpen} />
  ```

### 2. LoginForm (`components/auth/login-form.tsx`)
- **Purpose:** Custom login form with Clerk integration
- **Features:**
  - Email/password login
  - Google OAuth button
  - Form validation with react-hook-form + zod
  - Error handling
  - Loading states
- **Clerk Hooks Used:**
  - `useSignIn()` - Handles authentication
  - `setActive()` - Sets active session

### 3. RegisterForm (`components/auth/register-form.tsx`)
- **Purpose:** Custom registration form with email verification
- **Features:**
  - Email/password registration
  - Google OAuth button
  - Password strength indicator (real-time)
  - Confirm password validation
  - Email verification code input
  - Two-step process: register → verify email
- **Clerk Hooks Used:**
  - `useSignUp()` - Handles registration
  - `prepareEmailAddressVerification()` - Sends verification email
  - `attemptEmailAddressVerification()` - Verifies code

### 4. Protected Dashboard (`app/dashboard/page.tsx`)
- **Purpose:** Example protected route
- **Features:**
  - Only accessible when authenticated
  - Shows user info with `currentUser()`
  - UserButton for account management
  - Resume upload placeholder
- **Protection:** Handled by middleware.ts

## Authentication Flows

### Flow 1: Modal Login (from Home Page)
```
1. User clicks "Sign In" button on home page
2. AuthDialog modal opens
3. User enters credentials or clicks Google
4. On success → Redirect to /dashboard
5. Modal closes automatically
```

### Flow 2: Dedicated Page Login
```
1. User visits /login or /register directly
2. Fills out form on dedicated page
3. On success → Redirect to /dashboard
```

### Flow 3: Protected Route Access
```
1. Unauthenticated user tries to visit /dashboard
2. Middleware intercepts request
3. User redirected to /login
4. After login → Redirect back to /dashboard
```

### Flow 4: Email Registration with Verification
```
1. User submits registration form
2. Clerk sends verification email
3. Form shows verification code input
4. User enters 6-digit code
5. On success → Create session and redirect to /dashboard
```

### Flow 5: Google OAuth
```
1. User clicks "Continue with Google"
2. Redirect to Google consent screen
3. User approves access
4. Redirect to /sso-callback
5. Clerk processes OAuth callback
6. Redirect to /dashboard
```

## Middleware Configuration

**File:** `middleware.ts`

```typescript
const isPublicRoute = createRouteMatcher([
  '/',                    // Home page (public)
  '/login(.*)',          // Login page and sub-routes
  '/register(.*)',       // Register page and sub-routes
  '/sso-callback(.*)',   // OAuth callback
  '/api/webhooks(.*)',   // Webhook endpoints (if added)
])

// All other routes require authentication
```

## Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

## Clerk Hooks Reference

### Client Components

```typescript
import { useUser, useSignIn, useSignUp, UserButton } from '@clerk/nextjs'

// Get current user (client-side)
const { isSignedIn, user, isLoaded } = useUser()

// Login functionality
const { signIn, setActive } = useSignIn()

// Registration functionality
const { signUp, setActive } = useSignUp()

// User profile button
<UserButton />
```

### Server Components

```typescript
import { currentUser, auth } from '@clerk/nextjs/server'

// Get current user (server-side)
const user = await currentUser()

// Get auth state
const { userId } = await auth()
```

## Validation Schemas

**File:** `lib/validations/auth.schema.ts`

### Login Schema
```typescript
loginSchema = {
  email: string (valid email),
  password: string (min 8 chars)
}
```

### Register Schema
```typescript
registerSchema = {
  email: string (valid email),
  password: string (min 8, uppercase, lowercase, number),
  confirmPassword: string (must match password)
}
```

## Styling

All components use:
- **Tailwind CSS** for styling
- **shadcn/ui** design system (New York variant)
- **Consistent color scheme:**
  - Primary: Blue-600
  - Background gradient: blue-50 to purple-50
  - Errors: Red-600
  - Success: Green-600

## User Experience Features

✅ **Real-time validation** - Form errors appear as user types
✅ **Password strength indicator** - Shows requirements with checkmarks
✅ **Loading states** - Buttons show spinner during auth
✅ **Error messages** - Clear, user-friendly error display
✅ **Tab switching** - Easy toggle between login/register in modal
✅ **Deep linking** - Can link directly to /login or /register
✅ **Auto-redirect** - After login, goes to intended destination
✅ **Responsive design** - Works on all screen sizes

## Customization Tips

### Change Password Requirements
Edit `lib/validations/auth.schema.ts`:
```typescript
password: z.string()
  .min(10)  // Change minimum length
  .regex(/your-regex/)  // Add custom validation
```

### Change Redirect After Login
Edit `.env.local`:
```env
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/your-route
```

### Add More OAuth Providers
1. Enable provider in Clerk dashboard
2. Update forms to add provider button:
   ```typescript
   signIn.authenticateWithRedirect({
     strategy: 'oauth_github',  // or oauth_facebook, etc.
     redirectUrl: '/sso-callback',
     redirectUrlComplete: '/dashboard',
   })
   ```

### Customize Modal Appearance
Edit `components/auth/auth-dialog.tsx`:
- Change `sm:max-w-[480px]` for width
- Modify DialogTitle, DialogDescription text
- Update tab labels

## Testing Checklist

- [ ] Sign up with email (should receive verification email)
- [ ] Verify email with code
- [ ] Sign in with email/password
- [ ] Sign in with Google OAuth
- [ ] Sign out (via UserButton)
- [ ] Try accessing /dashboard without auth (should redirect)
- [ ] Password strength indicator shows correct state
- [ ] Form validation shows errors
- [ ] Modal opens/closes correctly
- [ ] Tab switching works in modal
- [ ] Links to /login and /register work
- [ ] Mobile responsive design works

## Common Issues & Solutions

### Issue: "Invalid publishable key"
**Solution:** Check `.env.local` has correct Clerk keys and restart dev server

### Issue: Google OAuth redirects to wrong URL
**Solution:** Verify allowed redirect URLs in Clerk dashboard include `/sso-callback`

### Issue: Email verification not working
**Solution:** Check Clerk dashboard email settings are configured correctly

### Issue: Session not persisting
**Solution:** Ensure `ClerkProvider` wraps entire app in `layout.tsx`

## Security Best Practices

✅ **Environment variables** - Never expose CLERK_SECRET_KEY client-side
✅ **HTTPS in production** - Always use HTTPS for OAuth
✅ **CSRF protection** - Clerk handles this automatically
✅ **Rate limiting** - Clerk provides built-in rate limiting
✅ **Session management** - Clerk handles token refresh automatically
✅ **Password hashing** - Clerk handles securely server-side

## Next Steps

To extend the authentication system:

1. **Add profile page** - Create `/profile` route with user settings
2. **Add password reset** - Implement forgot password flow
3. **Add 2FA** - Enable two-factor authentication in Clerk
4. **Add webhooks** - Listen to Clerk events (user.created, etc.)
5. **Add role-based access** - Use Clerk's organization/role features
6. **Add social links** - Connect multiple OAuth providers per user
