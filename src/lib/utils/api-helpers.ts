// src/lib/utils/api-helpers.ts
// Utility functions for API requests and response handling

// Types for API responses
type ApiResponse<T> = {
    data?: T;
    error?: string;
    status: number;
   };
   
   // Base configuration for API requests
   const API_BASE_URL = '/api';
   
   // Generic fetch wrapper with error handling
   export async function fetchWithError<T>(
    endpoint: string,
    options: RequestInit = {}
   ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
   
      const data = await response.json();
   
      if (!response.ok) {
        return {
          error: data.error || 'An error occurred',
          status: response.status,
        };
      }
   
      return {
        data,
        status: response.status,
      };
    } catch (error) {
      return {
        error: 'Network error',
        status: 500,
      };
    }
   }
   
   // Helper function to handle form data
   export function formatFormData(data: Record<string, any>): string {
    return JSON.stringify(data);
   }
   
   // Helper to validate API responses
   export function isValidResponse<T>(response: ApiResponse<T>): response is ApiResponse<T> & { data: T } {
    return !response.error && response.data !== undefined;
   }