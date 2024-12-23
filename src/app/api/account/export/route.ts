// src/app/api/account/export/route.ts

import { NextResponse } from 'next/server';
import { getMongoDb } from '@/lib/db/mongodb';
import { getServerSession } from '@/lib/auth/auth-helpers';
import { logError } from '@/lib/utils/error-logger';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    logError('Data export request started', 'info');

    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const db = await getMongoDb();
    
    // Get user data (excluding password hash)
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(session.user.id) },
      { projection: { passwordHash: 0 } }
    );

    if (!user) {
      throw new Error('User not found');
    }

    // Get all user's optimizations
    const optimizations = await db.collection('optimizations')
      .find({ userId: new ObjectId(session.user.id) })
      .sort({ 'metadata.timestamp': -1 })
      .toArray();

    const exportData = {
      user: {
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      optimizations: optimizations.map(opt => ({
        timestamp: opt.metadata.timestamp,
        wordCount: opt.metadata.wordCount,
        originalContent: opt.originalContent,
        optimizedContent: opt.optimizedContent,
        metadata: {
          titles: opt.metadata.titles,
          keywords: opt.metadata.keywords,
          metaDescription: opt.metadata.metaDescription
        }
      }))
    };

    logError('Data export completed successfully', 'info', {
      userId: session.user.id,
      optimizationCount: optimizations.length
    });

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="smartaicopy-data.json"'
      }
    });
  } catch (err) {
    // Proper error typing
    const error = err instanceof Error ? err.message : 'Failed to export data';
    logError(error, 'error', { context: 'Data export' });
    return NextResponse.json(
      { error },
      { status: 500 }
    );
  }
}