/**
 * Error Handling Utilities
 * Production-ready error handling with retry logic and user-friendly messages
 */


export interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  retryable?: (error: unknown) => boolean;
}

/**
 * Retries a function with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    retryable = (error) => {
      // Retry on network errors, timeouts, and 5xx errors
      if (error instanceof Error) {
        const message = error.message.toLowerCase();
        return (
          message.includes('network') ||
          message.includes('timeout') ||
          message.includes('fetch') ||
          message.includes('503') ||
          message.includes('502') ||
          message.includes('504')
        );
      }
      return false;
    },
  } = options;

  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries || !retryable(error)) {
        throw error;
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = retryDelay * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Gets user-friendly error message from error
 */
export function getUserFriendlyError(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // Network errors
    if (message.includes('network') || message.includes('fetch')) {
      return 'Network connection failed. Please check your internet and try again.';
    }

    if (message.includes('timeout')) {
      return 'Request timed out. Please try again.';
    }

    // Auth errors
    if (message.includes('authenticated') || message.includes('unauthorized')) {
      return 'Your session has expired. Please refresh the page.';
    }

    // Server errors
    if (message.includes('503') || message.includes('service unavailable')) {
      return 'Service temporarily unavailable. Please try again in a moment.';
    }

    if (message.includes('500') || message.includes('internal server')) {
      return 'An error occurred on our end. Please try again or contact support.';
    }

    // Rate limiting
    if (message.includes('rate limit') || message.includes('429')) {
      return 'Too many requests. Please wait a moment and try again.';
    }

    // Default
    return error.message || 'An unexpected error occurred. Please try again.';
  }

  return 'An unexpected error occurred. Please try again.';
}

/**
 * Logs error in development, sends to error tracking in production
 */
export function logError(error: unknown, context?: string): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;

  if (import.meta.env.DEV) {
    // Development: log to console with context
    console.error(`[${context || 'Error'}]`, errorMessage, errorStack);
  } else {
    // Production: send to error tracking service
    // Use dynamic import to avoid bundling error tracking in dev
    import('./errorTracking').then(({ captureException }) => {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      captureException(errorObj, context ? { context } : undefined);
    }).catch(() => {
      // Fallback if error tracking fails
      console.error(`[${context || 'Error'}]`, errorMessage);
    });
  }
}

/**
 * Checks if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('timeout') ||
      message.includes('failed to fetch')
    );
  }
  return false;
}

/**
 * Checks if error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes('authenticated') ||
      message.includes('unauthorized') ||
      message.includes('401') ||
      message.includes('session')
    );
  }
  return false;
}
