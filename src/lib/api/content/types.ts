// src/lib/api/content/types.ts
export interface OptimizeResponse {
    optimizedContent: string;
    suggestions: {
      title: string[];
      metaDescription: string;
      keywords: string[];
    };
    wordCount: number;
    error?: string;
  }
  
  export interface OptimizeRequest {
    content: string;
    wordCount: number;
    price: number;
  }