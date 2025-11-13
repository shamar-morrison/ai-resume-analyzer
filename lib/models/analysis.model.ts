import { ObjectId } from 'mongodb';

export type AnalysisStatus = "Excellent" | "Good" | "Needs Improvement" | "Poor";

/**
 * Analysis interface representing a resume analysis document in MongoDB
 */
export interface IAnalysis {
  _id?: ObjectId;
  userId: string; // Clerk user ID
  resumeName: string;
  fileName: string;
  fileUrl?: string;
  score: number;
  status: AnalysisStatus;
  analysisData?: {
    strengths?: string[];
    weaknesses?: string[];
    suggestions?: string[];
    detailedFeedback?: string;
  };
  createdAt: Date;
  updatedAt: Date;
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
  analysisData?: {
    strengths?: string[];
    weaknesses?: string[];
    suggestions?: string[];
    detailedFeedback?: string;
  };
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
 * MongoDB collection name for analyses
 */
export const ANALYSES_COLLECTION = 'analyses';
