/**
 * Production Configuration
 * Centralized production settings and feature flags
 */

import { validateEnvironment } from './envValidation';
import { initErrorTracking } from './errorTracking';

export interface ProductionConfig {
  errorTracking: {
    enabled: boolean;
    service?: 'sentry' | 'logrocket' | 'custom';
    dsn?: string;
  };
  analytics: {
    enabled: boolean;
  };
  performance: {
    enabled: boolean;
  };
}

/**
 * Initialize production configuration
 * Call this once at app startup
 */
export function initProductionConfig(): void {
  try {
    // Validate environment variables (warns in dev, throws in production)
    validateEnvironment();

    // Initialize error tracking if enabled
    const errorTrackingEnabled = !import.meta.env.DEV && import.meta.env.VITE_SENTRY_DSN;
    if (errorTrackingEnabled) {
      initErrorTracking({
        enabled: true,
        service: 'sentry',
        dsn: import.meta.env.VITE_SENTRY_DSN,
        environment: import.meta.env.VITE_APP_ENV || 'production',
        release: import.meta.env.VITE_APP_VERSION,
      });
    }

    if (import.meta.env.DEV) {
      console.log('[ProductionConfig] Initialized (dev mode)');
    }
  } catch (error) {
    // Don't crash the app if config fails, but log it
    console.error('[ProductionConfig] Initialization failed:', error);
    // In dev mode, allow app to continue (we have mocks)
    if (!import.meta.env.DEV) {
      // In production, we should fail
      throw error;
    }
  }
}

/**
 * Check if feature is enabled
 */
export function isFeatureEnabled(feature: string): boolean {
  const envKey = `VITE_FEATURE_${feature.toUpperCase()}`;
  const value = import.meta.env[envKey];
  return value === 'true' || value === '1';
}

/**
 * Get production config
 */
export function getProductionConfig(): ProductionConfig {
  return {
    errorTracking: {
      enabled: !import.meta.env.DEV && !!import.meta.env.VITE_SENTRY_DSN,
      service: 'sentry',
      dsn: import.meta.env.VITE_SENTRY_DSN,
    },
    analytics: {
      enabled: isFeatureEnabled('analytics'),
    },
    performance: {
      enabled: isFeatureEnabled('performance'),
    },
  };
}
