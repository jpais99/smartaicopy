// src/lib/api/content/types.ts

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
 }
 
 export interface OptimizeRequest {
  content: string;
  wordCount: number;
  price: number;
 }
 
 export interface OptimizationMetadata {
  wordCount: number;
  price: number;
  timestamp: Date;
  status: 'completed' | 'failed';
  titles?: string[];
  keywords?: string[];
  metaDescription?: string;
 }
 
 export interface PaymentStatus {
  status: 'pending' | 'completed' | 'failed';
  completedAt?: Date;
 }
 
 export interface OptimizationResult {
  _id: string;
  userId: string;
  originalContent: string;
  optimizedContent: string;
  metadata: OptimizationMetadata;
  payment: PaymentStatus;
 }
 
 export interface PaginationInfo {
  total: number;
  pages: number;
  current: number;
  limit: number;
 }
 
 export interface OptimizationHistoryResponse {
  results: OptimizationResult[];
  pagination: PaginationInfo;
 }