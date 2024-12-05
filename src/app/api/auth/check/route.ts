// src/app/api/auth/check/route.ts

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getMongoDb } from '@/lib/db/mongodb';

export async function GET() {
  const cookieStore = await cookies();
  const authSession = cookieStore.get('auth_session');

  if (authSession) {
    try {
      // Get user from MongoDB to check test account status
      const db = await getMongoDb();
      const user = await db.collection('users').findOne({ email: authSession.value });

      if (user) {
        return NextResponse.json({
          authenticated: true,
          email: authSession.value,
          isTestAccount: user.isTestAccount || false
        });
      }
    } catch (error) {
      console.error('Error checking user status:', error);
    }
  }

  return NextResponse.json({
    authenticated: false,
    email: null,
    isTestAccount: false
  });
}