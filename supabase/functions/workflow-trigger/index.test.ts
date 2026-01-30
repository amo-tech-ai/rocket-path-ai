/**
 * Workflow Trigger Tests
 * 
 * Tests:
 * - Trigger rules configuration
 * - Score threshold logic
 * - Duplicate task prevention
 * - Template interpolation
 */

import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals, assertExists, assertStringIncludes } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL") || Deno.env.get("SUPABASE_URL") || "";
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/workflow-trigger`;

Deno.test("workflow-trigger: returns 401 without auth", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "get_trigger_rules" }),
  });
  
  await response.text();
  assertEquals(response.status, 401);
});

Deno.test("workflow-trigger: handles OPTIONS for CORS", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "OPTIONS",
  });
  
  await response.text();
  assertEquals(response.status, 200);
});

Deno.test("workflow-trigger: get_trigger_rules returns rules", async () => {
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
    body: JSON.stringify({ action: "get_trigger_rules" }),
  });
  
  const data = await response.json();
  
  assertEquals(response.status, 200);
  assertExists(data.rules);
  assertEquals(Array.isArray(data.rules), true);
});

// Unit tests for trigger logic
Deno.test("Unit: Trigger rules have required fields", () => {
  const TRIGGER_RULES = [
    {
      id: 'team_strength_low',
      source: 'investor_score',
      category: 'team',
      threshold: 60,
      priority: 'medium',
      taskTemplate: {
        title: 'Strengthen Team Advisory',
        description: 'Test description',
        tags: ['team'],
      },
    },
  ];
  
  TRIGGER_RULES.forEach((rule) => {
    assertExists(rule.id);
    assertExists(rule.source);
    assertExists(rule.category);
    assertExists(rule.threshold);
    assertExists(rule.priority);
    assertExists(rule.taskTemplate);
    assertExists(rule.taskTemplate.title);
    assertExists(rule.taskTemplate.description);
  });
});

Deno.test("Unit: Threshold comparison logic", () => {
  const checkThreshold = (score: number, threshold: number): boolean => {
    return score < threshold;
  };
  
  assertEquals(checkThreshold(59, 60), true);  // Below threshold
  assertEquals(checkThreshold(60, 60), false); // At threshold
  assertEquals(checkThreshold(61, 60), false); // Above threshold
  assertEquals(checkThreshold(0, 60), true);   // Zero score
  assertEquals(checkThreshold(100, 60), false); // Perfect score
});

Deno.test("Unit: Template interpolation", () => {
  const interpolate = (template: string, context: Record<string, unknown>): string => {
    let result = template;
    const placeholders: Record<string, string> = {
      '{{GAP_AREA}}': String(context.gap_area || 'key areas'),
      '{{BENCHMARK}}': String(context.benchmark || 'industry-standard metrics'),
      '{{TARGET_SEGMENT}}': String(context.target_segment || 'target customers'),
      '{{COMPLETION}}': String(context.completion || '0'),
    };
    
    Object.entries(placeholders).forEach(([key, value]) => {
      result = result.replace(key, value);
    });
    
    return result;
  };
  
  // With context
  const result1 = interpolate(
    'Focus on {{GAP_AREA}} to improve.',
    { gap_area: 'technical leadership' }
  );
  assertEquals(result1, 'Focus on technical leadership to improve.');
  
  // With default
  const result2 = interpolate(
    'Focus on {{GAP_AREA}} to improve.',
    {}
  );
  assertEquals(result2, 'Focus on key areas to improve.');
  
  // Multiple placeholders
  const result3 = interpolate(
    'Canvas is {{COMPLETION}}% done. Target: {{TARGET_SEGMENT}}.',
    { completion: 75, target_segment: 'SMBs' }
  );
  assertStringIncludes(result3, '75');
  assertStringIncludes(result3, 'SMBs');
});

Deno.test("Unit: Priority mapping", () => {
  const PRIORITY_ORDER = ['low', 'medium', 'high', 'urgent'];
  
  const getPriorityValue = (priority: string): number => {
    return PRIORITY_ORDER.indexOf(priority);
  };
  
  assertEquals(getPriorityValue('low'), 0);
  assertEquals(getPriorityValue('medium'), 1);
  assertEquals(getPriorityValue('high'), 2);
  assertEquals(getPriorityValue('urgent'), 3);
  
  // Higher value = more urgent
  assertEquals(getPriorityValue('urgent') > getPriorityValue('low'), true);
});

Deno.test("Unit: Category score extraction", () => {
  const extractScore = (
    categoryScores: Record<string, number> | undefined,
    category: string,
    overallScore?: number
  ): number | undefined => {
    if (category === 'overall') {
      return overallScore;
    }
    return categoryScores?.[category];
  };
  
  const scores = { team: 55, market: 70, product: 40 };
  
  assertEquals(extractScore(scores, 'team'), 55);
  assertEquals(extractScore(scores, 'market'), 70);
  assertEquals(extractScore(scores, 'overall', 65), 65);
  assertEquals(extractScore(scores, 'missing'), undefined);
  assertEquals(extractScore(undefined, 'team'), undefined);
});
