#!/usr/bin/env node
/**
 * Run verify-vector-rag.mjs and write proof artifact to tasks/vector/PROOF-VECTOR-YYYYMMDD.md.
 * Exit code = same as verify script. Run from project root.
 *
 * Usage:
 *   node scripts/vector-proof-report.mjs
 *   export $(grep -v '^#' .env.local | xargs) && node scripts/vector-proof-report.mjs
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const VECTOR_DIR = join(ROOT, 'tasks', 'vector');

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

function parseSteps(output) {
  const lines = (output || '').split('\n');
  const steps = { 1: '—', 2: '—', 3: '—' };
  for (const line of lines) {
    if (/Step 1 Pass/.test(line)) steps[1] = 'Pass';
    if (/Step 1 FAIL/.test(line)) steps[1] = 'Fail';
    if (/Step 2 Pass/.test(line)) steps[2] = 'Pass';
    if (/Step 2 FAIL/.test(line)) steps[2] = 'Fail';
    if (/Step 3 Pass/.test(line)) steps[3] = 'Pass';
    if (/Step 3 Skip/.test(line)) steps[3] = 'Skip';
    if (/Step 3 FAIL/.test(line)) steps[3] = 'Fail';
  }
  return steps;
}

async function main() {
  await loadEnvLocal();

  const result = spawnSync(
    process.execPath,
    [join(ROOT, 'scripts', 'verify-vector-rag.mjs')],
    {
      cwd: ROOT,
      env: process.env,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }
  );

  const stdout = result.stdout || '';
  const stderr = result.stderr || '';
  const combined = stdout + (stderr ? '\n' + stderr : '');
  const code = result.status ?? 1;
  const steps = parseSteps(combined);

  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const iso = now.toISOString();

  await mkdir(VECTOR_DIR, { recursive: true });
  const proofPath = join(VECTOR_DIR, `PROOF-VECTOR-${dateStr}.md`);

  const md = `# Vector RAG verification proof

**Timestamp:** ${iso}  
**Exit code:** ${code}  
**Overall:** ${code === 0 ? 'PASS' : 'FAIL'}

## Step summary

| Step | Result | Required |
|:----:|:------:|:--------:|
| 1 (knowledge-search) | ${steps[1]} | No (often 401 without user JWT) |
| 2 (ingest 401) | ${steps[2]} | Yes |
| 3 (dedupe or skip) | ${steps[3]} | Yes |

## Full output

\`\`\`
${combined.trimEnd() || '(no output)'}
\`\`\`
`;

  await writeFile(proofPath, md, 'utf8');
  console.log('Proof written:', proofPath);
  console.log('Exit code:', code);
  process.exit(code);
}

main();
