// src/app/api/account/delete/route.ts

import { NextResponse } from 'next/server';
import { getMongoDb } from '@/lib/db/mongodb';
import { getServerSession } from '@/lib/auth/auth-helpers';
import { cookies } from 'next/headers';
import { logError } from '@/lib/utils/error-logger';
import { ObjectId } from 'mongodb';

export async function DELETE() {
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

    // Delete user's optimizations first
    await db.collection('optimizations').deleteMany({
      userId: new ObjectId(session.user.id)
    });

    // Delete user account
    const result = await db.collection('users').deleteOne({
      _id: new ObjectId(session.user.id)
    });

    if (!result.deletedCount) {
      throw new Error('User not found');
    }

    // Clear auth session - fix for Promise<ReadonlyRequestCookies>
    const cookieStore = await cookies();
    cookieStore.delete('auth_session');

    logError('Account deletion completed successfully', 'info', {
      userId: session.user.id
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