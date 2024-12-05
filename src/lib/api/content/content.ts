// src/lib/api/content/content.ts

import { OptimizeRequest, OptimizeResponse } from './types';
import { fetchWithError } from '../../utils/api-helpers';

export async function optimizeContent(
  content: string,
  wordCount: number,
  price: number
): Promise<OptimizeResponse> {
  try {
    return await fetchWithError<OptimizeResponse>('/api/optimize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        wordCount,
        price,
      } as OptimizeRequest),
    });
  } catch (error) {
    return {
      originalContent: content,
      optimizedContent: '',
      suggestions: {
        title: [],
        metaDescription: '',
        keywords: [],
      },
      wordCount: 0,  // Added this line to match OptimizeResponse type
      error: error instanceof Error ? error.message : 'Failed to optimize content'
    };
  }
}