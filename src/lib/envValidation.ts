/**
 * Environment Variable Validation
 * Validates required environment variables at startup
 */

interface EnvConfig {
  required: string[];
  optional: string[];
  defaults?: Record<string, string>;
}

const ENV_CONFIG: EnvConfig = {
  required: [
    'VITE_SUPABASE_URL',
    // Accept either ANON_KEY or PUBLISHABLE_KEY (they're the same)
    'VITE_SUPABASE_ANON_KEY',
    'VITE_SUPABASE_PUBLISHABLE_KEY',
  ],
  optional: [
    'VITE_APP_URL',
    'VITE_SENTRY_DSN',
    'VITE_LOGROCKET_APP_ID',
    'VITE_APP_ENV',
    'VITE_APP_VERSION',
  ],
  defaults: {
    VITE_APP_ENV: 'development',
  },
};

/**
 * Validates environment variables
 * In dev mode: warns instead of throwing (allows dev mode mocks)
 * In production: throws error if required variables are missing
 */
export function validateEnvironment(): void {
  const missing: string[] = [];
  const warnings: string[] = [];
  const isDev = import.meta.env.DEV;

  // Check Supabase URL (always required)
  if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.trim() === '') {
    missing.push('VITE_SUPABASE_URL');
  }

  // Check Supabase key (accept either ANON_KEY or PUBLISHABLE_KEY)
  const hasAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY && import.meta.env.VITE_SUPABASE_ANON_KEY.trim() !== '';
  const hasPublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY.trim() !== '';
  
  if (!hasAnonKey && !hasPublishableKey) {
    missing.push('VITE_SUPABASE_ANON_KEY or VITE_SUPABASE_PUBLISHABLE_KEY');
  }

  // Check optional variables (warn if missing in production)
  if (!isDev) {
    for (const key of ENV_CONFIG.optional) {
      const value = import.meta.env[key];
      if (!value || value.trim() === '') {
        warnings.push(key);
      }
    }
  }

  // In dev mode: warn instead of throw (allows dev mode mocks to work)
  if (missing.length > 0) {
    if (isDev) {
      console.warn(
        '[EnvValidation] Missing environment variables (dev mode - using mocks):',
        missing.join(', ')
      );
      // Don't throw in dev mode - allow app to continue with mocks
      return;
    } else {
      // In production: throw error
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}\n` +
        'Please check your .env file or environment configuration.'
      );
    }
  }

  // Log warnings in development
  if (isDev && warnings.length > 0) {
    console.warn(
      '[EnvValidation] Optional environment variables not set:',
      warnings.join(', ')
    );
  }
}

/**
 * Gets environment variable with fallback
 */
export function getEnv(key: string, fallback?: string): string {
  const value = import.meta.env[key];
  if (value) return value;
  
  if (fallback !== undefined) return fallback;
  
  const defaultValue = ENV_CONFIG.defaults?.[key];
  if (defaultValue) return defaultValue;
  
  throw new Error(`Environment variable ${key} is required but not set`);
}

/**
 * Gets boolean environment variable
 */
export function getEnvBoolean(key: string, fallback = false): boolean {
  const value = import.meta.env[key];
  if (!value) return fallback;
  
  return value.toLowerCase() === 'true' || value === '1';
}

/**
 * Gets number environment variable
 */
export function getEnvNumber(key: string, fallback?: number): number {
  const value = import.meta.env[key];
  if (!value) {
    if (fallback !== undefined) return fallback;
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  
  const num = Number(value);
  if (isNaN(num)) {
    if (fallback !== undefined) return fallback;
    throw new Error(`Environment variable ${key} must be a number`);
  }
  
  return num;
}
