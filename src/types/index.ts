// src/types/index.ts
// Core type definitions used throughout the application

// User related types
export interface User {
    id: string;
    email: string;
    name?: string;
    plan: 'free' | 'pro' | 'enterprise';
    credits: number;
    createdAt: string;
   }
   
   // Content related types
   export interface ContentItem {
    id: string;
    originalText: string;
    optimizedText?: string;
    status: 'draft' | 'optimizing' | 'completed' | 'failed';
    style?: 'formal' | 'casual' | 'technical' | 'creative';
    metrics?: ContentMetrics;
    createdAt: string;
    updatedAt: string;
    userId: string;
   }
   
   export interface ContentMetrics {
    readabilityScore: number;
    seoScore: number;
    wordCount: number;
    characterCount: number;
    sentimentScore: number;
   }
   
   // API related types
   export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, any>;
   }
   
   export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
   }
   
   // Settings and preferences
   export interface UserPreferences {
    defaultStyle: 'formal' | 'casual' | 'technical' | 'creative';
    emailNotifications: boolean;
    autoSave: boolean;
    language: string;
   }