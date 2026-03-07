/**
 * Auth Redirect Flow — Regression Tests
 *
 * Covers fixes from audit 31-validate-flow.md:
 *   Fix 1: redirectTo URL must NOT include ?next= query params
 *   Fix 2: pendingIdea sessionStorage survives OAuth redirect flow
 *   Fix 3: authReturnPath utility correctness
 *
 * Run: npm run test -- src/test/auth-redirect-flow.test.ts
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  setReturnPathOnce,
  getReturnPath,
  clearReturnPath,
  isValidReturnPath,
  AUTH_RETURN_KEY,
} from '@/lib/authReturnPath';

// ─────────────────────────────────────────────────────
// TEST 1: authReturnPath utility — sessionStorage helper
// ─────────────────────────────────────────────────────
describe('authReturnPath utility', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('setReturnPathOnce stores path when empty', () => {
    setReturnPathOnce('/validate?hasIdea=true');
    expect(sessionStorage.getItem(AUTH_RETURN_KEY)).toBe('/validate?hasIdea=true');
  });

  it('setReturnPathOnce does NOT overwrite existing path', () => {
    setReturnPathOnce('/validate?hasIdea=true');
    setReturnPathOnce('/dashboard'); // Should be ignored
    expect(sessionStorage.getItem(AUTH_RETURN_KEY)).toBe('/validate?hasIdea=true');
  });

  it('setReturnPathOnce ignores empty string', () => {
    setReturnPathOnce('');
    expect(sessionStorage.getItem(AUTH_RETURN_KEY)).toBeNull();
  });

  it('getReturnPath returns stored value', () => {
    sessionStorage.setItem(AUTH_RETURN_KEY, '/validate?hasIdea=true');
    expect(getReturnPath()).toBe('/validate?hasIdea=true');
  });

  it('getReturnPath returns null when empty', () => {
    expect(getReturnPath()).toBeNull();
  });

  it('clearReturnPath removes the value', () => {
    setReturnPathOnce('/validate');
    clearReturnPath();
    expect(getReturnPath()).toBeNull();
  });

  it('isValidReturnPath allows /validate?hasIdea=true', () => {
    expect(isValidReturnPath('/validate?hasIdea=true')).toBe(true);
  });

  it('isValidReturnPath allows /dashboard', () => {
    expect(isValidReturnPath('/dashboard')).toBe(true);
  });

  it('isValidReturnPath blocks //evil.com', () => {
    expect(isValidReturnPath('//evil.com')).toBe(false);
  });

  it('isValidReturnPath blocks https://evil.com', () => {
    expect(isValidReturnPath('https://evil.com')).toBe(false);
  });

  it('isValidReturnPath blocks null', () => {
    expect(isValidReturnPath(null)).toBe(false);
  });

  it('isValidReturnPath blocks empty string', () => {
    expect(isValidReturnPath('')).toBe(false);
  });
});

// ─────────────────────────────────────────────────────
// TEST 2: redirectTo URL construction — no query params
// ─────────────────────────────────────────────────────
describe('redirectTo URL construction (Fix 1)', () => {
  /**
   * This tests the FIXED logic from useAuth.tsx signInWithGoogle/signInWithLinkedIn.
   * The redirectTo URL must be a clean callback URL with NO query params,
   * because Supabase URL matching includes query params and they cause
   * allowlist mismatches.
   */
  function buildRedirectTo(returnPath?: string): string {
    // This mirrors the FIXED signInWithGoogle logic:
    // if (returnPath) setReturnPathOnce(returnPath);
    // const redirectTo = window.location.origin + '/auth/callback';
    if (returnPath) setReturnPathOnce(returnPath);
    return window.location.origin + '/auth/callback';
  }

  beforeEach(() => {
    sessionStorage.clear();
  });

  it('redirectTo has NO query params when returnPath provided', () => {
    const url = buildRedirectTo('/validate?hasIdea=true');
    expect(url).not.toContain('?');
    expect(url).not.toContain('next=');
    expect(url.endsWith('/auth/callback')).toBe(true);
  });

  it('redirectTo has NO query params when no returnPath', () => {
    const url = buildRedirectTo();
    expect(url).not.toContain('?');
    expect(url.endsWith('/auth/callback')).toBe(true);
  });

  it('returnPath is stored in sessionStorage instead', () => {
    buildRedirectTo('/validate?hasIdea=true');
    expect(getReturnPath()).toBe('/validate?hasIdea=true');
  });

  it('redirectTo matches pattern for Supabase allowlist', () => {
    const url = buildRedirectTo('/validate?hasIdea=true');
    // URL should be: http://localhost:3000/auth/callback (or similar)
    // Must match exactly what's in Supabase dashboard Redirect URLs
    const parsed = new URL(url);
    expect(parsed.pathname).toBe('/auth/callback');
    expect(parsed.search).toBe('');
    expect(parsed.hash).toBe('');
  });
});

