# AI Resume Analyzer

An intelligent resume analysis platform powered by Google's Gemini 2.0 Flash AI. Upload your resume and receive detailed, actionable feedback to improve your job applications.

## Features

- **AI-Powered Analysis** - Leverages Google Gemini 2.0 Flash for comprehensive resume evaluation
- **6-Category Scoring System** - Get scored on:
  - Organization & Structure
  - Content Quality
  - Formatting & Design
  - Keywords & ATS Optimization
  - Achievements & Impact
  - Grammar & Language
- **Detailed Feedback** - Receive specific strengths, improvements, and actionable tips
- **User Authentication** - Secure sign-up with email/password or Google OAuth via Clerk
- **Analysis History** - View and manage all your past resume analyses
- **File Support** - Upload PDF or DOCX files (up to 5MB)
- **Responsive Design** - Beautiful, mobile-friendly interface built with Tailwind CSS
- **Serverless-Optimized** - Deployed on Vercel with optimized file processing

## Tech Stack

**Frontend**

- [Next.js 16](https://nextjs.org/) - React framework with App Router
- [React 19](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS 4](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) - Form validation

**Backend**

- [Clerk](https://clerk.com/) - Authentication & user management
- [MongoDB](https://www.mongodb.com/) - Database
- [Google Gemini AI](https://ai.google.dev/) - AI-powered analysis
- [unpdf](https://github.com/unjs/unpdf) - PDF text extraction (serverless-optimized)
- [Mammoth](https://github.com/mwilliamson/mammoth.js) - DOCX text extraction

## Prerequisites

Before you begin, ensure you have:

- Node.js 18 or higher installed
- npm, yarn, pnpm, or bun package manager
- A [Clerk](https://dashboard.clerk.com) account
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- A [Google AI Studio](https://aistudio.google.com/apikey) API key

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd ai-resume-analyzer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Clerk Webhook
CLERK_WEBHOOK_SECRET=whsec_...

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Configure Clerk

1. Create a new application in [Clerk Dashboard](https://dashboard.clerk.com)
2. Enable **Email** and **Google** authentication providers
3. Copy your API keys to `.env.local`
4. Set up a webhook endpoint:
   - Endpoint URL: `https://your-domain.com/api/webhooks/clerk`
   - Subscribe to: `user.created`, `user.updated`, `user.deleted`
   - Copy the webhook secret to `.env.local`

### 5. Set up MongoDB

1. Create a free cluster in [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user with read/write permissions
3. Whitelist your IP address (or use `0.0.0.0/0` for development)
4. Copy the connection string to `.env.local`

### 6. Get Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Create a new API key
3. Copy it to `.env.local`

### 7. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
ai-resume-analyzer/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   ├── analysis/[id]/            # Dynamic analysis detail page
│   ├── api/                      # API routes
│   │   ├── analyze/              # Resume analysis endpoint
│   │   └── webhooks/clerk/       # Clerk webhook handler
│   ├── dashboard/                # User dashboard
│   └── page.tsx                  # Landing page
├── components/
│   ├── ui/                       # Reusable UI components
│   ├── auth/                     # Authentication forms
│   ├── dashboard/                # Dashboard components
│   └── landing/                  # Landing page sections
├── lib/
│   ├── actions/                  # Server actions
│   ├── models/                   # TypeScript interfaces
│   ├── services/                 # Business logic
│   │   ├── gemini.service.ts     # AI analysis
│   │   └── text-extraction.service.ts
│   ├── validations/              # Zod schemas
│   └── mongodb.ts                # Database connection
└── public/                       # Static assets
```

## How It Works

1. **Upload** - User uploads a PDF or DOCX resume
2. **Extract** - Text is extracted using `unpdf` (PDF) or `mammoth` (DOCX)
3. **Analyze** - Extracted text is sent to Google Gemini 2.0 Flash AI with a structured prompt
4. **Score** - AI returns scores across 6 categories plus overall assessment
5. **Store** - Analysis is saved to MongoDB with user association
6. **Display** - User views detailed results with strengths, improvements, and tips

## Deployment

This project is optimized for deployment on [Vercel](https://vercel.com):

1. Push your code to a Git repository
2. Import the project in Vercel
3. Add all environment variables from `.env.local`
4. Update Clerk webhook URL to your production domain
5. Deploy

**Important:** The project uses `unpdf` instead of `pdfjs-dist` for serverless compatibility. This ensures PDF processing works correctly in Vercel's serverless environment.

## Documentation

For more detailed information, see:

- [SETUP.md](SETUP.md) - Comprehensive setup guide
- [QUICK_START.md](QUICK_START.md) - Quick start guide
- [AUTH_REFERENCE.md](AUTH_REFERENCE.md) - Authentication technical reference

---

Built with Next.js, Gemini AI, and modern web technologies.
