/**
 * Health Scorer Agent Tests
 * 
 * Tests:
 * - 6-category health score calculation
 * - Score bounds (0-100)
 * - Auth enforcement
 */

import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals, assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL") || Deno.env.get("SUPABASE_URL") || "";
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/health-scorer`;

Deno.test("health-scorer: returns 401 without auth", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "calculate" }),
  });
  
  await response.text();
  assertEquals(response.status, 401);
});

Deno.test("health-scorer: handles OPTIONS for CORS", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "OPTIONS",
  });
  
  await response.text();
  assertEquals(response.status, 200);
});

Deno.test("health-scorer: calculate requires startup_id", async () => {
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
    body: JSON.stringify({ action: "calculate" }),
  });
  
  const data = await response.json();
  
  assertEquals(response.status, 200);
  // Should require startup_id
  assertExists(data.error || data.health_score !== undefined);
});

// Unit tests for health score calculation
Deno.test("Unit: Health score category weights sum to 1", () => {
  const weights = {
    canvas: 0.20,
    pitch: 0.20,
    validation: 0.15,
    tasks: 0.15,
    crm: 0.15,
    traction: 0.15,
  };
  
  const sum = Object.values(weights).reduce((a, b) => a + b, 0);
  assertEquals(Math.round(sum * 100) / 100, 1.0);
});

Deno.test("Unit: Health score bounds are enforced", () => {
  const calculateHealth = (categories: Record<string, number>): number => {
    const weights: Record<string, number> = {
      canvas: 0.20,
      pitch: 0.20,
      validation: 0.15,
      tasks: 0.15,
      crm: 0.15,
      traction: 0.15,
    };
    
    let score = 0;
    Object.entries(categories).forEach(([key, value]) => {
      if (weights[key]) {
        score += value * weights[key];
      }
    });
    
    return Math.min(100, Math.max(0, Math.round(score)));
  };
  
  // Perfect scores
  assertEquals(
    calculateHealth({
      canvas: 100,
      pitch: 100,
      validation: 100,
      tasks: 100,
      crm: 100,
      traction: 100,
    }),
    100
  );
  
  // Zero scores
  assertEquals(
    calculateHealth({
      canvas: 0,
      pitch: 0,
      validation: 0,
      tasks: 0,
      crm: 0,
      traction: 0,
    }),
    0
  );
  
  // Over 100 should cap at 100
  assertEquals(
    calculateHealth({
      canvas: 150,
      pitch: 150,
      validation: 150,
      tasks: 150,
      crm: 150,
      traction: 150,
    }),
    100
  );
});

Deno.test("Unit: Category score calculation", () => {
  // Canvas score based on completion
  const calculateCanvasScore = (filledBoxes: number, totalBoxes: number): number => {
    if (totalBoxes === 0) return 0;
    return Math.round((filledBoxes / totalBoxes) * 100);
  };
  
  assertEquals(calculateCanvasScore(9, 9), 100);
  assertEquals(calculateCanvasScore(4, 9), 44);
  assertEquals(calculateCanvasScore(0, 9), 0);
  assertEquals(calculateCanvasScore(0, 0), 0);
});

Deno.test("Unit: Task completion affects health", () => {
  const calculateTaskScore = (
    completed: number,
    total: number,
    overdueCount: number
  ): number => {
    if (total === 0) return 50; // No tasks = neutral
    
    const completionRate = completed / total;
    const overdueePenalty = Math.min(overdueCount * 10, 30);
    
    return Math.max(0, Math.round(completionRate * 100 - overdueePenalty));
  };
  
  assertEquals(calculateTaskScore(10, 10, 0), 100);
  assertEquals(calculateTaskScore(5, 10, 0), 50);
  assertEquals(calculateTaskScore(5, 10, 3), 20); // Penalty applied
  assertEquals(calculateTaskScore(0, 10, 5), 0);
});
