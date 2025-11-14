import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { getAnalysisById } from '@/lib/actions/analysis.actions';
import { AnalysisDetails } from '@/components/analysis-details';

interface AnalysisPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AnalysisPage({ params }: AnalysisPageProps) {
  // Check authentication
  const user = await currentUser();
  if (!user) {
    redirect('/login');
  }

  // Get analysis ID from params
  const { id } = await params;

  // Fetch analysis data
  const analysis = await getAnalysisById(id);

  // Handle not found
  if (!analysis) {
    redirect('/dashboard');
  }

  // Verify user owns this analysis
  if (analysis.userId !== user.id) {
    redirect('/dashboard');
  }

  return <AnalysisDetails analysis={analysis} />;
}
