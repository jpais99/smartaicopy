// src/lib/db/users.ts

import { MongoClient, ObjectId } from 'mongodb';
import clientPromise from './mongodb';
import bcrypt from 'bcrypt';
import { logError } from '@/lib/utils/error-logger';

export interface User {
  _id?: ObjectId;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthError {
  message: string;
  code: 'INVALID_CREDENTIALS' | 'USER_EXISTS' | 'INVALID_INPUT' | 'SERVER_ERROR';
}

export async function createUser(email: string, password: string): Promise<{ success: boolean; error?: AuthError }> {
  let db;
  try {
    // Get connection with timeout
    const connectedClient = await Promise.race([
      clientPromise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database connection timeout')), 5000)
      )
    ]) as MongoClient;

    db = connectedClient.db('smartaicopy');
    const users = db.collection<User>('users');

    // Run operations in parallel where possible
    const [existingUser, passwordHash] = await Promise.all([
      users.findOne({ email }),
      bcrypt.hash(password, 12)  // Reduced from 12 to 10 rounds for speed
    ]);

    if (existingUser) {
      return {
        success: false,
        error: {
          message: 'A user with this email already exists',
          code: 'USER_EXISTS'
        }
      };
    }

    const now = new Date();
    await users.insertOne({
      email,
      passwordHash,
      createdAt: now,
      updatedAt: now
    });

    logError('User created successfully', 'info', { email });
    return { success: true };

  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error occurred');
    logError(error, 'error', { 
      context: 'User creation',
      email 
    });
    return {
      success: false,
      error: {
        message: 'An error occurred while creating the user',
        code: 'SERVER_ERROR'
      }
    };
  }
}

export async function verifyUser(email: string, password: string): Promise<{ success: boolean; error?: AuthError }> {
  let db;
  try {
    // Get connection with timeout
    const connectedClient = await Promise.race([
      clientPromise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database connection timeout')), 5000)
      )
    ]) as MongoClient;

    db = connectedClient.db('smartaicopy');
    const users = db.collection<User>('users');

    const user = await users.findOne({ email });
    if (!user) {
      return {
        success: false,
        error: {
          message: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS'
        }
      };
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return {
        success: false,
        error: {
          message: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS'
        }
      };
    }

    logError('User verified successfully', 'info', { email });
    return { success: true };

  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error occurred');
    logError(error, 'error', { 
      context: 'User verification',
      email 
    });
    return {
      success: false,
      error: {
        message: 'An error occurred while verifying credentials',
        code: 'SERVER_ERROR'
      }
    };
  }
}