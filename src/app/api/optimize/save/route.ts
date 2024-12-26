// src/app/api/optimize/save/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { OptimizeResponse } from '@/lib/api/content/types';
import { saveOptimizationResult } from '@/lib/db/optimization';
import { getServerSession } from '@/lib/auth/auth-helpers';
import { logError } from '@/lib/utils/error-logger';

export async function POST(request: NextRequest) {
  try {
    logError('Optimization save started', 'info', {
      timestamp: new Date().toISOString(),
      path: '/api/optimize/save'
    });

    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 503 }
      );
    }

    const optimizeResponse: OptimizeResponse = await request.json();
    if (!optimizeResponse?.optimizedContent) {
      return NextResponse.json(
        { error: 'Invalid optimization data' },
        { status: 400 }
      );
    }

    // For guest users, return success without saving
    if (!session?.user) {
      logError('Guest user optimization - skipping save', 'info');
      return NextResponse.json({ 
        success: true, 
        temporary: true
      });
    }

    const optimizationResult = {
      userId: new ObjectId(session.user.id),
      originalContent: optimizeResponse.originalContent,
      optimizedContent: optimizeResponse.optimizedContent,
      metadata: {
        wordCount: optimizeResponse.wordCount,
        price: optimizeResponse.wordCount <= 1500 ? 25 : 50,
        timestamp: new Date(),
        status: 'completed' as const,
        titles: optimizeResponse.suggestions.title,
        keywords: optimizeResponse.suggestions.keywords,
        metaDescription: optimizeResponse.suggestions.metaDescription,
      },
      payment: {
        status: 'completed' as const,
        completedAt: new Date()
      }
    };

    const result = await saveOptimizationResult(optimizationResult);
    
    logError('Optimization saved successfully', 'info', {
      userId: session.user.id,
      optimizationId: result.id?.toString(),
      wordCount: optimizationResult.metadata.wordCount
    });

    return NextResponse.json(result);
  } catch (err) {
    const error = err instanceof Error ? err : 'Failed to save optimization';
    logError(error, 'error', {
      context: 'Save optimization',
      path: '/api/optimize/save'
    });

    return NextResponse.json(
      { error: 'Failed to save optimization' },
      { status: 500 }
    );
  }
}