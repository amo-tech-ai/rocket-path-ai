#!/usr/bin/env node
/**
 * Compress images to WebP (resize max width 1600, quality 82).
 * Use this instead of squoosh-cli, which fails on Node 18+ with ERR_INVALID_URL
 * when loading WASM (see https://github.com/GoogleChromeLabs/squoosh/issues/1260).
 *
 * Uses sharp if installed; falls back to ImageMagick (convert) otherwise.
 *
 * Usage:
 *   node scripts/compress-images.mjs [inputDir] [-d outDir]
 *   npm run images:compress -- [inputDir] [-d outDir]
 *
 * Defaults: inputDir = images/AI, outDir = <inputDir>/optimized
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const EXT = ['.png', '.jpg', '.jpeg'];
const MAX_WIDTH = 1600;
const WEBP_QUALITY = 82;

function parseArgs() {
  const args = process.argv.slice(2);
  let inputDir = path.join(ROOT, 'images', 'AI');
  let outDir = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-d' && args[i + 1]) {
      outDir = path.resolve(process.cwd(), args[i + 1]);
      i++;
    } else if (!args[i].startsWith('-')) {
      inputDir = path.resolve(process.cwd(), args[i]);
    }
  }
  if (!outDir) outDir = path.join(inputDir, 'optimized');
  return { inputDir, outDir };
}

function runConvert(src, dest) {
  return new Promise((resolve, reject) => {
    const proc = spawn('convert', [
      src,
      '-resize', `${MAX_WIDTH}x>`,
      '-quality', String(WEBP_QUALITY),
      dest,
    ], { stdio: 'ignore' });
    proc.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`convert exited ${code}`))));
    proc.on('error', reject);
  });
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
    console.log('No .png/.jpg/.jpeg files in', inputDir);
    return;
  }

  let useSharp = false;
  try {
    await import('sharp');
    useSharp = true;
  } catch {
    try {
      await new Promise((resolve, reject) => {
        const p = spawn('convert', ['-version'], { stdio: 'pipe' });
        p.on('close', (c) => (c === 0 ? resolve() : reject(new Error('no convert'))));
        p.on('error', reject);
      });
    } catch {
      console.error('Need either: npm install -D sharp  OR  ImageMagick (convert) in PATH');
      process.exit(1);
    }
  }

  fs.mkdirSync(outDir, { recursive: true });
  const backend = useSharp ? 'sharp' : 'ImageMagick';
  console.log(`Compressing ${files.length} image(s) → ${outDir} (max width ${MAX_WIDTH}, WebP q${WEBP_QUALITY}) [${backend}]`);

  if (useSharp) {
    const sharp = (await import('sharp')).default;
    for (const file of files) {
      const src = path.join(inputDir, file);
      const base = path.basename(file, path.extname(file));
      const dest = path.join(outDir, `${base}.webp`);
      try {
        const info = await sharp(src)
          .resize(MAX_WIDTH, null, { withoutEnlargement: true })
          .webp({ quality: WEBP_QUALITY })
          .toFile(dest);
        const kb = (info.size / 1024).toFixed(1);
        console.log(`  ${file} → ${base}.webp (${kb} KB)`);
      } catch (err) {
        console.error(`  ${file}:`, err.message);
      }
    }
  } else {
    for (const file of files) {
      const src = path.join(inputDir, file);
      const base = path.basename(file, path.extname(file));
      const dest = path.join(outDir, `${base}.webp`);
      try {
        await runConvert(src, dest);
        const stat = fs.statSync(dest);
        const kb = (stat.size / 1024).toFixed(1);
        console.log(`  ${file} → ${base}.webp (${kb} KB)`);
      } catch (err) {
        console.error(`  ${file}:`, err.message);
      }
    }
  }
}

main();
