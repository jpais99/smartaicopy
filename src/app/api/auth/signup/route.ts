// src/app/api/auth/signup/route.ts

import { createUser } from '@/lib/db/users';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { email, password, isTestAccount = false } = body;

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

    const result = await createUser(email, password, isTestAccount);

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

    return NextResponse.json({ 
      success: true,
      isTestAccount 
    });
  } catch (error) {
    console.error('Signup route error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}