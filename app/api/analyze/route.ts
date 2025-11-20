import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { extractText, validateExtractedText } from '@/lib/services/text-extraction.service';
import { analyzeResume, convertScoreTo100 } from '@/lib/services/gemini.service';
import { createAnalysis } from '@/lib/actions/analysis.actions';

// Configure runtime for Vercel serverless functions
export const maxDuration = 30; // Maximum execution time in seconds (Hobby: 10s, Pro: 60s)
export const dynamic = 'force-dynamic'; // Ensure route is not statically generated

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse form data
    const formData = await request.formData();
    const jobDescription = formData.get('jobDescription') as string | null;
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.docx')) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF and DOCX files are supported.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit. Please upload a smaller file.' },
        { status: 400 }
      );
    }

    // Extract text from file
    let extractedText: string;
    try {
      extractedText = await extractText(file);
      validateExtractedText(extractedText);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || 'Failed to extract text from file' },
        { status: 400 }
      );
    }

    // Analyze resume with Gemini
    let analysisResult;
    try {
      analysisResult = await analyzeResume(extractedText, jobDescription || undefined);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || 'Failed to analyze resume. Please try again.' },
        { status: 500 }
      );
    }

    // Calculate processing time
    const processingTime = (Date.now() - startTime) / 1000; // Convert to seconds

    // Convert overall score to 0-100 scale
    const score = convertScoreTo100(analysisResult.overallScore);

    // Create analysis record in database
    const analysis = await createAnalysis({
      userId,
      resumeName: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
      fileName: file.name,
      score,
      overallScore: analysisResult.overallScore,
      categoryScores: analysisResult.categoryScores,
      strengths: analysisResult.strengths,
      improvements: analysisResult.improvements,
      compatibility: analysisResult.compatibility,
      fileSize: file.size,
      processingTime,
    });

    if (!analysis) {
      return NextResponse.json(
        { error: 'Failed to save analysis results. Please try again.' },
        { status: 500 }
      );
    }

    // Return success with analysis ID
    return NextResponse.json({
      success: true,
      analysisId: analysis._id?.toString(),
      score,
      overallScore: analysisResult.overallScore,
      compatibility: analysisResult.compatibility,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
