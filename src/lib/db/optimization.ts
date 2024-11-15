// src/lib/db/optimization.ts
import { ObjectId } from 'mongodb';
import { getMongoDb } from './mongodb';
import { OptimizationResult, OptimizationMetadata, PaymentStatus } from '@/lib/api/content/types';

interface MongoOptimizationResult {
  _id?: ObjectId;
  userId: ObjectId;
  originalContent: string;
  optimizedContent: string;
  metadata: OptimizationMetadata;
  payment: PaymentStatus;
}

export async function saveOptimizationResult(result: Omit<MongoOptimizationResult, '_id'>) {
  try {
    const db = await getMongoDb();
    const collection = db.collection('optimizations');
    
    const newResult = {
      ...result,
      metadata: {
        ...result.metadata,
        timestamp: new Date().toISOString(),
      }
    };

    const response = await collection.insertOne(newResult);
    if (!response.acknowledged) {
      throw new Error('Database operation failed');
    }
    
    return { success: true, id: response.insertedId };
  } catch (error) {
    console.error('Error saving optimization result:', error);
    throw new Error('Failed to save optimization result');
  }
}

export async function getUserOptimizations(userId: ObjectId, page = 1, limit = 10) {
  try {
    const db = await getMongoDb();
    const collection = db.collection('optimizations');
    
    const skip = (page - 1) * limit;
    
    const results = await collection.find({ 
      userId,
      'payment.status': 'completed'
    })
      .sort({ 'metadata.timestamp': -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
      
    const total = await collection.countDocuments({ 
      userId,
      'payment.status': 'completed'
    });
    
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