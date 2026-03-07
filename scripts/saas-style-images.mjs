#!/usr/bin/env node
/**
 * Apply AI/SaaS-style green gradient overlay to images (OpenAI/Stripe/Nvidia style).
 * Uses: gradient overlay + overlay blend + contrast → preserves detail, brand tint.
 *
 * Usage:
 *   node scripts/saas-style-images.mjs [inputDir] [-d outDir]
 *   npm run images:saas-style -- [inputDir] [-d outDir]
 *
 * Defaults: inputDir = images/globe/optimized, outDir = <inputDir>/../saas
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const EXT = ['.png', '.jpg', '.jpeg', '.webp'];
const MAX_SIZE = 1600;
const WEBP_QUALITY = 82;
const GRADIENT_TOP = '#00ff9c';
const GRADIENT_BOTTOM = '#003b2a';
const OVERLAY_OPACITY = 0.25; // 20–35% range

function parseArgs() {
  const args = process.argv.slice(2);
  let inputDir = path.join(ROOT, 'images', 'globe', 'optimized');
  let outDir = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-d' && args[i + 1]) {
      outDir = path.resolve(process.cwd(), args[i + 1]);
      i++;
    } else if (!args[i].startsWith('-')) {
      inputDir = path.resolve(process.cwd(), args[i]);
      outDir = path.join(path.dirname(inputDir), 'saas');
    }
  }
  if (!outDir) outDir = path.join(path.dirname(inputDir), 'saas');
  return { inputDir, outDir };
}

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { stdio: 'pipe', ...opts });
    let out = '';
    let err = '';
    if (proc.stdout) proc.stdout.on('data', (d) => { out += d; });
    if (proc.stderr) proc.stderr.on('data', (d) => { err += d; });
    proc.on('close', (code) => {
      if (code === 0) resolve(out.trim());
      else reject(new Error(err || `exit ${code}`));
    });
    proc.on('error', reject);
  });
}

async function processImage(inputDir, outDir, file, convertCmd) {
  const src = path.join(inputDir, file);
  const base = path.basename(file, path.extname(file));
  const dest = path.join(outDir, `${base}.webp`);

  // Get dimensions after resize (max 1600)
  const dims = await run(convertCmd, [
    src,
    '-resize', `${MAX_SIZE}x${MAX_SIZE}>`,
    '-format', '%w %h',
    'info:',
  ]);
  const [w, h] = dims.split(/\s+/).map(Number);
  if (!w || !h) throw new Error('Could not get dimensions');

  // Resize + gradient overlay (same size as image) + overlay blend + contrast → WebP
  await new Promise((resolve, reject) => {
    const args = [
      src,
      '-resize', `${MAX_SIZE}x${MAX_SIZE}>`,
      '(',
      '-size', `${w}x${h}`,
      `gradient:${GRADIENT_TOP}-${GRADIENT_BOTTOM}`,
      '-alpha', 'set',
      '-channel', 'A',
      '-evaluate', 'multiply', String(OVERLAY_OPACITY),
      '+channel',
      ')',
      '-compose', 'overlay',
      '-composite',
      '-contrast',
      '-quality', String(WEBP_QUALITY),
      dest,
    ];
    const proc = spawn(convertCmd, args, { stdio: 'ignore' });
    proc.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`convert exit ${code}`))));
    proc.on('error', reject);
  });

  const stat = fs.statSync(dest);
  return { file, dest: `${base}.webp`, kb: (stat.size / 1024).toFixed(1) };
}

async function main() {
  const { inputDir, outDir } = parseArgs();

  if (!fs.existsSync(inputDir)) {
    console.error('Input dir not found:', inputDir);
    process.exit(1);
  }

  const files = fs.readdirSync(inputDir).filter((f) => {
    const ext = path.extname(f).toLowerCase();
    return EXT.includes(ext);
  });

  if (files.length === 0) {
    console.log('No images in', inputDir);
    return;
  }

  const convertCmd = 'convert';
  try {
    await run(convertCmd, ['-version']);
  } catch {
    console.error('ImageMagick (convert) required. Install: apt install imagemagick');
    process.exit(1);
  }

  fs.mkdirSync(outDir, { recursive: true });
  console.log(`SaaS-style (gradient overlay + contrast) ${files.length} image(s) → ${outDir}`);
  console.log(`  Gradient: ${GRADIENT_TOP} → ${GRADIENT_BOTTOM}, opacity ${OVERLAY_OPACITY * 100}%`);

  for (const file of files) {
    try {
      const { dest, kb } = await processImage(inputDir, outDir, file, convertCmd);
      console.log(`  ${file} → ${dest} (${kb} KB)`);
    } catch (err) {
      console.error(`  ${file}:`, err.message);
    }
  }
}

main();
