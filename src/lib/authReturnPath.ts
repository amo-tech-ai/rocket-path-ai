/**
 * Auth return path — single source of truth for post-login redirect.
 * Survives OAuth + onboarding; clear after successful navigation.
 *
 * @see tasks/data/auth-setup/03-auth-setup-checklist.md
 */

export const AUTH_RETURN_KEY = 'auth:returnPath';

/** Set return path only if empty (don't overwrite existing intent). */
export function setReturnPathOnce(path: string): void {
  if (!path || typeof path !== 'string') return;
  if (!sessionStorage.getItem(AUTH_RETURN_KEY)) {
    sessionStorage.setItem(AUTH_RETURN_KEY, path);
  }
}

export function getReturnPath(): string | null {
  return sessionStorage.getItem(AUTH_RETURN_KEY);
}

export function clearReturnPath(): void {
  sessionStorage.removeItem(AUTH_RETURN_KEY);
}

/** Validate path to prevent open redirect. Allow: /validate?hasIdea=true. Deny: //evil.com, https://evil.com */
export function isValidReturnPath(path: string | null): path is string {
  if (!path || typeof path !== 'string') return false;
  return (
    path.startsWith('/') &&
    !path.startsWith('//') &&
    !path.includes('://')
  );
}
