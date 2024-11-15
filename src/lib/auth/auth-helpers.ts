// src/lib/auth/auth-helpers.ts
import { cookies } from 'next/headers';
import { getMongoDb } from '../db/mongodb';

interface SessionUser {
  id: string;
  email: string;
}

interface Session {
  user: SessionUser;
}

export async function getServerSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get('auth_session')?.value;

    if (!userEmail) {
      return null;
    }

    const db = await getMongoDb();
    const user = await db.collection('users').findOne({ email: userEmail });

    if (!user) {
      return null;
    }

    return {
      user: {
        id: user._id.toString(),
        email: user.email
      }
    };
  } catch (error) {
    console.error('Session check error:', error);
    return null;
  }
}