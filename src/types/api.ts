// src/types/api.ts
// Type definitions specific to API requests and responses

// API Request types
export interface OptimizeContentRequest {
    content: string;
    style?: 'formal' | 'casual' | 'technical' | 'creative';
    targetLength?: number;
    keywords?: string[];
    tone?: string;
    preserveFormatting?: boolean;
   }
   
   export interface AnalyzeContentRequest {
    content: string;
    includeKeywords?: boolean;
    includeSentiment?: boolean;
    includeReadability?: boolean;
   }
   
   // API Response types
   export interface OptimizeContentResponse {
    success: boolean;
    optimizedContent: {
      text: string;
      title?: string;
      description?: string;
    };
    analysis: {
      readabilityScore: number;
      seoScore: number;
      wordCount: number;
      characterCount: number;
    };
    suggestions: Array<{
      type: 'seo' | 'readability' | 'style';
      message: string;
    }>;
    processingTime: number;
   }
   
   export interface AnalyzeContentResponse {
    success: boolean;
    analysis: {
      readability: {
        score: number;
        grade: string;
        suggestions: string[];
      };
      seo: {
        score: number;
        keywords: string[];
        suggestions: string[];
      };
      sentiment: {
        score: number;
        label: 'positive' | 'neutral' | 'negative';
        confidence: number;
      };
    };
   }
   
   // Error Response type
   export interface ApiErrorResponse {
    success: false;
    error: {
      code: string;
      message: string;
      details?: unknown;
    };
    timestamp: string;
   }
   
   // Auth related types
   export interface AuthRequest {
    email: string;
    password: string;
   }
   
   export interface AuthResponse {
    success: boolean;
    token: string;
    user: {
      id: string;
      email: string;
      name?: string;
      plan: string;
    };
   }