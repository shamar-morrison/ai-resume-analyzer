import Link from 'next/link'
import { FileText } from 'lucide-react'
import { RegisterForm } from '@/components/auth/register-form'

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-2xl font-semibold"
          >
            <FileText className="h-8 w-8 text-blue-600" />
            <span>ResumeAI</span>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-xl border bg-white p-8 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Create an account</h1>
            <p className="mt-2 text-sm text-gray-600">
              Get started with AI-powered resume analysis
            </p>
          </div>

          <RegisterForm />

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="mt-4 text-center text-sm text-gray-500">
          <Link href="/" className="hover:underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}