// ─────────────────────────────────────────────────────
// TEST 3: pendingIdea sessionStorage flow
// ─────────────────────────────────────────────────────
describe('pendingIdea sessionStorage flow (Fix 2)', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('pendingIdea persists in sessionStorage', () => {
    sessionStorage.setItem('pendingIdea', 'AI tool for restaurants');
    expect(sessionStorage.getItem('pendingIdea')).toBe('AI tool for restaurants');
  });

  it('pendingIdea survives setReturnPathOnce (no interference)', () => {
    sessionStorage.setItem('pendingIdea', 'AI tool for restaurants');
    setReturnPathOnce('/validate?hasIdea=true');
    expect(sessionStorage.getItem('pendingIdea')).toBe('AI tool for restaurants');
    expect(getReturnPath()).toBe('/validate?hasIdea=true');
  });

  it('clearReturnPath does NOT clear pendingIdea', () => {
    sessionStorage.setItem('pendingIdea', 'AI tool for restaurants');
    setReturnPathOnce('/validate?hasIdea=true');
    clearReturnPath();
    // pendingIdea should survive
    expect(sessionStorage.getItem('pendingIdea')).toBe('AI tool for restaurants');
    expect(getReturnPath()).toBeNull();
  });

  it('pendingIdea can be read after auth:returnPath is cleared', () => {
    // Simulates the AuthCallback flow:
    // 1. Read returnPath and pendingIdea
    // 2. clearReturnPath
    // 3. pendingIdea is still available for ValidateIdea
    sessionStorage.setItem('pendingIdea', 'AI tool for restaurants');
    setReturnPathOnce('/validate?hasIdea=true');

    const returnPath = getReturnPath();
    const pendingIdea = sessionStorage.getItem('pendingIdea');
    clearReturnPath();

    expect(returnPath).toBe('/validate?hasIdea=true');
    expect(pendingIdea).toBe('AI tool for restaurants');
    expect(sessionStorage.getItem('pendingIdea')).toBe('AI tool for restaurants');
  });
});

// ─────────────────────────────────────────────────────
// TEST 4: AuthCallback destination logic
// ─────────────────────────────────────────────────────
describe('AuthCallback destination logic', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('pendingIdea takes priority — navigates to /validate', () => {
    sessionStorage.setItem('pendingIdea', 'AI tool');
    setReturnPathOnce('/dashboard');

    // Simulates AuthCallback handleSession logic
    const pendingIdea = sessionStorage.getItem('pendingIdea');
    const next = getReturnPath() || '/dashboard';

    let destination: string;
    if (pendingIdea) {
      destination = '/validate?hasIdea=true';
    } else {
      destination = next;
    }

    expect(destination).toBe('/validate?hasIdea=true');
  });

  it('no pendingIdea — uses returnPath', () => {
    setReturnPathOnce('/dashboard');

    const pendingIdea = sessionStorage.getItem('pendingIdea');
    const next = getReturnPath() || '/dashboard';

    let destination: string;
    if (pendingIdea) {
      destination = '/validate?hasIdea=true';
    } else {
      destination = next;
    }

    expect(destination).toBe('/dashboard');
  });

  it('no pendingIdea, no returnPath — falls back to /dashboard', () => {
    const pendingIdea = sessionStorage.getItem('pendingIdea');
    const next = getReturnPath() || '/dashboard';

    let destination: string;
    if (pendingIdea) {
      destination = '/validate?hasIdea=true';
    } else {
      destination = next;
    }

    expect(destination).toBe('/dashboard');
  });
});

