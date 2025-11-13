import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { FileText, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function DashboardPage() {
  const user = await currentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            <Link href="/" className="text-xl font-semibold">
              ResumeAI
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user.emailAddresses[0]?.emailAddress}
            </span>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'h-10 w-10',
                },
              }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user.firstName || 'there'}!
            </h1>
            <p className="mt-2 text-gray-600">
              Upload your resume to get instant AI-powered feedback and analysis
            </p>
          </div>

          {/* Resume Upload Area */}
          <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white p-12 text-center hover:border-gray-400 hover:bg-gray-50">
            <div className="mx-auto flex max-w-md flex-col items-center gap-4">
              <div className="rounded-full bg-blue-100 p-4">
                <Upload className="h-12 w-12 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Upload your resume</h2>
                <p className="mt-2 text-sm text-gray-600">
                  Drag and drop your resume here or click to browse
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Supports PDF and DOCX (max 5MB)
                </p>
              </div>
              <Button className="mt-4">
                <Upload className="mr-2 h-4 w-4" />
                Choose File
              </Button>
            </div>
          </div>

          {/* Recent Analyses (Placeholder) */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold">Recent Analyses</h2>
            <div className="mt-4 rounded-lg border bg-white p-8 text-center">
              <p className="text-gray-500">
                No resumes analyzed yet. Upload your first resume to get
                started!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
