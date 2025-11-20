import { ObjectId } from 'mongodb';

export type AnalysisStatus = "Excellent" | "Good" | "Needs Improvement" | "Poor";

/**
 * Category score with improvement tips
 */
export interface CategoryScore {
  score: number; // 1-10 scale
  tips: string[]; // 2-3 specific improvement tips
}

/**
 * Detailed category scores for resume analysis
 */
export interface CategoryScores {
  organization: CategoryScore;
  content: CategoryScore;
  formatting: CategoryScore;
  keywords: CategoryScore;
  achievements: CategoryScore;
  grammar: CategoryScore;
}

/**
 * Analysis interface representing a resume analysis document in MongoDB
 */
export interface IAnalysis {
  _id?: ObjectId;
  userId: string; // Clerk user ID
  resumeName: string;
  fileName: string;
  fileUrl?: string;
  score: number; // Overall score (0-100, converted from 1-10 average)
  overallScore: number; // 1-10 scale (average of category scores)
  status: AnalysisStatus;
  categoryScores: CategoryScores;
  strengths: string[]; // 3-5 key strengths
  improvements: string[]; // 3-5 priority improvements
  fileSize: number; // File size in bytes
  processingTime?: number; // Analysis time in seconds
  analysisData?: {
    strengths?: string[];
    weaknesses?: string[];
    suggestions?: string[];
    detailedFeedback?: string;
  };
  compatibility?: CompatibilityScore;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Serialized analysis for passing to Client Components
 * Converts ObjectId and Dates to strings for Next.js serialization
 */
export interface SerializedAnalysis extends Omit<IAnalysis, '_id' | 'createdAt' | 'updatedAt'> {
  _id?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Analysis creation parameters
 */
export interface CreateAnalysisParams {
  userId: string;
  resumeName: string;
  fileName: string;
  fileUrl?: string;
  score: number;
  overallScore: number;
  categoryScores: CategoryScores;
  strengths: string[];
  improvements: string[];
  fileSize: number;
  processingTime?: number;
  analysisData?: {
    strengths?: string[];
    weaknesses?: string[];
    suggestions?: string[];
    detailedFeedback?: string;
  };
  compatibility?: CompatibilityScore;
}

/**
 * Helper function to determine status based on score
 */
export function getStatusFromScore(score: number): AnalysisStatus {
  if (score >= 80) return "Excellent";
  if (score >= 65) return "Good";
  if (score >= 50) return "Needs Improvement";
  return "Poor";
}

/**
 * Gemini API response type
 */
export interface GeminiAnalysisResponse {
  categoryScores: {
    organization: { score: number; tips: string[] };
    content: { score: number; tips: string[] };
    formatting: { score: number; tips: string[] };
    keywords: { score: number; tips: string[] };
    achievements: { score: number; tips: string[] };
    grammar: { score: number; tips: string[] };
  };
  overallScore: number;
  strengths: string[];
  improvements: string[];
  compatibility?: CompatibilityScore;
}

/**
 * Compatibility score with job description
 */
export interface CompatibilityScore {
  score: number; // 1-10 scale
  matchingKeywords: string[];
  missingKeywords: string[];
  tips: string[];
}

/**
 * MongoDB collection name for analyses
 */
export const ANALYSES_COLLECTION = 'analyses';
