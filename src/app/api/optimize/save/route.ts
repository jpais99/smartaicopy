// src/app/api/optimize/save/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { OptimizeResponse } from '@/lib/api/content/types';
import { saveOptimizationResult } from '@/lib/db/optimization';
import { getServerSession } from '@/lib/auth/auth-helpers';
import { logError, createApiError, ApiError } from '@/lib/utils/error-logger';

export async function POST(request: NextRequest) {
  try {
    // Log start of save operation
    logError('Optimization save started', 'info', {
      timestamp: new Date().toISOString(),
      path: '/api/optimize/save'
    });

    // Verify user session first
    const session = await getServerSession();
    logError('Session check completed', 'info', {
      hasSession: !!session,
      hasUser: !!session?.user
    });

    const optimizeResponse: OptimizeResponse = await request.json();
    logError('Received optimization data', 'info', {
      hasContent: !!optimizeResponse?.optimizedContent,
      wordCount: optimizeResponse?.wordCount
    });
    
    if (!optimizeResponse || !optimizeResponse.optimizedContent) {
      throw createApiError('Invalid optimization data', 400, {
        hasResponse: !!optimizeResponse,
        hasContent: !!optimizeResponse?.optimizedContent
      });
    }

    // For guest users, we just return success without saving
    if (!session?.user) {
      logError('Guest user optimization - skipping save', 'info');
      return NextResponse.json({ 
        success: true, 
        temporary: true
      });
    }

    // Prepare the optimization record for authenticated users
    const optimizationResult = {
      userId: new ObjectId(session.user.id),
      originalContent: optimizeResponse.originalContent,
      optimizedContent: optimizeResponse.optimizedContent,
      metadata: {
        wordCount: optimizeResponse.wordCount,
        price: optimizeResponse.wordCount <= 1500 ? 10 : 15,
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

    logError('Preparing to save optimization', 'info', {
      userId: session.user.id,
      wordCount: optimizationResult.metadata.wordCount,
      timestamp: optimizationResult.metadata.timestamp
    });

    try {
      const result = await saveOptimizationResult(optimizationResult);
      
      // Log successful save
      logError('Optimization saved successfully', 'info', {
        userId: session.user.id,
        optimizationId: result.id?.toString(),
        wordCount: optimizationResult.metadata.wordCount
      });

      return NextResponse.json(result);
    } catch (dbError: unknown) {
      // Handle database-specific errors
      throw createApiError(
        'Failed to save optimization',
        500,
        { 
          context: 'Database operation',
          userId: session.user.id,
          error: dbError instanceof Error ? dbError.message : 'Unknown database error'
        }
      );
    }
  } catch (e: unknown) {
    const error = e instanceof ApiError ? e : createApiError(
      e instanceof Error ? e.message : 'Failed to save optimization',
      500,
      { context: 'Save optimization route handler' }
    );

    logError(error, 'error', {
      context: 'Optimization save',
      path: '/api/optimize/save'
    });

    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }
}