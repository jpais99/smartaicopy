// src/app/api/optimize/history/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getUserOptimizations } from '@/lib/db/optimization';
import { getServerSession } from '@/lib/auth/auth-helpers';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    console.log('Session:', session);
    
    if (!session?.user) {
      console.log('No session or user found');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    console.log('Fetching optimizations for user:', session.user.id);
    const results = await getUserOptimizations(
      new ObjectId(session.user.id),
      page,
      limit
    );
    console.log('Found results:', results);

    return NextResponse.json(results);
  } catch (error) {
    console.error('History fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch optimization history' },
      { status: 500 }
    );
  }
}