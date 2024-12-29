// src/app/api/auth/forgot-password/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getMongoDb } from '@/lib/db/mongodb';
import { logError } from '@/lib/utils/error-logger';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const db = await getMongoDb();
    
    // Generate reset token and expiration
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour

    // Update user with reset token
    const result = await db.collection('users').updateOne(
      { email },
      {
        $set: {
          resetToken,
          resetTokenExpires,
          updatedAt: new Date()
        }
      }
    );

    // Note: For security, we return success even if email not found
    logError('Password reset requested', 'info', {
      email,
      found: result.matchedCount > 0,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Failed to process request';
    logError(error, 'error', { context: 'Password reset request' });
    
    return NextResponse.json(
      { error: 'An error occurred processing your request' },
      { status: 500 }
    );
  }
}