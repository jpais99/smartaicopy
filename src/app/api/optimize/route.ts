// src/app/api/optimize/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { optimizeContent } from '@/lib/utils/openai';
import { OptimizeRequest } from '@/lib/api/content/types';
import { logError, createApiError, ApiError } from '@/lib/utils/error-logger';

export async function POST(request: NextRequest) {
  try {
    // Log environment variables (without the actual API key)
    logError('Optimization request started', 'info', {
      model: process.env.OPENAI_MODEL,
      maxTokens: process.env.OPENAI_MAX_TOKENS,
      hasApiKey: !!process.env.OPENAI_API_KEY
    });

    const body: OptimizeRequest = await request.json();
    
    // Log request details
    logError('Request received', 'info', {
      wordCount: body.wordCount,
      price: body.price,
      contentLength: body.content?.length
    });

    // Validate request
    if (!body.content?.trim()) {
      throw createApiError('Content is required', 400);
    }

    if (body.wordCount > 3000) {
      throw createApiError('Content exceeds maximum length of 3000 words', 400);
    }

    if (!body.price || (body.price !== 10 && body.price !== 15)) {
      throw createApiError('Invalid price', 400);
    }

    // Process content
    try {
      const optimizeResult = await optimizeContent(body.content);
      
      // Combine original content with optimization results
      const result = {
        ...optimizeResult,
        originalContent: body.content
      };
      
      return NextResponse.json(result);
    } catch (e) {
      const error = e as Error;
      logError(error, 'error', {
        context: 'OpenAI optimization',
        contentLength: body.content.length,
        wordCount: body.wordCount
      });
      return NextResponse.json(
        { error: `OpenAI Error: ${error.message || 'Unknown error'}` },
        { status: 500 }
      );
    }

  } catch (e: unknown) {
    const error = e instanceof ApiError 
      ? e 
      : createApiError(e instanceof Error ? e.message : 'Unknown error');
    
    logError(error, 'error', {
      context: 'Optimize route handler',
      path: '/api/optimize'
    });
    return NextResponse.json(
      { error: `Server Error: ${error.message}` },
      { status: error.statusCode }
    );
  }
}