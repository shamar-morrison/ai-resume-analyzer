import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { getAnalysisById } from '@/lib/actions/analysis.actions'
import { AnalysisDetails } from '@/components/analysis-details'

interface AnalysisPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function AnalysisPage({ params }: AnalysisPageProps) {
  const user = await currentUser()
  if (!user) {
    redirect('/login')
  }

  const { id } = await params

  const analysis = await getAnalysisById(id)

  if (!analysis) {
    redirect('/dashboard')
  }

  // Verify user owns this analysis
  if (analysis.userId !== user.id) {
    redirect('/dashboard')
  }

  return <AnalysisDetails analysis={analysis} />
}
