// src/app/api/auth/reset-password/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getMongoDb } from '@/lib/db/mongodb';
import { logError } from '@/lib/utils/error-logger';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    const db = await getMongoDb();

    // Find user with valid reset token that hasn't expired
    const user = await db.collection('users').findOne({
      resetToken: token,
      resetTokenExpires: { $gt: new Date() }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Update user's password and remove reset token
    const result = await db.collection('users').updateOne(
      { resetToken: token },
      {
        $set: {
          passwordHash,
          updatedAt: new Date()
        },
        $unset: {
          resetToken: "",
          resetTokenExpires: ""
        }
      }
    );

    if (!result.modifiedCount) {
      throw new Error('Failed to update password');
    }

    logError('Password reset completed', 'info', {
      userId: user._id.toString(),
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Failed to reset password';
    logError(error, 'error', { context: 'Password reset' });
    
    return NextResponse.json(
      { error: 'An error occurred resetting your password' },
      { status: 500 }
    );
  }
}