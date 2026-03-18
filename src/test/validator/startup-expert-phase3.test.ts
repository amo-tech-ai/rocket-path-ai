import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Phase 3 tests: screen overlays, SCREEN_DOMAINS, CORS, public rate limiting
 */

const expertFile = readFileSync(
  resolve(__dirname, '../../../supabase/functions/_shared/startup-expert.ts'),
  'utf-8'
);

const chatFile = readFileSync(
  resolve(__dirname, '../../../supabase/functions/ai-chat/index.ts'),
  'utf-8'
);

describe('Phase 3a: New Screen Overlays', () => {
  it('has /market-research overlay', () => {
    expect(expertFile).toContain("'/market-research'");
    expect(expertFile).toContain('SCREEN FOCUS: Market Research Hub');
    expect(expertFile).toContain('bottom-up sizing');
    expect(expertFile).toContain("Porter's Five Forces");
  });

  it('has /investors overlay', () => {
    expect(expertFile).toContain("'/investors'");
    expect(expertFile).toContain('SCREEN FOCUS: Investor Pipeline');
    expect(expertFile).toContain('MEDDPICC');
    expect(expertFile).toContain('signal strength');
  });

  it('has /experiments overlay', () => {
    expect(expertFile).toContain("'/experiments'");
    expect(expertFile).toContain('SCREEN FOCUS: Experiments Lab');
    expect(expertFile).toContain('SMART goal');
    expect(expertFile).toContain('pass/fail thresholds');
  });

  it('total screen overlays is 11', () => {
    const overlayMatches = expertFile.match(/SCREEN FOCUS:/g) || [];
    expect(overlayMatches.length).toBe(11);
  });
});

describe('Phase 3a: Narrowed /crm overlay', () => {
  it('/crm focuses on customer CRM, not investors', () => {
    expect(expertFile).toContain('SCREEN FOCUS: CRM / Contacts');
    expect(expertFile).toContain('redirect to the Investors page');
  });

  it('/crm redirects investor pipeline to /investors', () => {
    expect(expertFile).toContain('redirect to the Investors page');
  });
});

describe('Phase 3b: gtm_strategy wiring', () => {
  it('/sprint-plan includes gtm_strategy domain', () => {
    expect(expertFile).toContain("'/sprint-plan': ['experiments', 'gtm_strategy']");
  });

  it('/lean-canvas includes gtm_strategy domain', () => {
    expect(expertFile).toContain("'/lean-canvas': ['market_sizing', 'competitive_strategy', 'gtm_strategy']");
  });
});

describe('Phase 3c: Public rate limiting', () => {
  it('has public mode rate limiting by IP', () => {
    expect(chatFile).toContain('public:${clientIp}');
    expect(chatFile).toContain('ai-chat-public');
  });

  it('uses x-forwarded-for header', () => {
    expect(chatFile).toContain('x-forwarded-for');
  });

  it('falls back to x-real-ip', () => {
    expect(chatFile).toContain('x-real-ip');
  });

  it('uses light rate limit tier for public', () => {
    expect(chatFile).toContain('RATE_LIMITS.light');
  });
});

describe('Phase 3d: CORS standardization', () => {
  it('no static corsHeaders in response headers (all use getCorsHeaders)', () => {
    // Should NOT contain "...corsHeaders," (static) in response headers
    // Should contain "...getCorsHeaders(req)," (dynamic)
    const staticPattern = /\.\.\.\s*corsHeaders\s*,\s*'Content-Type'/;
    expect(staticPattern.test(chatFile)).toBe(false);
  });

  it('all responses use getCorsHeaders(req)', () => {
    const dynamicCount = (chatFile.match(/getCorsHeaders\(req\)/g) || []).length;
    expect(dynamicCount).toBeGreaterThan(10);
  });
});
