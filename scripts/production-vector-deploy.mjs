#!/usr/bin/env node
/**
 * Production deploy: migrations → edge functions → verify.
 * Run from project root. Requires: supabase CLI linked, .env.local with SUPABASE_* and optionally KNOWLEDGE_INTERNAL_TOKEN.
 *
 * Usage:
 *   node scripts/production-vector-deploy.mjs
 *   node scripts/production-vector-deploy.mjs --skip-verify   # deploy only, no verify
 *
 * Steps (sequential):
 *   1. supabase db push
 *   2. supabase functions deploy knowledge-ingest knowledge-search
 *   3. node scripts/verify-vector-rag.mjs
 */

import { spawn } from 'child_process';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

async function loadEnv() {
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
    // ignore
  }
}

function run(cmd, args = [], opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, {
      stdio: 'inherit',
      cwd: ROOT,
      env: { ...process.env, ...opts.env },
    });
    p.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))));
  });
}

async function main() {
  const skipVerify = process.argv.includes('--skip-verify');
  await loadEnv();

  console.log('Step 1: supabase db push');
  try {
    await run('supabase', ['db', 'push']);
  } catch (e) {
    console.error('Step 1 failed:', e.message);
    process.exit(1);
  }

  console.log('\nStep 2: supabase functions deploy knowledge-ingest knowledge-search');
  try {
    await run('supabase', ['functions', 'deploy', 'knowledge-ingest', 'knowledge-search']);
  } catch (e) {
    console.error('Step 2 failed:', e.message);
    process.exit(1);
  }

  if (skipVerify) {
    console.log('\nSkipping verify (--skip-verify).');
    process.exit(0);
  }

  console.log('\nStep 3: node scripts/verify-vector-rag.mjs');
  try {
    await run('node', ['scripts/verify-vector-rag.mjs']);
  } catch (e) {
    console.error('Step 3 failed:', e.message);
    process.exit(1);
  }

  console.log('\nProduction deploy + verify complete.');
}

main();
