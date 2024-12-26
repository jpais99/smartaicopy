// src/lib/utils/error-logger.ts

type ErrorSeverity = 'error' | 'warning' | 'info';

interface ErrorDetails {
  message: string;
  code?: string;
  stack?: string;
  context: Record<string, unknown>;
}

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

export function logError(
  error: Error | string,
  severity: ErrorSeverity = 'error',
  context: Record<string, unknown> = {}
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

  if (process.env.NODE_ENV === 'production') {
    console.error(JSON.stringify(errorDetails));
  } else {
    console.error('\n🚨 Error:', errorDetails.message);
    if (errorDetails.stack) {
      console.error('Stack:', errorDetails.stack);
    }
    console.error('Context:', errorDetails.context);
    console.error('\n');
  }
}

export function createApiError(
  message: string,
  statusCode = 500,
  context: Record<string, unknown> = {}
): ApiError {
  const error = new ApiError(message, statusCode);
  
  logError(error, 'error', {
    statusCode,
    ...context
  });
  
  return error;
}