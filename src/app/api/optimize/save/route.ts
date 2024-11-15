// src/app/api/optimize/save/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { OptimizeResponse } from '@/lib/api/content/types';
import { saveOptimizationResult } from '@/lib/db/optimization';
import { getServerSession } from '@/lib/auth/auth-helpers';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    const optimizeResponse: OptimizeResponse = await request.json();
    
    if (!optimizeResponse || !optimizeResponse.optimizedContent) {
      return NextResponse.json(
        { error: 'Invalid optimization data' },
        { status: 400 }
      );
    }

    // Only save to MongoDB for authenticated users
    if (!session?.user) {
      // For guests, just return success without saving to DB
      return NextResponse.json({ 
        success: true, 
        temporary: true // Flag to indicate this wasn't permanently saved
      });
    }

    const optimizationResult = {
      userId: new ObjectId(session.user.id),
      originalContent: optimizeResponse.originalContent,
      optimizedContent: optimizeResponse.optimizedContent,
      metadata: {
        wordCount: optimizeResponse.wordCount,
        price: optimizeResponse.wordCount <= 1500 ? 25 : 50,
        timestamp: new Date(),
        status: 'completed' as const,
        titles: optimizeResponse.suggestions.title,
        keywords: optimizeResponse.suggestions.keywords,
        metaDescription: optimizeResponse.suggestions.metaDescription,
      },
      payment: {
        status: 'completed' as const,
        completedAt: new Date()
      }
    };

    const result = await saveOptimizationResult(optimizationResult);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Save optimization error:', error);
    return NextResponse.json(
      { error: 'Failed to save optimization' },
      { status: 500 }
    );
  }
}