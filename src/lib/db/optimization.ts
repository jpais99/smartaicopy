// src/lib/db/optimization.ts

import { ObjectId } from 'mongodb';
import { getMongoDb } from './mongodb';
import { OptimizationResult, OptimizationMetadata, PaymentStatus } from '@/lib/api/content/types';

// Extended payment status to include Stripe-specific fields
interface StripePaymentStatus extends PaymentStatus {
  stripePaymentIntentId?: string;  // Stripe's payment intent ID
  stripeCustomerId?: string;       // Customer ID for saved payment methods
  amount?: number;                 // Amount in cents
  currency?: string;               // Three-letter currency code (e.g., 'usd')
}

// Our complete optimization record structure
interface MongoOptimizationResult {
  _id?: ObjectId;
  userId: ObjectId;
  originalContent: string;
  optimizedContent: string;
  metadata: OptimizationMetadata;
  payment: StripePaymentStatus;
}

// Save a new optimization result to MongoDB
export async function saveOptimizationResult(result: Omit<MongoOptimizationResult, '_id'>) {
  try {
    console.log('saveOptimizationResult called with:', result);
    
    const db = await getMongoDb();
    const collection = db.collection('optimizations');
    
    // Validate required fields before saving
    if (!result.userId || !result.originalContent || !result.optimizedContent) {
      console.error('Missing required fields:', {
        hasUserId: !!result.userId,
        hasOriginalContent: !!result.originalContent,
        hasOptimizedContent: !!result.optimizedContent
      });
      throw new Error('Missing required fields for optimization');
    }

    // Insert the record with payment information
    const response = await collection.insertOne(result);
    
    console.log('MongoDB insert response:', response);
    
    if (!response.acknowledged) {
      throw new Error('Database operation failed');
    }
    
    return { success: true, id: response.insertedId };
  } catch (error) {
    console.error('Error in saveOptimizationResult:', error);
    throw error;
  }
}

// Get optimizations for a specific user with pagination
export async function getUserOptimizations(userId: ObjectId, page = 1, limit = 10) {
  try {
    const db = await getMongoDb();
    const collection = db.collection('optimizations');
    
    const skip = (page - 1) * limit;
    
    console.log('Querying optimizations with userId:', userId.toString());
    
    // Log all documents to help with debugging
    const allDocs = await collection.find({ userId }).toArray();
    console.log('All documents before sorting:', allDocs.map(doc => ({
      id: doc._id.toString(),
      timestamp: doc.metadata.timestamp,
      date: new Date(doc.metadata.timestamp)
    })));
    
    // Only return completed and paid optimizations
    const results = await collection.find({ 
      userId,
      'payment.status': 'completed'
    })
      .sort({ 'metadata.timestamp': -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    console.log('Results after sorting:', results.map(doc => ({
      id: doc._id.toString(),
      timestamp: doc.metadata.timestamp,
      date: new Date(doc.metadata.timestamp)
    })));
    
    // Count total documents for pagination
    const total = await collection.countDocuments({ 
      userId,
      'payment.status': 'completed'
    });
    
    console.log('Total documents found:', total);
    
    // Convert ObjectIds to strings for JSON serialization
    return {
      results: results.map(r => ({
        ...r,
        _id: r._id.toString(),
        userId: r.userId.toString()
      })),
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
        limit
      }
    };
  } catch (error) {
    console.error('Error fetching user optimizations:', error);
    throw new Error('Failed to fetch optimization history');
  }
}

// Get a single optimization by ID
export async function getOptimizationById(id: string, userId: ObjectId) {
  try {
    const db = await getMongoDb();
    const collection = db.collection('optimizations');
    
    const result = await collection.findOne({
      _id: new ObjectId(id),
      userId,
      'payment.status': 'completed'
    });
    
    if (!result) {
      throw new Error('Optimization not found');
    }
    
    // Convert ObjectIds to strings
    return {
      ...result,
      _id: result._id.toString(),
      userId: result.userId.toString()
    };
  } catch (error) {
    console.error('Error fetching optimization:', error);
    throw new Error('Failed to fetch optimization');
  }
}

// Handle guest user optimization migration
export async function migrateGuestOptimizations(guestUserId: ObjectId, newUserId: ObjectId) {
  try {
    const db = await getMongoDb();
    const collection = db.collection('optimizations');
    
    const result = await collection.updateMany(
      { userId: guestUserId },
      { $set: { userId: newUserId } }
    );

    if (!result.acknowledged) {
      throw new Error('Migration failed');
    }

    return { success: true, migratedCount: result.modifiedCount };
  } catch (error) {
    console.error('Error migrating optimizations:', error);
    throw new Error('Failed to migrate optimizations');
  }
}