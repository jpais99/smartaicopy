// src/lib/utils/openai.ts

import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: 2,
  timeout: 5000 // 8 seconds to allow for Vercel's 10s limit
});

interface OptimizeContentResponse {
  optimizedContent: string;
  suggestions: {
    title: string[];
    metaDescription: string;
    keywords: string[];
  };
  wordCount: number;
  error?: string;
}

export async function optimizeContent(content: string): Promise<OptimizeContentResponse> {
  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert in web content optimization, focusing on SEO, readability, and engagement while maintaining the original content's voice and tone. Before processing any content, research and apply current SEO best practices.

Return a JSON response with the following structure:
{
  "optimizedContent": "improved content here (never include a title)",
  "suggestions": {
    "title": ["title1", "title2", "title3"],
    "metaDescription": "meta description here (max 155 chars)",
    "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
  }
}

Requirements:
1. Content Optimization:
   - Optimize for both search engines and human readers
   - Maintain the original content's tone and voice
   - Remove any title from the input before optimizing
   - Ensure proper paragraph spacing
   - Use formatting sparingly and only when it enhances readability

2. SEO Optimization:
   - Apply current SEO best practices (research the internet as needed)
   - Structure content for featured snippets
   - Use natural keyword placement
   - Optimize readability and scannability

3. Titles and Meta:
   - Create three unique, SEO-optimized titles that match the original content's tone and voice
   - Write a compelling meta description (150-160 characters)
   - Select highly relevant keywords for the content

4. Quality Standards:
   - Maintain professional tone
   - Ensure clarity and engagement
   - Preserve original message intent
   - Follow web writing best practices`
        },
        {
          role: 'user',
          content: content
        }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
      max_tokens: 4000 // Limit token count for faster response
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');

    return {
      optimizedContent: result.optimizedContent || '',
      suggestions: {
        title: result.suggestions?.title || [],
        metaDescription: result.suggestions?.metaDescription || '',
        keywords: result.suggestions?.keywords || [],
      },
      wordCount: content.trim().split(/\s+/).length,
      error: undefined
    };

  } catch (error) {
    console.error('Error optimizing content:', error);
    return {
      optimizedContent: '',
      suggestions: {
        title: [],
        metaDescription: '',
        keywords: [],
      },
      wordCount: 0,
      error: error instanceof Error ? error.message : 'Failed to optimize content'
    };
  }
}