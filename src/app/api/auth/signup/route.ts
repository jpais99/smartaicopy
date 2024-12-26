// src/app/api/auth/signup/route.ts

import { createUser } from '@/lib/db/users';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { logError } from '@/lib/utils/error-logger';

export async function POST(request: Request) {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 503 }
      );
    }

    const body = await request.json();
    
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Invalid email or password format' },
        { status: 400 }
      );
    }

    const result = await createUser(email, password);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error?.message || 'Failed to create user' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set('auth_session', email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    logError('Signup successful', 'info', { email });

    return NextResponse.json({ success: true });
  } catch (err) {
    const error = err instanceof Error ? err : 'Signup failed';
    logError(error, 'error', { context: 'Signup' });
    
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}