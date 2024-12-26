// src/app/api/auth/login/route.ts

import { verifyUser } from '@/lib/db/users';
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
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const result = await verifyUser(email, password);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error?.message },
        { status: 401 }
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

    logError('Login successful', 'info', { email });

    return NextResponse.json({ success: true });
  } catch (err) {
    const error = err instanceof Error ? err : 'Login failed';
    logError(error, 'error', { context: 'Login' });
    
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}