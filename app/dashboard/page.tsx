'use client'

import { useUser, UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getAnalysisByUserId } from '@/lib/actions/analysis.actions'
import { AnalysisCard } from '@/components/dashboard/analysis-card'
import { EmptyState } from '@/components/dashboard/empty-state'
import { useEffect, useState } from 'react'
import { IAnalysis } from '@/lib/models/analysis.model'

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [analyses, setAnalyses] = useState<IAnalysis[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
            <Link href="/">
              <Button size="lg" className="gap-2">
                <FileText className="h-5 w-5" />
                Analyze New Resume
              </Button>
            </Link>
          </div>

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
                    key={analysis._id?.toString()}
                    analysis={analysis}
                    onClick={() => {
                      router.push(`/analysis/${analysis._id?.toString()}`)
                    }}
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
