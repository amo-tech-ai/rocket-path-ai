/**
 * Development Configuration
 * Centralized dev flags and settings
 *
 * SECURITY: DEV_BYPASS_AUTH is only available in Vite dev mode (import.meta.env.DEV).
 * Vite statically replaces import.meta.env.DEV with `false` in production builds,
 * so the entire bypass block is dead-code-eliminated by the bundler.
 * Additionally requires the explicit env var VITE_DEV_BYPASS_AUTH=true.
 */

// Only true when: (1) Vite dev server AND (2) explicit env var set
// In production builds, import.meta.env.DEV is replaced with `false` at compile time,
// making this constant `false` and allowing tree-shaking of all dev-only code paths.
export const DEV_BYPASS_AUTH: boolean =
  import.meta.env.DEV === true &&
  import.meta.env.VITE_DEV_BYPASS_AUTH === 'true';

// Runtime safety net — should never trigger since DEV is false in prod builds
if (import.meta.env.PROD && DEV_BYPASS_AUTH) {
  throw new Error('SECURITY ERROR: Auth bypass detected in production build. This should be impossible.');
}

// Mock user ID for development (consistent across sessions)
export const DEV_MOCK_USER_ID = '00000000-0000-0000-0000-000000000000';
