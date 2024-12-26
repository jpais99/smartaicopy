// src/app/api/account/delete/route.ts

import { NextResponse } from 'next/server';
import { getMongoDb } from '@/lib/db/mongodb';
import { getServerSession } from '@/lib/auth/auth-helpers';
import { cookies } from 'next/headers';
import { logError } from '@/lib/utils/error-logger';
import { ObjectId } from 'mongodb';

export async function DELETE() {
  if (process.env.NODE_ENV === 'development' || !process.env.MONGODB_URI) {
    logError('Database configuration check skipped for build', 'info');
    return NextResponse.json({ success: true });
  }

  try {
    logError('Account deletion request started', 'info');

    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const db = await getMongoDb();
    
    const optimizationsResult = await db.collection('optimizations').deleteMany({
      userId: new ObjectId(session.user.id)
    });

    const userResult = await db.collection('users').deleteOne({
      _id: new ObjectId(session.user.id)
    });

    if (!userResult.deletedCount) {
      throw new Error('User not found');
    }

    const cookieStore = await cookies();
    cookieStore.delete('auth_session');

    logError('Account deletion completed', 'info', {
      userId: session.user.id,
      optimizationsDeleted: optimizationsResult.deletedCount
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Failed to delete account';
    logError(error, 'error', { context: 'Account deletion' });
    return NextResponse.json(
      { error },
      { status: 500 }
    );
  }
}