// src/app/api/optimize/save/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { OptimizeResponse } from '@/lib/api/content/types';
import { saveOptimizationResult } from '@/lib/db/optimization';
import { getServerSession } from '@/lib/auth/auth-helpers';

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user session
    const session = await getServerSession();
    console.log('Save optimization - Session:', session);
    
    // Parse optimization response from request body
    const optimizeResponse: OptimizeResponse = await request.json();
    console.log('Received optimization data:', optimizeResponse);
    
    // Validate required data
    if (!optimizeResponse || !optimizeResponse.optimizedContent) {
      console.error('Invalid optimization data received');
      return NextResponse.json(
        { error: 'Invalid optimization data' },
        { status: 400 }
      );
    }

    // For guest users, we return success but don't save to database
    // This maintains compatibility with the client-side flow
    if (!session?.user) {
      console.log('No authenticated user found - returning temporary success');
      return NextResponse.json({ 
        success: true, 
        temporary: true
      });
    }

    // Construct the optimization record with payment information
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
        completedAt: new Date(),
        // We'll add Stripe-specific fields here:
        stripePaymentIntentId: optimizeResponse.paymentIntent?.id,
        stripeCustomerId: optimizeResponse.customer?.id,
        amount: optimizeResponse.paymentIntent?.amount,
        currency: optimizeResponse.paymentIntent?.currency
      }
    };

    console.log('Preparing to save optimization:', optimizationResult);

    // Save to database using existing optimization storage
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