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
    const db = await getDatabase();

    const usersCollection = db.collection<IUser>(USERS_COLLECTION);

    const now = new Date();
    const newUser: Omit<IUser, '_id'> = {
      ...params,
      createdAt: now,
      updatedAt: now,
    };

    const result = await usersCollection.insertOne(newUser as IUser);

    return {
      ...newUser,
      _id: result.insertedId,
    };
  } catch (error) {
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
    throw new Error('Failed to fetch user');
  }
}
