// src/app/api/optimize/save/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { OptimizeResponse } from '@/lib/api/content/types';
import { saveOptimizationResult } from '@/lib/db/optimization';
import { getServerSession } from '@/lib/auth/auth-helpers';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    console.log('Session:', session);
    
    const optimizeResponse: OptimizeResponse = await request.json();
    console.log('Received optimization data:', optimizeResponse);
    
    if (!optimizeResponse || !optimizeResponse.optimizedContent) {
      console.error('Invalid optimization data received');
      return NextResponse.json(
        { error: 'Invalid optimization data' },
        { status: 400 }
      );
    }

    // Only save to MongoDB for authenticated users
    if (!session?.user) {
      console.log('No authenticated user found');
      return NextResponse.json({ 
        success: true, 
        temporary: true
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

    console.log('Preparing to save optimization:', optimizationResult);

    const result = await saveOptimizationResult(optimizationResult);
    console.log('Save result:', result);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Save optimization error:', error);
    return NextResponse.json(
      { error: 'Failed to save optimization' },
      { status: 500 }
    );
  }
}