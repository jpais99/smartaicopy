// src/app/api/auth/check/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();
  const authSession = cookieStore.get('auth_session');

  if (authSession) {
    return NextResponse.json({
      authenticated: true,
      email: authSession.value
    });
  }

  return NextResponse.json({
    authenticated: false,
    email: null
  });
}