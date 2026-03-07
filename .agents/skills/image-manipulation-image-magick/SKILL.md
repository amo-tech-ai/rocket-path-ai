---
name: image-manipulation-image-magick
description: Process and manipulate images using ImageMagick. Supports resizing, format conversion, batch processing, and retrieving image metadata. Use when working with images, creating thumbnails, resizing wallpapers, or performing batch image operations.
compatibility: Requires ImageMagick installed and available as `magick` on PATH. Cross-platform examples provided for PowerShell (Windows) and Bash (Linux/macOS).
---

# Image Manipulation with ImageMagick

This skill enables image processing and manipulation tasks using ImageMagick
across Windows, Linux, and macOS systems.

## When to Use This Skill

Use this skill when you need to:

- Resize images (single or batch)
- Get image dimensions and metadata
- Convert between image formats
- Create thumbnails
- Process wallpapers for different screen sizes
- Batch process multiple images with specific criteria
- Apply a color tint to match a reference image (e.g. green/teal tint)

## Prerequisites

- ImageMagick installed on the system
- **Windows**: PowerShell with ImageMagick available as `magick` (or at `C:\Program Files\ImageMagick-*\magick.exe`)
- **Linux/macOS**: Bash with ImageMagick installed via package manager (`apt`, `brew`, etc.)

## Core Capabilities

### 1. Image Information

- Get image dimensions (width x height)
- Retrieve detailed metadata (format, color space, etc.)
- Identify image format

### 2. Image Resizing

- Resize single images
- Batch resize multiple images
- Create thumbnails with specific dimensions
- Maintain aspect ratios

### 3. Batch Processing

- Process images based on dimensions
- Filter and process specific file types
- Apply transformations to multiple files

### 4. Color Grading / Tinting

- Apply a color grade to match a reference image (e.g. green/teal "AI interface" look)
- **Recommended method:** Grayscale + `+level-colors` duotone — strips original color, maps black→shadow color and white→highlight color
- Preserves contrast and detail far better than flat `-colorize`
- Batch-grade multiple images for consistent brand look

## Usage Examples

### Example 0: Resolve `magick` executable

**PowerShell (Windows):**
```powershell
# Prefer ImageMagick on PATH
$magick = (Get-Command magick -ErrorAction SilentlyContinue)?.Source

# Fallback: common install pattern under Program Files
if (-not $magick) {
    $magick = Get-ChildItem "C:\\Program Files\\ImageMagick-*\\magick.exe" -ErrorAction SilentlyContinue |
        Select-Object -First 1 -ExpandProperty FullName
}

if (-not $magick) {
    throw "ImageMagick not found. Install it and/or add 'magick' to PATH."
}
```

**Bash (Linux/macOS):**
```bash
# Check if magick is available on PATH
if ! command -v magick &> /dev/null; then
    echo "ImageMagick not found. Install it using your package manager:"
    echo "  Ubuntu/Debian: sudo apt install imagemagick"
    echo "  macOS: brew install imagemagick"
    exit 1
fi
```

### Example 1: Get Image Dimensions

**PowerShell (Windows):**
```powershell
# For a single image
& $magick identify -format "%wx%h" path/to/image.jpg

# For multiple images
Get-ChildItem "path/to/images/*" | ForEach-Object { 
    $dimensions = & $magick identify -format "%f: %wx%h`n" $_.FullName
    Write-Host $dimensions 
}
```

**Bash (Linux/macOS):**
```bash
# For a single image
magick identify -format "%wx%h" path/to/image.jpg

