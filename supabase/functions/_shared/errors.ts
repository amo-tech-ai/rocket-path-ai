/**
 * Error Handling Utilities
 * Provides consistent error handling across Edge Functions
 */

import { corsHeaders } from './cors.ts';

// =============================================================================
// Error Types
// =============================================================================

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR');
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    const message = id ? `${resource} not found: ${id}` : `${resource} not found`;
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded. Please try again later.') {
    super(message, 429, 'RATE_LIMIT_ERROR');
    this.name = 'RateLimitError';
  }
}

export class AIError extends AppError {
  constructor(
    message: string,
    public provider: string,
    public model?: string,
    details?: unknown
  ) {
    super(message, 502, 'AI_ERROR', details);
    this.name = 'AIError';
  }
}

// =============================================================================
// Error Response Helpers
// =============================================================================

interface ErrorResponse {
  error: string;
  code?: string;
  details?: unknown;
  success: false;
}

/**
 * Create a JSON error response
 */
export function errorResponse(
  error: Error | AppError | string,
  statusCode?: number
): Response {
  let response: ErrorResponse;
  let status: number;

  if (error instanceof AppError) {
    response = {
      error: error.message,
      code: error.code,
      details: error.details,
      success: false,
    };
    status = statusCode || error.statusCode;
  } else if (error instanceof Error) {
    response = {
      error: error.message,
      success: false,
    };
    status = statusCode || 500;
  } else {
    response = {
      error: String(error),
      success: false,
    };
    status = statusCode || 500;
  }

  return new Response(JSON.stringify(response), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

/**
 * Create a JSON success response
 */
export function successResponse<T>(data: T, statusCode: number = 200): Response {
  return new Response(
    JSON.stringify({ ...data, success: true }),
    {
      status: statusCode,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

// =============================================================================
// Error Handling Wrapper
// =============================================================================

type HandlerFn = (req: Request) => Promise<Response>;

/**
 * Wrap an edge function handler with error handling
 */
export function withErrorHandling(handler: HandlerFn): HandlerFn {
  return async (req: Request): Promise<Response> => {
    try {
      return await handler(req);
    } catch (error) {
      console.error('Edge function error:', error);
      return errorResponse(error as Error);
    }
  };
}

/**
 * Wrap handler with CORS and error handling
 */
export function createHandler(handler: HandlerFn): HandlerFn {
  return async (req: Request): Promise<Response> => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    try {
      return await handler(req);
    } catch (error) {
      console.error('Edge function error:', error);
      return errorResponse(error as Error);
    }
  };
}

// =============================================================================
// Validation Helpers
// =============================================================================

/**
 * Validate required fields in request body
 */
export function validateRequired<T extends Record<string, unknown>>(
  body: T,
  requiredFields: (keyof T)[]
): void {
  const missing = requiredFields.filter(field => {
    const value = body[field];
    return value === undefined || value === null || value === '';
  });

  if (missing.length > 0) {
    throw new ValidationError(
      `Missing required fields: ${missing.join(', ')}`,
      { missing }
    );
  }
}

/**
 * Validate UUID format
 */
export function validateUUID(value: string, fieldName: string): void {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(value)) {
    throw new ValidationError(`Invalid UUID format for ${fieldName}`);
  }
}

/**
 * Validate enum value
 */
export function validateEnum<T extends string>(
  value: string,
  allowedValues: readonly T[],
  fieldName: string
): T {
  if (!allowedValues.includes(value as T)) {
    throw new ValidationError(
      `Invalid value for ${fieldName}. Must be one of: ${allowedValues.join(', ')}`,
      { value, allowed: allowedValues }
    );
  }
  return value as T;
}

/**
 * Validate numeric range
 */
export function validateRange(
  value: number,
  min: number,
  max: number,
  fieldName: string
): void {
  if (value < min || value > max) {
    throw new ValidationError(
      `${fieldName} must be between ${min} and ${max}`,
      { value, min, max }
    );
  }
}
