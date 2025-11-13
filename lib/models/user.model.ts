import { ObjectId } from 'mongodb';

/**
 * User interface representing a user document in MongoDB
 */
export interface IUser {
  _id?: ObjectId;
  clerkId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User creation parameters (from Clerk webhook)
 */
export interface CreateUserParams {
  clerkId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
}

/**
 * User update parameters (from Clerk webhook)
 */
export interface UpdateUserParams {
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
  email?: string;
}

/**
 * MongoDB collection name for users
 */
export const USERS_COLLECTION = 'users';
