'use server';

import { getDatabase } from '@/lib/mongodb';
import {
  CreateUserParams,
  UpdateUserParams,
  IUser,
  USERS_COLLECTION,
} from '@/lib/models/user.model';

/**
 * Create a new user in the database
 */
export async function createUser(params: CreateUserParams): Promise<IUser> {
  try {
    console.log('🔌 Connecting to MongoDB...');
    const db = await getDatabase();
    console.log('✅ Connected to database:', db.databaseName);

    const usersCollection = db.collection<IUser>(USERS_COLLECTION);
    console.log('📁 Using collection:', USERS_COLLECTION);

    const now = new Date();
    const newUser: Omit<IUser, '_id'> = {
      ...params,
      createdAt: now,
      updatedAt: now,
    };

    console.log('💾 Inserting user document...');
    const result = await usersCollection.insertOne(newUser as IUser);
    console.log('✅ User document inserted with ID:', result.insertedId);

    return {
      ...newUser,
      _id: result.insertedId,
    };
  } catch (error) {
    console.error('❌ Error creating user:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      params,
    });
    throw new Error(
      `Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Update an existing user in the database by Clerk ID
 */
export async function updateUser(
  clerkId: string,
  params: UpdateUserParams
): Promise<IUser | null> {
  try {
    const db = await getDatabase();
    const usersCollection = db.collection<IUser>(USERS_COLLECTION);

    const updateData = {
      ...params,
      updatedAt: new Date(),
    };

    const result = await usersCollection.findOneAndUpdate(
      { clerkId },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    return result || null;
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user');
  }
}

/**
 * Delete a user from the database by Clerk ID
 */
export async function deleteUser(clerkId: string): Promise<boolean> {
  try {
    const db = await getDatabase();
    const usersCollection = db.collection<IUser>(USERS_COLLECTION);

    const result = await usersCollection.deleteOne({ clerkId });

    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Failed to delete user');
  }
}

/**
 * Get a user by Clerk ID
 */
export async function getUserByClerkId(
  clerkId: string
): Promise<IUser | null> {
  try {
    const db = await getDatabase();
    const usersCollection = db.collection<IUser>(USERS_COLLECTION);

    const user = await usersCollection.findOne({ clerkId });

    return user || null;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Failed to fetch user');
  }
}
