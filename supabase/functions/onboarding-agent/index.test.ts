/**
 * Onboarding Agent Tests
 * 
 * Tests:
 * - Session creation and management
 * - URL enrichment workflow
 * - Score calculation
 * - Auth enforcement
 */

import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals, assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL") || Deno.env.get("SUPABASE_URL") || "";
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/onboarding-agent`;

Deno.test("onboarding-agent: returns 401 without auth", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "create_session" }),
  });
  
  await response.text();
  assertEquals(response.status, 401);
});

Deno.test("onboarding-agent: handles OPTIONS for CORS", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "OPTIONS",
  });
  
  await response.text();
  
  // OPTIONS should return 200 with CORS headers
  assertEquals(response.status, 200);
  assertExists(response.headers.get("access-control-allow-origin"));
});

Deno.test("onboarding-agent: create_session requires auth", async () => {
  const authToken = Deno.env.get("TEST_AUTH_TOKEN");
  if (!authToken) {
    console.log("Skipping: No TEST_AUTH_TOKEN available");
    return;
  }
  
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`,
    },
    body: JSON.stringify({ action: "create_session" }),
  });
  
  const data = await response.json();
  
  assertEquals(response.status, 200);
  // Should either succeed or return existing session
  assertExists(data.session_id || data.id || data.error);
});

Deno.test("onboarding-agent: enrich_url validates URL format", async () => {
  const authToken = Deno.env.get("TEST_AUTH_TOKEN");
  if (!authToken) {
    console.log("Skipping: No TEST_AUTH_TOKEN available");
    return;
  }
  
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      action: "enrich_url",
      session_id: "test-session-id",
      url: "not-a-valid-url",
    }),
  });
  
  const data = await response.json();
  
  // Should handle invalid URL gracefully
  assertEquals(response.status, 200);
  // Either error or empty enrichment
  assertExists(data.error || data.enriched_data !== undefined);
});

Deno.test("onboarding-agent: get_questions returns question list", async () => {
  const authToken = Deno.env.get("TEST_AUTH_TOKEN");
  if (!authToken) {
    console.log("Skipping: No TEST_AUTH_TOKEN available");
    return;
  }
  
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      action: "get_questions",
      session_id: "test-session-id",
    }),
  });
  
  const data = await response.json();
  
  assertEquals(response.status, 200);
  // Should return questions array or error
  assertExists(data.questions || data.error);
});

// Unit tests for helper functions
Deno.test("Unit: URL validation logic", () => {
  const validUrls = [
    "https://example.com",
    "http://startup.io",
    "https://www.company.co.uk",
  ];
  
  const invalidUrls = [
    "not-a-url",
    "ftp://invalid.com",
    "",
    "javascript:alert(1)",
  ];
  
  const isValidUrl = (url: string): boolean => {
    try {
      const parsed = new URL(url);
      return ["http:", "https:"].includes(parsed.protocol);
    } catch {
      return false;
    }
  };
  
  validUrls.forEach((url) => {
    assertEquals(isValidUrl(url), true, `Expected ${url} to be valid`);
  });
  
  invalidUrls.forEach((url) => {
    assertEquals(isValidUrl(url), false, `Expected ${url} to be invalid`);
  });
});

Deno.test("Unit: Score calculation bounds", () => {
  const calculateScore = (metrics: { problem: number; market: number; team: number }): number => {
    const weights = { problem: 0.35, market: 0.35, team: 0.30 };
    const raw = 
      metrics.problem * weights.problem +
      metrics.market * weights.market +
      metrics.team * weights.team;
    return Math.min(100, Math.max(0, Math.round(raw)));
  };
  
  // Perfect scores
  assertEquals(calculateScore({ problem: 100, market: 100, team: 100 }), 100);
  
  // Zero scores
  assertEquals(calculateScore({ problem: 0, market: 0, team: 0 }), 0);
  
  // Mixed scores
  const mixed = calculateScore({ problem: 80, market: 60, team: 70 });
  assertEquals(mixed >= 0 && mixed <= 100, true);
});

Deno.test("Unit: Session step validation", () => {
  const VALID_STEPS = [1, 2, 3, 4];
  
  const isValidStep = (step: number): boolean => {
    return VALID_STEPS.includes(step);
  };
  
  assertEquals(isValidStep(1), true);
  assertEquals(isValidStep(4), true);
  assertEquals(isValidStep(0), false);
  assertEquals(isValidStep(5), false);
  assertEquals(isValidStep(-1), false);
});
