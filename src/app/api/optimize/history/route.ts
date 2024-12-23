// src/app/api/optimize/history/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getUserOptimizations } from '@/lib/db/optimization';
import { getServerSession } from '@/lib/auth/auth-helpers';
import { logError, createApiError, ApiError } from '@/lib/utils/error-logger';

export async function GET(request: NextRequest) {
  try {
    // Log the start of history retrieval
    logError('History retrieval started', 'info', {
      path: '/api/optimize/history',
      timestamp: new Date().toISOString()
    });

    const session = await getServerSession();
    
    // Log session status
    logError('Session check completed', 'info', {
      hasSession: !!session,
      hasUser: !!session?.user
    });
    
    if (!session?.user) {
      throw createApiError('Unauthorized', 401, {
        reason: 'No valid session found'
      });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Log pagination parameters
    logError('Fetching optimizations', 'info', {
      userId: session.user.id,
      page,
      limit
    });

    try {
      const results = await getUserOptimizations(
        new ObjectId(session.user.id),
        page,
        limit
      );

      // Log successful retrieval
      logError('History retrieved successfully', 'info', {
        userId: session.user.id,
        resultCount: results.results.length,
        totalPages: results.pagination.pages
      });

      return NextResponse.json(results);
    } catch (dbError: unknown) {
      // Handle database-specific errors
      throw createApiError(
        'Failed to fetch optimization history',
        500,
        { 
          context: 'Database operation',
          userId: session.user.id,
          page,
          limit
        }
      );
    }
  } catch (e: unknown) {
    const error = e instanceof ApiError ? e : createApiError(
      e instanceof Error ? e.message : 'History fetch failed',
      500,
      { context: 'History route handler' }
    );

    logError(error, 'error', {
      context: 'History retrieval',
      path: '/api/optimize/history'
    });

    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }
}