'use client'

import { useCallback, useState } from 'react'
import { useUser, UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AuthDialog } from '@/components/auth/auth-dialog'

export default function Home() {
  const { isSignedIn } = useUser()
  const router = useRouter()
  const [authDialogOpen, setAuthDialogOpen] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!isSignedIn) {
        setAuthDialogOpen(true)
        return
      }
      // TODO: Handle file upload for authenticated users
      console.log('Files dropped:', acceptedFiles)
      router.push('/dashboard')
    },
    [isSignedIn, router]
  )

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
    disabled: !isSignedIn,
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Auth Dialog */}
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />

      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-semibold">ResumeAI</span>
          </div>
          {isSignedIn ? (
            <div className="flex items-center gap-4">
              <Button onClick={() => router.push('/dashboard')}>
                Dashboard
              </Button>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'h-10 w-10',
                  },
                }}
              />
            </div>
          ) : (
            <Button onClick={() => setAuthDialogOpen(true)}>Sign In</Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          {/* Hero Section */}
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-blue-600 md:text-5xl lg:text-6xl">
            Transform Your Resume with AI
          </h1>
          <p className="mb-12 text-lg text-gray-600 md:text-xl">
            Get instant, actionable feedback powered by AI to land your dream
            job
          </p>

          {/* File Upload Zone */}
          <div
            {...getRootProps()}
            className={`
              relative mx-auto max-w-2xl cursor-pointer rounded-xl border-2 border-dashed p-12 transition-all duration-200
              ${
                isDragActive && !isDragReject
                  ? 'border-blue-500 bg-blue-50'
                  : ''
              }
              ${isDragReject ? 'border-red-500 bg-red-50' : ''}
              ${
                !isDragActive && !isDragReject
                  ? 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
                  : ''
              }
            `}
          >
            <input {...getInputProps()} />

            <div className="flex flex-col items-center gap-4">
              {/* Upload Icon */}
              <div
                className={`
                rounded-full p-4
                ${isDragActive && !isDragReject ? 'bg-blue-100' : ''}
                ${isDragReject ? 'bg-red-100' : ''}
                ${!isDragActive && !isDragReject ? 'bg-gray-100' : ''}
              `}
              >
                <Upload
                  className={`
                  h-12 w-12
                  ${isDragActive && !isDragReject ? 'text-blue-600' : ''}
                  ${isDragReject ? 'text-red-600' : ''}
                  ${!isDragActive && !isDragReject ? 'text-gray-400' : ''}
                `}
                />
              </div>

              {/* Text */}
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-900">
                  {isDragReject
                    ? 'File type not supported'
                    : isDragActive
                      ? 'Drop your resume here'
                      : 'Drag and drop your resume here'}
                </p>
                <p className="text-sm text-gray-500">
                  or click to browse files
                </p>
                <p className="text-xs text-gray-400">
                  Supports PDF and DOCX (max 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Footer Text */}
          {!isSignedIn && (
            <p className="mt-8 text-sm text-gray-500">
              Sign in required to analyze resumes
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
