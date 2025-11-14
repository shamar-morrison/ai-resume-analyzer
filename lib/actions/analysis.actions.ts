'use server';

import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import {
  IAnalysis,
  SerializedAnalysis,
  CreateAnalysisParams,
  getStatusFromScore,
  ANALYSES_COLLECTION,
} from '@/lib/models/analysis.model';

/**
 * Helper to serialize MongoDB document to plain object for Client Components
 */
function serializeAnalysis(analysis: IAnalysis): SerializedAnalysis {
  return {
    ...analysis,
    _id: analysis._id?.toString(),
    createdAt: analysis.createdAt.toISOString(),
    updatedAt: analysis.updatedAt.toISOString(),
  };
}

/**
 * Get all analyses for a specific user (serialized for Client Components)
 */
export async function getAnalysisByUserId(userId: string): Promise<SerializedAnalysis[]> {
  try {
    const db = await getDatabase();
    const analysesCollection = db.collection<IAnalysis>(ANALYSES_COLLECTION);

    const analyses = await analysesCollection
      .find({ userId })
      .sort({ createdAt: -1 }) // Most recent first
      .toArray();

    return analyses.map(serializeAnalysis);
  } catch (error) {
    return [];
  }
}

/**
 * Get a single analysis by ID (serialized for Client Components)
 */
export async function getAnalysisById(analysisId: string): Promise<SerializedAnalysis | null> {
  try {
    const db = await getDatabase();
    const analysesCollection = db.collection<IAnalysis>(ANALYSES_COLLECTION);

    const analysis = await analysesCollection.findOne({
      _id: new ObjectId(analysisId),
    });

    return analysis ? serializeAnalysis(analysis) : null;
  } catch (error) {
    return null;
  }
}

/**
 * Create a new analysis
 */
export async function createAnalysis(params: CreateAnalysisParams): Promise<IAnalysis | null> {
  try {
    const db = await getDatabase();
    const analysesCollection = db.collection<IAnalysis>(ANALYSES_COLLECTION);

    const status = getStatusFromScore(params.score);
    const now = new Date();

    const newAnalysis: Omit<IAnalysis, '_id'> = {
      ...params,
      status,
      createdAt: now,
      updatedAt: now,
    };

    const result = await analysesCollection.insertOne(newAnalysis as IAnalysis);

    return {
      ...newAnalysis,
      _id: result.insertedId,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Delete an analysis (with ownership verification)
 */
export async function deleteAnalysis(analysisId: string, userId: string): Promise<boolean> {
  try {
    const db = await getDatabase();
    const analysesCollection = db.collection<IAnalysis>(ANALYSES_COLLECTION);

    // Verify the user owns this analysis before deleting
    const analysis = await analysesCollection.findOne({
      _id: new ObjectId(analysisId),
      userId,
    });

    if (!analysis) {
      return false;
    }

    // Delete the analysis
    const result = await analysesCollection.deleteOne({
      _id: new ObjectId(analysisId),
      userId,
    });

    return result.deletedCount > 0;
  } catch (error) {
    return false;
  }
}
