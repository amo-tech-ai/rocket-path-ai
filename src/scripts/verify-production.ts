/**
 * Production Verification Script
 * Validates production readiness before deployment
 */

import { validateEnvironment } from '../lib/envValidation';
import { getProductionConfig } from '../lib/productionConfig';

interface VerificationResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Verifies production readiness
 */
export function verifyProduction(): VerificationResult {
  const result: VerificationResult = {
    passed: true,
    errors: [],
    warnings: [],
  };

  try {
    // 1. Validate environment variables
    try {
      validateEnvironment();
    } catch (error) {
      result.passed = false;
      result.errors.push(`Environment validation failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    // 2. Check production config
    const config = getProductionConfig();
    if (!config.errorTracking.enabled && !import.meta.env.DEV) {
      result.warnings.push('Error tracking is not enabled in production');
    }

    // 3. Verify critical features
    if (import.meta.env.DEV) {
      result.warnings.push('Running in development mode');
    }

    return result;
  } catch (error) {
    result.passed = false;
    result.errors.push(`Verification failed: ${error instanceof Error ? error.message : String(error)}`);
    return result;
  }
}

// Run verification if executed directly
if (import.meta.env.DEV && typeof window === 'undefined') {
  const result = verifyProduction();
  console.log('Production Verification:', result);
  if (!result.passed) {
    process.exit(1);
  }
}
