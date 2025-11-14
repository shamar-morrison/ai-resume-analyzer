import { GoogleGenAI } from '@google/genai'
import { GeminiAnalysisResponse } from '@/lib/models/analysis.model'

// Initialize Gemini client
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' })

/**
 * Analyze resume text using Gemini Flash 2.5
 */
export async function analyzeResume(
  text: string
): Promise<GeminiAnalysisResponse> {
  try {
    const prompt = `Analyze the following resume and provide a detailed evaluation with scores (1-10) for each category:

1. Organization & Structure
2. Content Quality
3. Formatting & Design
4. Keywords & ATS Optimization
5. Achievements & Impact
6. Grammar & Language

For each category, provide:
- A score (1-10)
- 2-3 specific improvement tips

Also provide:
- An overall score (average of all categories)
- 3-5 key strengths
- 3-5 priority improvements

Format your response as JSON with this exact structure:
{
  "categoryScores": {
    "organization": { "score": number, "tips": ["tip1", "tip2", "tip3"] },
    "content": { "score": number, "tips": ["tip1", "tip2", "tip3"] },
    "formatting": { "score": number, "tips": ["tip1", "tip2", "tip3"] },
    "keywords": { "score": number, "tips": ["tip1", "tip2", "tip3"] },
    "achievements": { "score": number, "tips": ["tip1", "tip2", "tip3"] },
    "grammar": { "score": number, "tips": ["tip1", "tip2", "tip3"] }
  },
  "overallScore": number,
  "strengths": ["strength1", "strength2", "strength3", "strength4", "strength5"],
  "improvements": ["improvement1", "improvement2", "improvement3", "improvement4", "improvement5"]
}

Resume text:
${text}`

    // Generate content with retry logic
    const result = await generateWithRetry(prompt)

    // Validate response before accessing text
    if (!result || !result.text) {
      throw new Error('No response received from AI model')
    }

    const responseText = result.text

    // Parse JSON response
    const analysisData = parseGeminiResponse(responseText)

    // Validate response structure
    validateGeminiResponse(analysisData)

    return analysisData
  } catch (error) {
    throw new Error('Failed to analyze resume. Please try again.')
  }
}

/**
 * Generate content with exponential backoff retry
 */
async function generateWithRetry(
  prompt: string,
  maxRetries = 3,
  initialDelay = 1000
): Promise<any> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await genAI.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
        config: {
          temperature: 0.7,
          maxOutputTokens: 2048,
          topP: 0.9,
          topK: 40,
        },
      })

      return response
    } catch (error: any) {
      lastError = error

      // Check if it's a rate limit error
      if (error?.status === 429 || error?.message?.includes('rate limit')) {
        const delay = initialDelay * Math.pow(2, attempt)
        await new Promise((resolve) => setTimeout(resolve, delay))
        continue
      }

      // For non-rate-limit errors, throw immediately with better context
      throw error
    }
  }

  throw lastError || new Error('Failed after maximum retries')
}

/**
 * Parse Gemini response text to JSON
 */
function parseGeminiResponse(responseText: string): GeminiAnalysisResponse {
  try {
    // Check if response is HTML error page
    if (
      responseText.startsWith('<!DOCTYPE') ||
      responseText.startsWith('<html') ||
      responseText.startsWith('<?xml')
    ) {
      throw new Error(
        'API returned an error page instead of JSON. Please check your API key and model availability.'
      )
    }

    // Remove markdown code blocks if present
    let jsonText = responseText.trim()
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '')
    }

    // Validate it looks like JSON before parsing
    if (!jsonText.startsWith('{') && !jsonText.startsWith('[')) {
      throw new Error('Invalid response format: Expected JSON object or array.')
    }

    const parsed = JSON.parse(jsonText)
    return parsed as GeminiAnalysisResponse
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(
        'Failed to parse AI response. The model returned invalid JSON format.'
      )
    }

    throw error
  }
}

/**
 * Validate Gemini response structure
 */
function validateGeminiResponse(data: any): void {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid response structure: not an object')
  }

  if (!data.categoryScores || typeof data.categoryScores !== 'object') {
    throw new Error('Invalid response structure: missing categoryScores')
  }

  const requiredCategories = [
    'organization',
    'content',
    'formatting',
    'keywords',
    'achievements',
    'grammar',
  ]
  for (const category of requiredCategories) {
    const categoryData = data.categoryScores[category]
    if (!categoryData || typeof categoryData !== 'object') {
      throw new Error(
        `Invalid response structure: missing category ${category}`
      )
    }
    if (
      typeof categoryData.score !== 'number' ||
      categoryData.score < 1 ||
      categoryData.score > 10
    ) {
      throw new Error(
        `Invalid score for category ${category}: must be between 1 and 10`
      )
    }
    if (!Array.isArray(categoryData.tips) || categoryData.tips.length === 0) {
      throw new Error(
        `Invalid tips for category ${category}: must be a non-empty array`
      )
    }
  }

  if (
    typeof data.overallScore !== 'number' ||
    data.overallScore < 1 ||
    data.overallScore > 10
  ) {
    throw new Error('Invalid overall score: must be between 1 and 10')
  }

  if (!Array.isArray(data.strengths) || data.strengths.length === 0) {
    throw new Error('Invalid strengths: must be a non-empty array')
  }

  if (!Array.isArray(data.improvements) || data.improvements.length === 0) {
    throw new Error('Invalid improvements: must be a non-empty array')
  }
}

/**
 * Calculate 0-100 score from 1-10 scale
 */
export function convertScoreTo100(score: number): number {
  return Math.round((score / 10) * 100)
}
