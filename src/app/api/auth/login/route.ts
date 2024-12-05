// src/app/api/auth/login/route.ts

import { verifyUser } from '@/lib/db/users';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getMongoDb } from '@/lib/db/mongodb';

export async function POST(request: Request) {
  try {
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

    // Get user details for test account status
    const db = await getMongoDb();
    const user = await db.collection('users').findOne({ email });

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
      isTestAccount: user?.isTestAccount || false
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}