# For multiple images
for img in path/to/images/*; do
    magick identify -format "%f: %wx%h\n" "$img"
done
```

### Example 2: Resize Images

**PowerShell (Windows):**
```powershell
# Resize a single image
& $magick input.jpg -resize 427x240 output.jpg

# Batch resize images
Get-ChildItem "path/to/images/*" | ForEach-Object { 
    & $magick $_.FullName -resize 427x240 "path/to/output/thumb_$($_.Name)"
}
```

**Bash (Linux/macOS):**
```bash
# Resize a single image
magick input.jpg -resize 427x240 output.jpg

# Batch resize images
for img in path/to/images/*; do
    filename=$(basename "$img")
    magick "$img" -resize 427x240 "path/to/output/thumb_$filename"
done
```

### Example 3: Get Detailed Image Information

**PowerShell (Windows):**
```powershell
# Get verbose information about an image
& $magick identify -verbose path/to/image.jpg
```

**Bash (Linux/macOS):**
```bash
# Get verbose information about an image
magick identify -verbose path/to/image.jpg
```

### Example 4: Process Images Based on Dimensions

**PowerShell (Windows):**
```powershell
Get-ChildItem "path/to/images/*" | ForEach-Object { 
    $dimensions = & $magick identify -format "%w,%h" $_.FullName
    if ($dimensions) {
        $width,$height = $dimensions -split ','
        if ([int]$width -eq 2560 -or [int]$height -eq 1440) {
            Write-Host "Processing $($_.Name)"
            & $magick $_.FullName -resize 427x240 "path/to/output/thumb_$($_.Name)"
        }
    }
}
```

**Bash (Linux/macOS):**
```bash
for img in path/to/images/*; do
    dimensions=$(magick identify -format "%w,%h" "$img")
    if [[ -n "$dimensions" ]]; then
        width=$(echo "$dimensions" | cut -d',' -f1)
        height=$(echo "$dimensions" | cut -d',' -f2)
        if [[ "$width" -eq 2560 || "$height" -eq 1440 ]]; then
            filename=$(basename "$img")
            echo "Processing $filename"
            magick "$img" -resize 427x240 "path/to/output/thumb_$filename"
        fi
    fi
done
```

### Example 5: Apply Color Grade / Tint (Grayscale + Level-Colors)

Use when you want to give images a consistent color grade matching a reference (e.g. green/teal "AI interface" aesthetic). This method converts to grayscale first, then maps the luminance range to a two-color ramp — preserving contrast and detail.

**Technique:** `grayscale → +level-colors "shadow","highlight"` creates a duotone where:
- Black pixels → shadow color (e.g. `#050F0C` near-black with green tinge)
- White pixels → highlight color (e.g. `#4AEDC4` mint green)
- Everything in between interpolates smoothly

**Bash (ImageMagick 6 — `convert`):**
```bash
# Single image: green/teal grade matching dark AI aesthetic
convert input.png -colorspace gray \
  +level-colors "#050F0C","#4AEDC4" \
  -brightness-contrast -5x15 \
  output_graded.png

# Optional: export as WebP for web
convert output_graded.png -quality 85 output_graded.webp
```

**Bash (ImageMagick 7 — `magick`):**
```bash
magick input.png -colorspace gray \
  +level-colors "#050F0C","#4AEDC4" \
  -brightness-contrast -5x15 \
  output_graded.png
```

**Batch: all PNGs in a folder → out/ subfolder + WebP:**
```bash
mkdir -p out out/webp
for f in path/to/images/*.png; do
  [ -f "$f" ] || continue
  name=$(basename "$f" .png)
  convert "$f" -colorspace gray \
    +level-colors "#050F0C","#4AEDC4" \
    -brightness-contrast -5x15 \
    "out/${name}.png"
  convert "out/${name}.png" -quality 85 "out/webp/${name}.webp"
  echo "Graded: $name"
done
```

**Tuning the colors:**

| Shadow Color | Highlight Color | Result |
|---|---|---|
| `#050F0C` | `#4AEDC4` | Dark green/teal — "AI interface" (default) |
| `#050F0C` | `#14B8A6` | Muted teal — more subdued |
| `#000000` | `#00FF88` | Pure black to neon green — high contrast |
| `#0A0A1A` | `#6366F1` | Dark navy to indigo — purple tech vibe |
| `#0A0A0A` | `#F59E0B` | Dark to amber — warm/golden grade |

**Tuning brightness-contrast:** `-brightness-contrast -5x15` darkens slightly and boosts contrast. Use `0x0` for no change, `-10x20` for more cinematic.

> **Why not `-fill -colorize`?** Flat colorize blends a color at a percentage, which washes out shadows and flattens detail. The grayscale + level-colors approach preserves the full tonal range while remapping it to your target palette.

### Example 6: Analyze Reference Image (Derive Grade Recipe)

Use when you want to **measure** a reference image’s color palette so you can replicate it on other images.

**Bash (ImageMagick 6 — `convert`):**
```bash
ref=”path/to/reference.png”
{
  echo “== Identify ==”; identify “$ref”
  echo; echo “== Dominant (1x1) ==”
  convert “$ref” -resize 1x1! -format “%[pixel:p{0,0}]\n” info:
  echo; echo “== Mean RGB (0-1) ==”
  convert “$ref” -colorspace sRGB -format “mean_r=%[fx:mean.r]\nmean_g=%[fx:mean.g]\nmean_b=%[fx:mean.b]\n” info:
  echo; echo “== Top histogram ==”
  convert “$ref” -format %c histogram:info:- | head -20
} > imagemagick_report.txt
```

**Interpretation:**
- Mean RGB tells you the dominant channel: G > B > R = green/teal, B > G > R = blue/cyber
- Dominant (1x1) gives you the overall average color — use as the shadow color
- Histogram shows the distribution — bright peaks suggest highlight color

**Deriving level-colors from the report:**
1. Shadow color: use the dominant (1x1) value, or darken it further (e.g. `#050F0C`)
2. Highlight color: pick a brighter version of the dominant hue (e.g. if dominant is dark teal, highlight = `#4AEDC4` mint green)
3. Apply: `convert input.png -colorspace gray +level-colors “SHADOW”,”HIGHLIGHT” output.png`

## Guidelines

1. **Always quote file paths** - Use quotes around file paths that might contain spaces
2. **Use the `&` operator (PowerShell)** - Invoke the magick executable using `&` in PowerShell
3. **Store the path in a variable (PowerShell)** - Assign the ImageMagick path to `$magick` for cleaner code
4. **Wrap in loops** - When processing multiple files, use `ForEach-Object` (PowerShell) or `for` loops (Bash)
5. **Verify dimensions first** - Check image dimensions before processing to avoid unnecessary operations
6. **Use appropriate resize flags** - Consider using `!` to force exact dimensions or `^` for minimum dimensions

## Common Patterns

### PowerShell Patterns

#### Pattern: Store ImageMagick Path

```powershell
$magick = (Get-Command magick).Source
```

#### Pattern: Get Dimensions as Variables

```powershell
$dimensions = & $magick identify -format "%w,%h" $_.FullName
$width,$height = $dimensions -split ','
```

#### Pattern: Conditional Processing

```powershell
if ([int]$width -gt 1920) {
    & $magick $_.FullName -resize 1920x1080 $outputPath
}
```

#### Pattern: Create Thumbnails

```powershell
& $magick $_.FullName -resize 427x240 "thumbnails/thumb_$($_.Name)"
```

### Bash Patterns

#### Pattern: Check ImageMagick Installation

```bash
command -v magick &> /dev/null || { echo "ImageMagick required"; exit 1; }
```

#### Pattern: Get Dimensions as Variables

```bash
dimensions=$(magick identify -format "%w,%h" "$img")
width=$(echo "$dimensions" | cut -d',' -f1)
height=$(echo "$dimensions" | cut -d',' -f2)
```

#### Pattern: Conditional Processing

```bash
if [[ "$width" -gt 1920 ]]; then
    magick "$img" -resize 1920x1080 "$outputPath"
fi
```

#### Pattern: Create Thumbnails

```bash
filename=$(basename "$img")
magick "$img" -resize 427x240 "thumbnails/thumb_$filename"
```

## Limitations

- Large batch operations may be memory-intensive
- Some complex operations may require additional ImageMagick delegates
- On older Linux systems, use `convert` instead of `magick` (ImageMagick 6.x vs 7.x)
