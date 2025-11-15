'use client'

import { useUser, UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getAnalysisByUserId } from '@/lib/actions/analysis.actions'
import { AnalysisCard } from '@/components/dashboard/analysis-card'
import { EmptyState } from '@/components/dashboard/empty-state'
import { useEffect, useState, useRef, useCallback } from 'react'
import { SerializedAnalysis } from '@/lib/models/analysis.model'
import { AnalysisProgress, AnalysisStep } from '@/components/analysis-progress'

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [analyses, setAnalyses] = useState<SerializedAnalysis[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentStep, setCurrentStep] = useState<AnalysisStep>('uploading')
  const [progress, setProgress] = useState(0)
  const [uploadingFile, setUploadingFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle delete analysis
  const handleDelete = (analysisId: string) => {
    setAnalyses((prev) => prev.filter((a) => a._id !== analysisId))
  }

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
      setError(err.message || 'Failed to analyze resume. Please try again.')
      setIsAnalyzing(false)
      setUploadingFile(null)
      setProgress(0)

      // Show error for 5 seconds then reset
      setTimeout(() => {
        setError(null)
      }, 5000)
    }
  }, [router])

  // Handle file selection from input
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  // Trigger file input click
  const handleAnalyzeClick = () => {
    fileInputRef.current?.click()
  }

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/login')
    }
  }, [isLoaded, user, router])

  // Fetch user's analysis history
  useEffect(() => {
    async function fetchAnalyses() {
      if (!user) return

      setIsLoading(true)
      const data = await getAnalysisByUserId(user.id)
      setAnalyses(data)
      setIsLoading(false)
    }

    if (user) {
      fetchAnalyses()
    }
  }, [user])

  if (!isLoaded || !user) {
    return null
  }

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

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileSelect}
        className="hidden"
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
        <div className="">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
            <p className="mt-2 text-gray-600">
              View your resume analysis history and track your improvements
            </p>
          </div>

          {/* Analyze New Resume Button */}
          <div className="mb-12">
            <Button
              size="lg"
              className="gap-2"
              onClick={handleAnalyzeClick}
              disabled={isAnalyzing}
            >
              <FileText className="h-5 w-5" />
              {isAnalyzing ? 'Analyzing...' : 'Analyze New Resume'}
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-8 rounded-lg bg-red-50 border border-red-200 p-4">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          {/* Analysis History */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Analysis History
            </h2>
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading your analyses...</p>
              </div>
            ) : analyses.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {analyses.map((analysis) => (
                  <AnalysisCard
                    key={analysis._id}
                    analysis={analysis}
                    onClick={() => {
                      router.push(`/analysis/${analysis._id}`)
                    }}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
