/**
 * Error Handling Tests
 * Unit tests for error handling utilities
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  withRetry,
  getUserFriendlyError,
  isNetworkError,
  isAuthError,
} from '../lib/errorHandling';

describe('errorHandling', () => {
  describe('withRetry', () => {
    it('should succeed on first attempt', async () => {
      const fn = vi.fn().mockResolvedValue('success');
      const result = await withRetry(fn);
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should retry on network error', async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce('success');
      
      const result = await withRetry(fn, { maxRetries: 2, retryDelay: 10 });
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should throw after max retries', async () => {
      const error = new Error('Network error');
      const fn = vi.fn().mockRejectedValue(error);
      
      await expect(withRetry(fn, { maxRetries: 2, retryDelay: 10 })).rejects.toThrow('Network error');
      expect(fn).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });

    it('should not retry non-retryable errors', async () => {
      const error = new Error('Validation error');
      const fn = vi.fn().mockRejectedValue(error);
      
      await expect(withRetry(fn, { maxRetries: 2, retryDelay: 10 })).rejects.toThrow('Validation error');
      expect(fn).toHaveBeenCalledTimes(1); // No retries
    });
  });

  describe('getUserFriendlyError', () => {
    it('should return friendly message for network error', () => {
      const error = new Error('Network request failed');
      expect(getUserFriendlyError(error)).toContain('Network connection');
    });

    it('should return friendly message for timeout', () => {
      const error = new Error('Request timeout');
      expect(getUserFriendlyError(error)).toContain('timed out');
    });

    it('should return friendly message for auth error', () => {
      const error = new Error('User not authenticated');
      expect(getUserFriendlyError(error)).toContain('session has expired');
    });

    it('should return default message for unknown error', () => {
      const error = new Error('Unknown error');
      expect(getUserFriendlyError(error)).toBe('Unknown error');
    });

    it('should handle non-Error objects', () => {
      expect(getUserFriendlyError('string error')).toContain('unexpected error');
    });
  });

  describe('isNetworkError', () => {
    it('should detect network errors', () => {
      expect(isNetworkError(new Error('Network error'))).toBe(true);
      expect(isNetworkError(new Error('fetch failed'))).toBe(true);
      expect(isNetworkError(new Error('timeout'))).toBe(true);
    });

    it('should not detect non-network errors', () => {
      expect(isNetworkError(new Error('Validation error'))).toBe(false);
      expect(isNetworkError(new Error('Auth error'))).toBe(false);
    });
  });

  describe('isAuthError', () => {
    it('should detect auth errors', () => {
      expect(isAuthError(new Error('User not authenticated'))).toBe(true);
      expect(isAuthError(new Error('Unauthorized'))).toBe(true);
      expect(isAuthError(new Error('401'))).toBe(true);
    });

    it('should not detect non-auth errors', () => {
      expect(isAuthError(new Error('Network error'))).toBe(false);
      expect(isAuthError(new Error('Validation error'))).toBe(false);
    });
  });
});
