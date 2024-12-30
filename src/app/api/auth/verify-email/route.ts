// src/app/api/auth/verify-email/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getMongoDb } from '@/lib/db/mongodb';
import { logError } from '@/lib/utils/error-logger';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const db = await getMongoDb();
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: 'Email not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    logError('Error verifying email', 'error', {
      context: err instanceof Error ? err.message : 'Unknown error'
    });
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}