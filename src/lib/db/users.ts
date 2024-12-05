// src/lib/db/users.ts

import { MongoClient, ObjectId } from 'mongodb';
import clientPromise from './mongodb';
import bcrypt from 'bcrypt';

export interface User {
  _id?: ObjectId;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
  isTestAccount?: boolean;
}

export interface AuthError {
  message: string;
  code: 'INVALID_CREDENTIALS' | 'USER_EXISTS' | 'INVALID_INPUT' | 'SERVER_ERROR';
}

let client: MongoClient;

export async function createUser(
  email: string, 
  password: string,
  isTestAccount: boolean = false
): Promise<{ success: boolean; error?: AuthError }> {
  try {
    client = await clientPromise;
    const db = client.db('smartaicopy');
    const users = db.collection<User>('users');

    // Check if user exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return {
        success: false,
        error: {
          message: 'A user with this email already exists',
          code: 'USER_EXISTS'
        }
      };
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const now = new Date();
    await users.insertOne({
      email,
      passwordHash,
      createdAt: now,
      updatedAt: now,
      isTestAccount
    });

    return { success: true };
  } catch (err) {
    console.error('Error creating user:', err);
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
  try {
    client = await clientPromise;
    const db = client.db('smartaicopy');
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

    return { success: true };
  } catch (err) {
    console.error('Error verifying user:', err);
    return {
      success: false,
      error: {
        message: 'An error occurred while verifying credentials',
        code: 'SERVER_ERROR'
      }
    };
  }
}