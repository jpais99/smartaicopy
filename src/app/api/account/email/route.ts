// src/app/api/account/email/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getMongoDb } from '@/lib/db/mongodb';
import { getServerSession } from '@/lib/auth/auth-helpers';
import { cookies } from 'next/headers';
import { logError } from '@/lib/utils/error-logger';
import { ObjectId } from 'mongodb';

export async function PUT(request: NextRequest) {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 503 }
      );
    }

    logError('Email update request started', 'info');

    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    const db = await getMongoDb();
    
    // Check if email is already in use
    const existingUser = await db.collection('users').findOne({ 
      email,
      _id: { $ne: new ObjectId(session.user.id) }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      );
    }

    // Update email
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: { email, updatedAt: new Date() } }
    );

    if (!result.matchedCount) {
      throw new Error('User not found');
    }

    const cookieStore = await cookies();
    cookieStore.delete('auth_session');

    logError('Email update completed successfully', 'info', {
      userId: session.user.id
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Failed to update email';
    logError(error, 'error', { context: 'Email update' });
    return NextResponse.json(
      { error },
      { status: 500 }
    );
  }
}