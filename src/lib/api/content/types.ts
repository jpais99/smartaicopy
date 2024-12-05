// src/lib/api/content/types.ts

// Base optimization response structure
export interface OptimizeResponse {
  originalContent: string;
  optimizedContent: string;
  suggestions: {
    title: string[];
    metaDescription: string;
    keywords: string[];
  };
  wordCount: number;
  error?: string;
  // Add Stripe payment information that may come back from payment flow
  paymentIntent?: {
    id: string;
    amount: number;
    currency: string;
    status: string;
  };
  customer?: {
    id: string;
    email?: string;
  };
}

// Request structure for content optimization
export interface OptimizeRequest {
  content: string;
  wordCount: number;
  price: number;
}

// Metadata for tracking optimization details
export interface OptimizationMetadata {
  wordCount: number;
  price: number;
  timestamp: Date;
  status: 'completed' | 'failed';
  titles?: string[];
  keywords?: string[];
  metaDescription?: string;
}

// Base payment status interface
export interface PaymentStatus {
  status: 'pending' | 'completed' | 'failed';
  completedAt?: Date;
  stripePaymentIntentId?: string;
  stripeCustomerId?: string;
  amount?: number;
  currency?: string;
}

// Complete optimization record structure
export interface OptimizationResult {
  _id: string;
  userId: string;
  originalContent: string;
  optimizedContent: string;
  metadata: OptimizationMetadata;
  payment: PaymentStatus;
}

// Pagination information for optimization history
export interface PaginationInfo {
  total: number;
  pages: number;
  current: number;
  limit: number;
}

// Complete response structure for optimization history
export interface OptimizationHistoryResponse {
  results: OptimizationResult[];
  pagination: PaginationInfo;
}