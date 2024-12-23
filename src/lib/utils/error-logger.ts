// src/lib/utils/error-logger.ts

type ErrorSeverity = 'error' | 'warning' | 'info';

interface ErrorDetails {
  message: string;
  code?: string;
  stack?: string;
  context?: Record<string, any>;
}

// Add this custom error class
export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

export function logError(
  error: Error | string,
  severity: ErrorSeverity = 'error',
  context: Record<string, any> = {}
): void {
  const errorDetails: ErrorDetails = {
    message: error instanceof Error ? error.message : error,
    stack: error instanceof Error ? error.stack : undefined,
    context: {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      ...context
    }
  };

  // In production, we'll send to error monitoring service
  // For now, structured console logging
  if (process.env.NODE_ENV === 'production') {
    // Production-only logging
    console.error(JSON.stringify(errorDetails, null, 2));
  } else {
    // Development logging with better formatting
    console.error('\n🚨 Error logged:');
    console.error('Message:', errorDetails.message);
    console.error('Context:', errorDetails.context);
    if (errorDetails.stack) {
      console.error('Stack:', errorDetails.stack);
    }
    console.error('\n');
  }
}

// Update the createApiError function to use our custom error class
export function createApiError(
  message: string,
  statusCode: number = 500,
  context: Record<string, any> = {}
): ApiError {
  const error = new ApiError(message, statusCode);
  
  // Log the API error
  logError(error, 'error', {
    statusCode,
    ...context
  });
  
  return error;
}