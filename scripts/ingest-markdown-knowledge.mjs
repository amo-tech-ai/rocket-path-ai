#!/usr/bin/env node
/**
 * Ingest markdown files from research/markdown into Supabase knowledge base.
 * No LlamaCloud — uses knowledge-ingest Edge Function (requires X-Internal-Token).
 *
 * Requires: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (or anon key if RLS allows).
 * Run from project root:
 *   node scripts/ingest-markdown-knowledge.mjs
 * Or with env from .env.local:
 *   export $(grep -v '^#' .env.local | xargs) && node scripts/ingest-markdown-knowledge.mjs
 */

import { readdir, readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
// Default: research/markdown; override with --dir research/fashion/markdown (relative to project root)
const dirArg = process.argv.find(a => a.startsWith('--dir='));
const RESEARCH_MARKDOWN = dirArg ? join(ROOT, dirArg.replace('--dir=', '')) : join(ROOT, 'research', 'markdown');
// Override industry when frontmatter lacks it: --industry=ai
const industryArg = process.argv.find(a => a.startsWith('--industry='));
const DEFAULT_INDUSTRY = industryArg ? industryArg.replace('--industry=', '').trim() : undefined;

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const internalToken = process.env.KNOWLEDGE_INTERNAL_TOKEN;

if (!url) {
  console.error('Set SUPABASE_URL (or VITE_SUPABASE_URL)');
  process.exit(1);
}
if (!internalToken) {
  console.error('Set KNOWLEDGE_INTERNAL_TOKEN (e.g. supabase secrets set KNOWLEDGE_INTERNAL_TOKEN=your-secret)');
  process.exit(1);
}

const functionUrl = `${url.replace(/\/$/, '')}/functions/v1/knowledge-ingest`;

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;

function parseFrontmatter(raw) {
  const m = raw.match(FRONTMATTER_RE);
  if (!m) return { meta: null, body: raw };
  const yaml = m[1];
  const body = m[2].trim();
  const meta = {};
  for (const line of yaml.split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    const [, key, value] = kv;
    let v = value.trim();
    if (v.startsWith('[') && v.endsWith(']')) {
      meta[key] = v.slice(1, -1).split(',').map(s => s.replace(/^["']|["']$/g, '').trim()).filter(Boolean);
    } else if (v === 'null' || v === '') {
      meta[key] = null;
    } else if (/^\d+$/.test(v)) {
      meta[key] = parseInt(v, 10);
    } else {
      meta[key] = v.replace(/^["']|["']$/g, '');
    }
  }
  return { meta: Object.keys(meta).length ? meta : null, body };
}

function titleFromFilename(name) {
  return name
    .replace(/\.md$/i, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim();
}

async function ingestFile(filePath, payload) {
  const res = await fetch(functionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Internal-Token': internalToken,
    },
    body: JSON.stringify({ ...payload }),
  });

  const body = await res.json();
  if (!res.ok) {
    const msg = body.error || body.details || res.statusText;
    if (body.error === 'Invalid action') {
      throw new Error(`${msg} — deploy knowledge-ingest: supabase functions deploy knowledge-ingest`);
    }
    throw new Error(msg);
  }
  return body;
}

async function main() {
  const files = await readdir(RESEARCH_MARKDOWN);
  const mdFiles = files.filter(f => f.endsWith('.md'));
  if (mdFiles.length === 0) {
    console.log(`No .md files in ${RESEARCH_MARKDOWN}`);
    return;
  }

  console.log(`Ingesting ${mdFiles.length} markdown files from ${RESEARCH_MARKDOWN}...\n`);

  for (const file of mdFiles) {
    const filePath = join(RESEARCH_MARKDOWN, file);
    const raw = await readFile(filePath, 'utf-8');
    const { meta, body: markdown } = parseFrontmatter(raw);
    const title = (meta?.title || titleFromFilename(file)).slice(0, 500);
    const payload = {
      title,
      markdown,
      source: meta?.source ?? title,
      source_type: meta?.source_type ?? 'research',
      category: meta?.category ?? 'research',
      year: meta?.year ?? new Date().getFullYear(),
      confidence: meta?.confidence ?? 'medium',
      industry: meta?.industry ?? DEFAULT_INDUSTRY,
      sample_size: meta?.sample_size ?? undefined,
      source_url: meta?.source_url ?? undefined,
      tags: Array.isArray(meta?.tags) ? meta.tags : undefined,
    };
    try {
      const result = await ingestFile(filePath, payload);
      console.log(`✓ ${file} → ${result.chunks_created}/${result.chunks_total} chunks (doc: ${result.document_id})`);
      if (result.errors?.length) {
        result.errors.forEach(e => console.warn('  ', e));
      }
    } catch (err) {
      console.error(`✗ ${file}:`, err.message);
    }
  }

  console.log('\nDone.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
