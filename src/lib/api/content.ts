// src/lib/api/content.ts
// API functions for content optimization and management
import { fetchWithError } from '../utils/api-helpers';
import { normalizeText, TextStyle } from '../utils/text-processing';

interface OptimizationOptions {
 style?: TextStyle;
 maxLength?: number;
 targetKeywords?: string[];
 preserveFormatting?: boolean;
}

interface OptimizeResponse {
 optimizedText: string;
 metrics: {
   originalLength: number;
   optimizedLength: number;
   readability: number;
   seoScore: number;
 };
 suggestions: string[];
}

export async function optimizeContent(
 content: string,
 options: OptimizationOptions = {}
) {
 const normalizedContent = normalizeText(content);
 
 return fetchWithError<OptimizeResponse>('/optimize', {
   method: 'POST',
   body: JSON.stringify({
     content: normalizedContent,
     ...options,
   }),
 });
}

interface AnalysisResponse {
 readability: {
   score: number;
   level: string;
   suggestions: string[];
 };
 seo: {
   score: number;
   keywords: string[];
   suggestions: string[];
 };
 sentiment: {
   score: number;
   type: 'positive' | 'neutral' | 'negative';
 };
}

export async function analyzeContent(content: string) {
 const normalizedContent = normalizeText(content);

 return fetchWithError<AnalysisResponse>('/analyze', {
   method: 'POST',
   body: JSON.stringify({
     content: normalizedContent,
   }),
 });
}

interface GenerateVariationsResponse {
 variations: string[];
 metrics: {
   uniqueness: number[];
   readability: number[];
 };
}

export async function generateVariations(
 content: string,
 count: number = 3,
 style?: TextStyle
) {
 return fetchWithError<GenerateVariationsResponse>('/variations', {
   method: 'POST',
   body: JSON.stringify({
     content,
     count,
     style,
   }),
 });
}