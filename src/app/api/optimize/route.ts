// src/app/api/optimize/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { optimizeContent } from '@/lib/utils/openai';
import { OptimizeRequest } from '@/lib/api/content/types';

export async function POST(request: NextRequest) {
  try {
    // Log environment variables (without the actual API key)
    console.log('OpenAI Model:', process.env.OPENAI_MODEL);
    console.log('Max Tokens:', process.env.OPENAI_MAX_TOKENS);
    console.log('API Key exists:', !!process.env.OPENAI_API_KEY);

    const body: OptimizeRequest = await request.json();
    
    // Log request details
    console.log('Request body:', {
      wordCount: body.wordCount,
      price: body.price,
      contentLength: body.content?.length
    });

    // Validate request
    if (!body.content?.trim()) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    if (body.wordCount > 3000) {
      return NextResponse.json(
        { error: 'Content exceeds maximum length of 3000 words' },
        { status: 400 }
      );
    }

    if (!body.price || (body.price !== 25 && body.price !== 50)) {
      return NextResponse.json(
        { error: 'Invalid price' },
        { status: 400 }
      );
    }

    // Process content
    try {
      const result = await optimizeContent(body.content);
      return NextResponse.json(result);
    } catch (e) {
      const error = e as Error;
      console.error('OpenAI optimization error:', error);
      return NextResponse.json(
        { error: `OpenAI Error: ${error.message || 'Unknown error'}` },
        { status: 500 }
      );
    }

  } catch (e) {
    const error = e as Error;
    console.error('Route error:', error);
    return NextResponse.json(
      { error: `Server Error: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}