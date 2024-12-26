// src/app/api/optimize/history/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getUserOptimizations } from '@/lib/db/optimization';
import { getServerSession } from '@/lib/auth/auth-helpers';
import { logError } from '@/lib/utils/error-logger';

export async function GET(request: NextRequest) {
  try {
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const results = await getUserOptimizations(
      new ObjectId(session.user.id),
      page,
      limit
    );

    logError('History fetch completed', 'info', {
      userId: session.user.id,
      page,
      limit,
      resultCount: results.results.length
    });

    return NextResponse.json(results);
  } catch (err) {
    logError(err instanceof Error ? err : 'Failed to fetch history', 'error', { 
      context: 'History fetch',
      path: '/api/optimize/history'
    });
    
    return NextResponse.json(
      { error: 'Failed to fetch optimization history' },
      { status: 500 }
    );
  }
}