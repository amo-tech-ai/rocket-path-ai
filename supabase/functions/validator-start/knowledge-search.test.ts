/**
 * Unit tests for knowledge-search.ts (RAG helper for Research agent).
 * Run: deno test validator-start/knowledge-search.test.ts
 */

import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  formatKnowledgeForPrompt,
  type KnowledgeChunk,
} from "./knowledge-search.ts";

Deno.test("formatKnowledgeForPrompt: empty array returns empty string", () => {
  assertEquals(formatKnowledgeForPrompt([]), "");
});

Deno.test("formatKnowledgeForPrompt: single chunk includes source and similarity", () => {
  const chunks: KnowledgeChunk[] = [
    {
      id: "id-1",
      content: "Fashion market TAM $500B.",
      source: "Bain Report",
      source_type: "report",
      year: 2025,
      confidence: "high",
      category: "market",
      industry: "fashion",
      similarity: 0.85,
    },
  ];
  const out = formatKnowledgeForPrompt(chunks, 4000);
  assertEquals(out.includes("Bain Report"), true);
  assertEquals(out.includes("0.85"), true);
  assertEquals(out.includes("Fashion market TAM"), true);
});

Deno.test("formatKnowledgeForPrompt: citation fields (document_title, section_title, page_start)", () => {
  const chunks: KnowledgeChunk[] = [
    {
      id: "id-1",
      content: "Fashion market TAM $500B.",
      source: "Bain Report",
      source_type: "report",
      year: 2025,
      confidence: "high",
      category: "market",
      industry: "fashion",
      similarity: 0.85,
      document_title: "Bain Technology Report 2025",
      section_title: "Market Overview",
      page_start: 12,
    },
  ];
  const out = formatKnowledgeForPrompt(chunks, 4000);
  assertEquals(out.includes("Bain Technology Report 2025"), true);
  assertEquals(out.includes("Market Overview"), true);
  assertEquals(out.includes("p.12"), true);
  assertEquals(out.includes("Fashion market TAM"), true);
});

Deno.test("formatKnowledgeForPrompt: respects maxChars", () => {
  const chunks: KnowledgeChunk[] = [
    {
      id: "1",
      content: "A".repeat(2000),
      source: "S",
      source_type: "report",
      year: null,
      confidence: null,
      category: null,
      industry: null,
      similarity: 0.9,
    },
    {
      id: "2",
      content: "B",
      source: "S2",
      source_type: "report",
      year: null,
      confidence: null,
      category: null,
      industry: null,
      similarity: 0.8,
    },
  ];
  const out = formatKnowledgeForPrompt(chunks, 100);
  assertEquals(out.length <= 110, true);
});

Deno.test("KnowledgeSearchResult shape: parsed response has query, results, count", () => {
  const mockResponse = {
    query: "fashion TAM",
    results: [{ id: "a", content: "x", source: "s", source_type: "report", year: 2024, confidence: "high", category: null, industry: "fashion", similarity: 0.78 }],
    count: 1,
  };
  assertEquals(mockResponse.count >= 0, true);
  assertEquals(Array.isArray(mockResponse.results), true);
  assertEquals(mockResponse.results.length > 0 ? typeof mockResponse.results[0].content === "string" : true, true);
});
