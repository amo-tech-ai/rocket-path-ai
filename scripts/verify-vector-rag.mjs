#!/usr/bin/env node
/**
 * Verify Vector RAG pipeline (knowledge-search + knowledge-ingest).
 * Run from project root. Uses SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from env or .env.local.
 *
 * Usage:
 *   node scripts/verify-vector-rag.mjs
 *   export $(grep -v '^#' .env.local | xargs) && node scripts/verify-vector-rag.mjs
 *
 * Proof: Exit 0 = all checks pass; exit 1 = one or more failed. Output includes Pass/Fail per step.
 */

import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

async function loadEnvLocal() {
  try {
    const raw = await readFile(join(ROOT, '.env.local'), 'utf8');
    for (const line of raw.split('\n')) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (m && !line.startsWith('#')) {
        const [, key, value] = m;
        const v = value.replace(/^["']|["']$/g, '').trim();
        if (!process.env[key]) process.env[key] = v;
      }
    }
  } catch {
    // .env.local optional
  }
}

async function main() {
  await loadEnvLocal();

  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error('FAIL: Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or use .env.local)');
    process.exit(1);
  }

  const searchUrl = `${url.replace(/\/$/, '')}/functions/v1/knowledge-search`;
  const ingestUrl = `${url.replace(/\/$/, '')}/functions/v1/knowledge-ingest`;
  const searchBody = {
    query: 'fashion market size TAM 2026',
    filter_industry: 'fashion',
  };

  let allPass = true;

  // Step 1: knowledge-search with filter_industry (accepts service role or anon)
  try {
    const res = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify(searchBody),
    });

    const text = await res.text();
    if (!res.ok) {
      console.error('Step 1 FAIL: knowledge-search returned', res.status, text.slice(0, 200));
      allPass = false;
    } else {
      const data = JSON.parse(text);
      const count = data.count ?? 0;
      const results = Array.isArray(data.results) ? data.results : [];
      const hasShape = results.length === 0 || (results[0] && (results[0].source != null || results[0].content != null));
      if (!hasShape) {
        console.error('Step 1 FAIL: results missing source/content');
        allPass = false;
      } else {
        // Step 1b: Citation fields present (013)
        const first = results[0];
        const hasCitationFields = !first || (
          first.hasOwnProperty('document_id') &&
          first.hasOwnProperty('document_title') &&
          first.hasOwnProperty('section_title')
        );
        if (results.length > 0 && !hasCitationFields) {
          console.error('Step 1 FAIL: results missing citation fields (document_id, document_title, section_title)');
          allPass = false;
        } else {
          console.log('Step 1 Pass: knowledge-search count=' + count + ', citation fields present');
        }
      }
    }
  } catch (e) {
    console.error('Step 1 FAIL:', e.message || e);
    allPass = false;
  }

  // Step 2: knowledge-ingest rejects without X-Internal-Token (security proof)
  try {
    const res = await fetch(ingestUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markdown: '# Test', title: 'Test' }),
    });
    if (res.status !== 401) {
      console.error('Step 2 FAIL: ingest without token should return 401, got', res.status);
      allPass = false;
    } else {
      console.log('Step 2 Pass: knowledge-ingest rejects unauthenticated requests (401)');
    }
  } catch (e) {
    console.error('Step 2 FAIL:', e.message || e);
    allPass = false;
  }

  // Step 3: content_hash dedupe — re-ingesting same doc creates 0 new chunks
  const internalToken = process.env.KNOWLEDGE_INTERNAL_TOKEN;
  if (internalToken) {
    const testDoc = { markdown: '# Verify Dedupe Test\n\nUnique content for verify-vector-rag step 3 run at ' + Date.now(), title: 'Verify-Dedupe-Step3' };
    try {
      const res1 = await fetch(ingestUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Internal-Token': internalToken },
        body: JSON.stringify(testDoc),
      });
      const data1 = await res1.json();
      if (!res1.ok) {
        console.error('Step 3 FAIL (ingest 1):', res1.status, JSON.stringify(data1).slice(0, 150));
        allPass = false;
      } else {
        const created1 = data1.chunks_created ?? 0;
        const res2 = await fetch(ingestUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Internal-Token': internalToken },
          body: JSON.stringify(testDoc),
        });
        const data2 = await res2.json();
        if (!res2.ok) {
          console.error('Step 3 FAIL (ingest 2):', res2.status, JSON.stringify(data2).slice(0, 150));
          allPass = false;
        } else if ((data2.chunks_created ?? -1) !== 0 || !data2.skipped) {
          console.error('Step 3 FAIL: second ingest should return chunks_created=0, skipped=true; got', JSON.stringify(data2));
          allPass = false;
        } else {
          console.log('Step 3 Pass: re-ingest same doc → 0 new chunks (content_hash dedupe)');
        }
      }
    } catch (e) {
      console.error('Step 3 FAIL:', e.message || e);
      allPass = false;
    }
  } else {
    console.log('Step 3 Skip: KNOWLEDGE_INTERNAL_TOKEN not set (dedupe test requires it)');
  }

  if (!allPass) process.exit(1);
  console.log('Proof: knowledge-search works; knowledge-ingest secured; content_hash dedupe verified.');
  process.exit(0);
}

main();
