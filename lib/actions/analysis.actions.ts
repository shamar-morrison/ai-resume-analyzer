'use server';

import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import {
  IAnalysis,
  CreateAnalysisParams,
  getStatusFromScore,
  ANALYSES_COLLECTION,
} from '@/lib/models/analysis.model';

/**
 * Get all analyses for a specific user
 */
export async function getAnalysisByUserId(userId: string): Promise<IAnalysis[]> {
  try {
    const db = await getDatabase();
    const analysesCollection = db.collection<IAnalysis>(ANALYSES_COLLECTION);

    const analyses = await analysesCollection
      .find({ userId })
      .sort({ createdAt: -1 }) // Most recent first
      .toArray();

    return analyses;
  } catch (error) {
    console.error('Error fetching analyses:', error);
    return [];
  }
}

/**
 * Get a single analysis by ID
 */
export async function getAnalysisById(analysisId: string): Promise<IAnalysis | null> {
  try {
    const db = await getDatabase();
    const analysesCollection = db.collection<IAnalysis>(ANALYSES_COLLECTION);

    const analysis = await analysesCollection.findOne({
      _id: new ObjectId(analysisId),
    });

    return analysis || null;
  } catch (error) {
    console.error('Error fetching analysis:', error);
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
    console.error('Error creating analysis:', error);
    return null;
  }
}

/**
 * Delete an analysis
 */
export async function deleteAnalysis(analysisId: string): Promise<boolean> {
  try {
    const db = await getDatabase();
    const analysesCollection = db.collection<IAnalysis>(ANALYSES_COLLECTION);

    const result = await analysesCollection.deleteOne({
      _id: new ObjectId(analysisId),
    });

    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting analysis:', error);
    return false;
  }
}