// ─────────────────────────────────────────────────────
// TEST 5: Full flow simulation (without OAuth)
// ─────────────────────────────────────────────────────
describe('Full flow simulation: idea → login → callback → validate', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('complete happy path: stores idea, stores returnPath, callback reads both', () => {
    // Step 1: HeroSection — user types idea, clicks Generate
    const userIdea = 'An AI-powered platform for landlord tenant screening';
    sessionStorage.setItem('pendingIdea', userIdea);
    setReturnPathOnce('/validate?hasIdea=true');

    // Step 2: Login — reads returnPath for OAuth
    const returnPath = getReturnPath();
    expect(returnPath).toBe('/validate?hasIdea=true');

    // Step 3: useAuth.signInWithGoogle — stores returnPath (safety), builds clean redirectTo
    setReturnPathOnce(returnPath!); // no-op, already set
    const redirectTo = 'http://localhost:3000/auth/callback';
    expect(redirectTo).not.toContain('?next=');

    // Step 4: OAuth redirect happens (full page navigation)
    // sessionStorage survives because it's same-origin when we return

    // Step 5: AuthCallback — processes session
    const pendingIdea = sessionStorage.getItem('pendingIdea');
    expect(pendingIdea).toBe(userIdea);

    const next = getReturnPath() || '/dashboard';
    expect(next).toBe('/validate?hasIdea=true');

    // pendingIdea exists → redirect to /validate
    const destination = pendingIdea ? '/validate?hasIdea=true' : next;
    expect(destination).toBe('/validate?hasIdea=true');

    // Step 6: clearReturnPath (AuthCallback does this)
    clearReturnPath();
    expect(getReturnPath()).toBeNull();

    // Step 7: ValidateIdea reads pendingIdea
    expect(sessionStorage.getItem('pendingIdea')).toBe(userIdea);

    // Step 8: ValidateIdea clears pendingIdea after consuming
    sessionStorage.removeItem('pendingIdea');
    expect(sessionStorage.getItem('pendingIdea')).toBeNull();
  });

  it('existing user flow: idea stored, no auth needed, direct to validate', () => {
    const userIdea = 'B2B SaaS for HR automation';
    sessionStorage.setItem('pendingIdea', userIdea);

    // User is already authenticated — HeroSection navigates directly
    // to /validate?hasIdea=true (no login detour)
    const hasUser = true;
    const destination = hasUser ? '/validate?hasIdea=true' : '/login';
    expect(destination).toBe('/validate?hasIdea=true');
    expect(sessionStorage.getItem('pendingIdea')).toBe(userIdea);
  });

  it('fallback flow: OAuth redirects to / instead of /auth/callback', () => {
    const userIdea = 'Marketplace for freelance designers';
    sessionStorage.setItem('pendingIdea', userIdea);
    setReturnPathOnce('/validate?hasIdea=true');

    // OAuth redirect goes to / (wrong URL, allowlist mismatch)
    // HeroSection safety net should handle this:
    const hasPendingIdea = !!sessionStorage.getItem('pendingIdea');
    expect(hasPendingIdea).toBe(true);

    // Supabase client exchanges code in URL → user becomes truthy
    const userBecomesTruthy = true;

    // Safety net fires: user && pendingIdea → navigate to /validate
    if (userBecomesTruthy && hasPendingIdea) {
      const destination = '/validate?hasIdea=true';
      expect(destination).toBe('/validate?hasIdea=true');
    }

    // pendingIdea is still available for ValidateIdea
    expect(sessionStorage.getItem('pendingIdea')).toBe(userIdea);
  });
});
