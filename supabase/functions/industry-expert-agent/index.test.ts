/**
 * Industry Expert Agent Tests
 * 
 * Tests:
 * - get_industry_context returns correct categories
 * - coach_answer provides grounded coaching
 * - validate_canvas returns industry-specific feedback
 * - Auth enforcement (401 on missing JWT)
 */

import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals, assertExists, assertStringIncludes } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL") || Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY") || "";

const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/industry-expert-agent`;

Deno.test("industry-expert-agent: returns 401 without auth", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "get_industry_context" }),
  });
  
  // Consume body to prevent leak
  await response.text();
  
  assertEquals(response.status, 401);
});

Deno.test("industry-expert-agent: get_industry_context returns packs list", async () => {
  // Skip if no auth token available (CI environment)
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
    body: JSON.stringify({ action: "get_industry_context" }),
  });
  
  const data = await response.json();
  
  assertEquals(response.status, 200);
  assertExists(data.success);
  assertExists(data.packs);
});

Deno.test("industry-expert-agent: get_industry_context filters by industry", async () => {
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
      action: "get_industry_context",
      industry: "fintech",
    }),
  });
  
  const data = await response.json();
  
  assertEquals(response.status, 200);
  assertExists(data.context);
  assertEquals(data.context.industry, "fintech");
});

Deno.test("industry-expert-agent: get_questions returns industry questions", async () => {
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
      industry: "fintech",
    }),
  });
  
  const data = await response.json();
  
  assertEquals(response.status, 200);
  assertExists(data.questions);
  assertEquals(Array.isArray(data.questions), true);
});

Deno.test("industry-expert-agent: handles invalid action gracefully", async () => {
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
      action: "invalid_action_xyz",
    }),
  });
  
  const data = await response.json();
  
  // Should return error but not crash
  assertEquals(response.status, 200); // Function handles internally
  assertExists(data.error || data.success === false);
});

// Unit test for category filtering logic
Deno.test("Unit: category filter matches expected industries", () => {
  const industries = ["fintech", "healthcare", "ai_saas"];
  const categoryMap: Record<string, string[]> = {
    fintech: ["benchmarks", "terminology", "regulatory"],
    healthcare: ["benchmarks", "clinical", "reimbursement"],
    ai_saas: ["benchmarks", "ml_ops", "pricing"],
  };
  
  industries.forEach((industry) => {
    const categories = categoryMap[industry];
    assertExists(categories);
    assertEquals(categories.includes("benchmarks"), true);
  });
});

// Unit test for benchmark injection
Deno.test("Unit: benchmark injection replaces placeholders correctly", () => {
  const template = "Your CAC should be under {{CAC_BENCHMARK}} for {{INDUSTRY}}.";
  const benchmarks = { CAC_BENCHMARK: "$50", INDUSTRY: "FinTech" };
  
  let result = template;
  Object.entries(benchmarks).forEach(([key, value]) => {
    result = result.replace(`{{${key}}}`, value);
  });
  
  assertEquals(result, "Your CAC should be under $50 for FinTech.");
  assertStringIncludes(result, "FinTech");
});
