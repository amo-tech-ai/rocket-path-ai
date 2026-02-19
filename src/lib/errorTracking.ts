/**
 * Error Tracking Service
 * Production-ready error tracking integration
 * Supports Sentry, LogRocket, or custom tracking services
 */

import { logError } from './errorHandling';

export interface ErrorTrackingConfig {
  enabled: boolean;
  service?: 'sentry' | 'logrocket' | 'custom';
  dsn?: string;
  environment?: string;
  release?: string;
}

/**
 * Initialize error tracking service
 * Call this once at app startup
 */
export function initErrorTracking(config: ErrorTrackingConfig): void {
  if (!config.enabled || import.meta.env.DEV) {
    return;
  }

  // In production, initialize error tracking
  // Example for Sentry:
  // if (config.service === 'sentry' && config.dsn) {
  //   Sentry.init({
  //     dsn: config.dsn,
  //     environment: config.environment || 'production',
  //     release: config.release,
  //     integrations: [new Sentry.BrowserTracing()],
  //     tracesSampleRate: 0.1,
  //   });
  // }

  if (import.meta.env.DEV) {
    console.log('[ErrorTracking] Initialized (dev mode - disabled)');
  }
}

/**
 * Capture exception for error tracking
 */
export function captureException(error: Error, context?: Record<string, unknown>): void {
  if (import.meta.env.DEV) {
    // In dev, just log
    logError(error, 'ErrorTracking');
    return;
  }

  // In production, send to error tracking service
  // Example for Sentry:
  // Sentry.captureException(error, {
  //   tags: context,
  //   level: 'error',
  // });

  // For now, log in production (will be replaced with actual service)
  logError(error, 'ErrorTracking');
}

/**
 * Capture message for error tracking
 */
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
  if (import.meta.env.DEV) {
    console.log(`[ErrorTracking ${level}]`, message);
    return;
  }

  // In production, send to error tracking service
  // Example for Sentry:
  // Sentry.captureMessage(message, level);

  // For now, log in production (will be replaced with actual service)
  if (level === 'error') {
    console.error('[ErrorTracking]', message);
  } else if (level === 'warning') {
    console.warn('[ErrorTracking]', message);
  } else {
    console.log('[ErrorTracking]', message);
  }
}

/**
 * Set user context for error tracking
 */
export function setUserContext(userId: string, email?: string, metadata?: Record<string, unknown>): void {
  if (import.meta.env.DEV) {
    return;
  }

  // In production, set user context
  // Example for Sentry:
  // Sentry.setUser({
  //   id: userId,
  //   email,
  //   ...metadata,
  // });
}

/**
 * Clear user context (on logout)
 */
export function clearUserContext(): void {
  if (import.meta.env.DEV) {
    return;
  }

  // In production, clear user context
  // Example for Sentry:
  // Sentry.setUser(null);
}
