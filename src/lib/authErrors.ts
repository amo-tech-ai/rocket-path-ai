/**
 * Auth Error Handling Utilities
 * Maps Supabase Auth error codes to user-friendly messages
 *
 * Best Practice: Use error.code instead of string matching on messages
 * Reference: https://supabase.com/docs/guides/auth/debugging/error-codes
 */

import type { AuthError } from '@supabase/supabase-js';

/**
 * Supabase Auth error codes mapped to user-friendly messages
 */
export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  // PKCE Flow errors
  bad_code_verifier: 'Authentication verification failed. Please clear your browser cache and try again.',
  flow_state_expired: 'Your sign-in session has expired. Please try again.',
  flow_state_not_found: 'Sign-in session not found. Please start over.',

  // Rate limiting
  over_request_rate_limit: 'Too many sign-in attempts. Please wait a few minutes before trying again.',
  over_email_send_rate_limit: 'Too many emails sent. Please wait before requesting another.',

  // Credential errors
  invalid_credentials: 'Invalid email or password. Please check your credentials.',
  user_not_found: 'No account found with this email address.',
  email_not_confirmed: 'Please verify your email address before signing in.',

  // Session errors
  session_not_found: 'Your session has expired. Please sign in again.',
  refresh_token_not_found: 'Session refresh failed. Please sign in again.',

  // OAuth errors
  provider_disabled: 'This sign-in method is temporarily unavailable.',
  unexpected_failure: 'An unexpected error occurred. Please try again.',

  // Account errors
  user_already_exists: 'An account with this email already exists.',
  email_exists: 'This email is already registered.',

  // Validation errors
  validation_failed: 'Please check your input and try again.',
  weak_password: 'Please choose a stronger password.',
};

/**
 * Get user-friendly error message from AuthError
 * Uses error.code for reliable error identification
 */
export function getAuthErrorMessage(error: AuthError | Error | unknown): string {
  if (!error) {
    return 'An unexpected error occurred. Please try again.';
  }

  // Check for AuthError with code property
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const authError = error as AuthError;
    const code = authError.code;

    if (code && AUTH_ERROR_MESSAGES[code]) {
      return AUTH_ERROR_MESSAGES[code];
    }
  }

  // Check for status property (HTTP status codes)
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const status = (error as { status: number }).status;

    if (status === 429) {
      return AUTH_ERROR_MESSAGES.over_request_rate_limit;
    }
    if (status === 401) {
      return 'Your session has expired. Please sign in again.';
    }
    if (status === 403) {
      return 'You do not have permission to perform this action.';
    }
    if (status >= 500) {
      return 'Our servers are temporarily unavailable. Please try again in a moment.';
    }
  }

  // Fallback to message if available
  if (error instanceof Error && error.message) {
    // Don't expose raw error messages to users - return generic message
    return 'An authentication error occurred. Please try again.';
  }

  return 'An unexpected error occurred. Please try again.';
}

/**
 * Check if error is a rate limit error
 */
export function isRateLimitError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;

  const authError = error as AuthError;

  // Check error code
  if (authError.code === 'over_request_rate_limit' ||
      authError.code === 'over_email_send_rate_limit') {
    return true;
  }

  // Check HTTP status
  if ('status' in authError && authError.status === 429) {
    return true;
  }

  return false;
}

/**
 * Check if error is a PKCE flow error
 */
export function isPKCEError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;

  const authError = error as AuthError;

  return (
    authError.code === 'bad_code_verifier' ||
    authError.code === 'flow_state_expired' ||
    authError.code === 'flow_state_not_found'
  );
}

/**
 * Check if error is a session error requiring re-authentication
 */
export function isSessionError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;

  const authError = error as AuthError;

  return (
    authError.code === 'session_not_found' ||
    authError.code === 'refresh_token_not_found' ||
    ('status' in authError && authError.status === 401)
  );
}
