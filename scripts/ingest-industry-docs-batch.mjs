#!/usr/bin/env node
/**
 * Batch ingest 20+ industry docs (022).
 * Runs ingest-markdown-knowledge.mjs for each industry directory.
 * Requires: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, KNOWLEDGE_INTERNAL_TOKEN
 *
 * Usage: export $(grep -v '^#' .env.local | xargs) && node scripts/ingest-industry-docs-batch.mjs
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const DIRS = [
  { dir: 'research/AI/markdown/reports', industry: 'ai_ml' },
  { dir: 'research/retail', industry: 'retail' },
  { dir: 'research/fintech', industry: 'fintech' },
  { dir: 'research/sports/reports', industry: 'sports' },
  { dir: 'research/startups', industry: 'startups' },
];

function run(dir, industry) {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      'node',
      ['scripts/ingest-markdown-knowledge.mjs', `--dir=${dir}`, `--industry=${industry}`],
      { cwd: ROOT, stdio: 'inherit', env: process.env }
    );
    proc.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`Exit ${code}`))));
  });
}

async function main() {
  if (!process.env.KNOWLEDGE_INTERNAL_TOKEN) {
    console.error('Set KNOWLEDGE_INTERNAL_TOKEN (e.g. from .env.local or supabase secrets)');
    process.exit(1);
  }
  console.log('Ingesting 20+ industry docs (022)...\n');
  for (const { dir, industry } of DIRS) {
    console.log(`\n--- ${industry} (${dir}) ---`);
    try {
      await run(dir, industry);
    } catch (e) {
      console.error(`Batch failed: ${industry}`, e.message);
      process.exit(1);
    }
  }
  console.log('\n\nBatch ingest complete.');
}

main();
