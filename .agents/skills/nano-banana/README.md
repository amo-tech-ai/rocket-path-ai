# Nano Banana Skills — Decision Matrix

Four skills for AI image generation, each with different backends and use cases.

## Which Skill to Use

| Task | Skill | Command |
|------|-------|---------|
| Generate 1 image | **nanobanana-skill** | `python3 nanobanana.py --prompt "..." --output out.png` |
| Edit/enhance an existing image | **nanobanana-skill** | `python3 nanobanana.py --prompt "..." --input source.png --output out.png` |
| Quick iteration (fast, cheaper) | **nanobanana-skill** | Add `--model gemini-2.5-flash-image` (4-6s vs 10-20s) |
| Final production render | **nanobanana-skill** | Add `--resolution 4K --size 1184x864` |
| Batch assets with preset library | **nano-banana-2-image-assets** | `node cli/index.js generate-images --custom-presets ...` |
| Corporate/professional style images | **corporate-image-style** | Use prompt templates from SKILL.md with nanobanana-skill |
| Slide deck (every slide = AI image) | **illustrated-slides** | Follow SKILL.md x402 payment flow |

## Skill Comparison

| | nanobanana-skill | nano-banana-2-image-assets | illustrated-slides |
|---|---|---|---|
| **Backend** | Gemini API (direct) | WaveSpeed.ai | FluxA x402 proxy |
| **Cost** | Free (your API key) | ~$0.01-0.03/image | 0.1 USDC/image |
| **Can edit images** | Yes (`--input`) | No | No |
| **Preset system** | No | Yes (12 presets, 5 categories) | Yes (5 visual styles) |
| **Output** | PNG/image file | PNG + gallery UI | PPTX with full-page images |
| **Speed** | 4-20s depending on model | 3-8s | ~10s + payment overhead |
| **Resolution** | 1K / 2K / 4K | Up to 2K | 16:9 slides |
| **Status** | Ready (needs pip install) | Incomplete (CLI missing) | Ready (needs FluxA wallet) |

## Skill 1: nanobanana-skill (Primary)

Direct Gemini API image generation via Python CLI. The workhorse.

**Setup:**
```bash
pip install google-genai Pillow python-dotenv httpx[socks]
# API key in ~/.nanobanana.env
```

**Script:** `nanobanana-skill/nanobanana.py`

**Models:**
- `gemini-3-pro-image-preview` — Best quality, 10-20s (default)
- `gemini-2.5-flash-image` — Fast iteration, 4-6s

**Aspect ratios:** 1:1, 2:3, 3:2, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9

**SunAI workflow:**
1. Pick a prompt from `images/nano-banana/services/*.md`
2. Iterate with flash model at 1K
3. Final render with pro model at 4K
4. Post-process with ImageMagick if color correction needed

## Skill 2: nano-banana-2-image-assets

Batch asset pipeline via WaveSpeed.ai with preset categories.

**Setup:** Requires `WAVESPEED_API_KEY` env var. CLI (`cli/index.js`) not yet built.

**Presets:** `asset-presets.json` — 12 presets across hero backgrounds, product shots, lifestyle, abstract/decorative, icons/illustrations.

**Best for:** Generating a full website asset library in one pass.

**Status:** Partially complete — preset definitions exist, but the CLI and gallery server are missing.

## Skill 3: illustrated-slides-with-nano-banana

Creates PPTX presentations where every slide is a complete AI-generated image with embedded text.

**Setup:** Requires FluxA wallet JWT at `~/.fluxa-ai-wallet-mcp/config.json` + `npm install pptxgenjs`.

**Styles:** Kawaii, Professional/Corporate, Bold/Creative, Minimalist/Elegant, Custom.

**Best for:** Pitch decks, marketing presentations, visual-first content.

## Related Resources

## Skill 4: corporate-image-style

Prompt engineering guide for neutral, professional, editorial-quality images inspired by BCG and Superside. Fixes the "too green / too neon / too dark" problem.

**Use when:** Images need to look like they belong on a top-tier consulting or creative agency website — warm whites, sage greens, gold accents, natural lighting. Not sci-fi, not neon.

**Provides:** 5 prompt templates, corporate color palettes, anti-neon prompt modifiers, common mistake fixes.

## Related Resources

| Resource | Path |
|----------|------|
| Service prompts (9 services) | `images/nano-banana/services/*.md` |
| General prompts (35) | `images/nano-banana/PROMPTS.md` |
| Best practices | `images/nano-banana/INDEX.md` |
| Visual design system | `images/nano-banana/PLAN.md` |
| Research findings | `images/nano-banana/RESEARCH.md` |
| Gemini image gen docs | `images/nano-banana/image-generation.md` |
| Brand colors (SunAI) | Mint `#4AEDC4`, Teal `#14B8A6`, Dark `#050F0C` |
| Corporate colors (BCG) | Forest `#025645`, Gold `#D9B95B`, Sage `#337B68` |
