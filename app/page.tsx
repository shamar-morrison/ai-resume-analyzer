'use client'

import { useCallback, useState, useEffect } from 'react'
import { useUser, UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AuthDialog } from '@/components/auth/auth-dialog'
import { AnalysisProgress, AnalysisStep } from '@/components/analysis-progress'
import Link from 'next/link'
import { HowItWorksSection } from '@/components/landing/how-it-works-section'
import { WhatWeAnalyzeSection } from '@/components/landing/what-we-analyze-section'
import { CTASection } from '@/components/landing/cta-section'

export default function Home() {
  const { isSignedIn } = useUser()
  const router = useRouter()
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const [authDialogTab, setAuthDialogTab] = useState<'login' | 'register'>(
    'login'
  )
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentStep, setCurrentStep] = useState<AnalysisStep>('uploading')
  const [progress, setProgress] = useState(0)
  const [uploadingFile, setUploadingFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Handle file upload and analysis
  const handleFileUpload = useCallback(async (file: File) => {
    setIsAnalyzing(true)
    setUploadingFile(file)
    setError(null)

    try {
      // Step 1: Uploading (0-25%)
      setCurrentStep('uploading')
      setProgress(10)

      const formData = new FormData()
      formData.append('file', file)

      setProgress(25)

      // Step 2: Extracting text (25-50%)
      setCurrentStep('extracting')
      setProgress(35)

      // Step 3: Analyzing (50-90%)
      setCurrentStep('analyzing')
      setProgress(50)

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })

      setProgress(85)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze resume')
      }

      const data = await response.json()

      // Step 4: Saving (90-100%)
      setCurrentStep('saving')
      setProgress(95)

      await new Promise(resolve => setTimeout(resolve, 500)) // Brief pause for UX

      setProgress(100)

      // Redirect to analysis details page
      if (data.analysisId) {
        router.push(`/analysis/${data.analysisId}`)
      } else {
        throw new Error('No analysis ID returned')
      }
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Failed to analyze resume. Please try again.')
      setIsAnalyzing(false)
      setUploadingFile(null)
      setProgress(0)

      // Show error for 3 seconds then reset
      setTimeout(() => {
        setError(null)
      }, 5000)
    }
  }, [router])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!isSignedIn) {
        // Store the file for later upload after authentication
        if (acceptedFiles.length > 0) {
          setPendingFile(acceptedFiles[0])
        }
        // Open auth dialog with Sign Up tab
        setAuthDialogTab('register')
        setAuthDialogOpen(true)
        return
      }

      // Handle file upload for authenticated users
      if (acceptedFiles.length > 0) {
        handleFileUpload(acceptedFiles[0])
      }
    },
    [isSignedIn, handleFileUpload]
  )

  // Auto-upload pending file after successful authentication
  useEffect(() => {
    if (isSignedIn && pendingFile) {
      handleFileUpload(pendingFile)
      setPendingFile(null)
    }
  }, [isSignedIn, pendingFile, handleFileUpload])

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        'application/pdf': ['.pdf'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          ['.docx'],
      },
      maxSize: 5 * 1024 * 1024, // 5MB
      multiple: false,
    })

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Analysis Progress Overlay */}
      {isAnalyzing && uploadingFile && (
        <AnalysisProgress
          fileName={uploadingFile.name}
          fileSize={uploadingFile.size}
          currentStep={currentStep}
          progress={progress}
        />
      )}

      {/* Auth Dialog */}
      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        defaultTab={authDialogTab}
      />

      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            <Link href="/" className="text-xl font-semibold">
              ResumeAI
            </Link>
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
            <Button
              onClick={() => {
                setAuthDialogTab('login')
                setAuthDialogOpen(true)
              }}
            >
              Sign In
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto flex min-h-screen items-center justify-center px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Hero Section */}
          <h1 className="mb-4 bg-linear-to-r from-blue-400 via-blue-500 to-purple-500 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl lg:text-[65px]">
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
                  ? 'border-gray-300 bg-transparent hover:border-blue-500'
                  : ''
              }
            `}
          >
            <input {...getInputProps()} />

            <div className="flex flex-col items-center gap-4">
              {/* Upload Icon */}
              <div
                className={`
                rounded-full bg-transparent
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
                      : !isSignedIn
                        ? 'Sign in to upload your resume'
                        : 'Drag and drop your resume here'}
                </p>
                <p className="text-sm text-gray-500">
                  {!isSignedIn ? '' : 'or click to browse files'}
                </p>
                <p className="text-xs text-gray-400">
                  Supports PDF and DOCX (max 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 rounded-lg bg-red-50 border border-red-200 p-4 text-center">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}
        </div>
      </main>

      {/* Landing Page Sections */}
      <HowItWorksSection />
      <WhatWeAnalyzeSection />
      <CTASection />
    </div>
  )
}
