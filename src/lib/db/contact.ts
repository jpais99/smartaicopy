// src/lib/db/contact.ts

import { ObjectId } from 'mongodb';
import { getMongoDb } from './mongodb';

export interface ContactSubmission {
  _id?: ObjectId;
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  accountEmail?: string;
  transactionId?: string;
  timestamp: Date;
}

export async function saveContactSubmission(submission: Omit<ContactSubmission, '_id'>) {
  try {
    const db = await getMongoDb();
    const result = await db.collection('contact_submissions').insertOne(submission);
    return { success: true, id: result.insertedId };
  } catch (error) {
    console.error('Failed to save contact submission:', error);
    throw error;
  }
}