# Industry Events Enrichment Script

Automatically enriches existing `industry_events` records with:
- Official website URLs (via Firecrawl search)
- Event images (OG, hero, logo) downloaded and uploaded to Supabase Storage
- Dates, location, format
- Speakers and pricing information

## Prerequisites

1. **Run migration first:**
   ```bash
   supabase db push
   ```
   This adds enrichment fields to `industry_events` table.

2. **Environment variables:**
   - `FIRECRAWL_API_KEY` - Already set in `.env.local`
   - `SUPABASE_SERVICE_ROLE_KEY` - Already set in `.env.local`
   - `VITE_SUPABASE_URL` - Already set in `.env.local`

3. **Supabase Storage bucket:**
   ```sql
   -- Create bucket if it doesn't exist
   INSERT INTO storage.buckets (id, name, public)
   VALUES ('industry-events', 'industry-events', true)
   ON CONFLICT (id) DO NOTHING;
   ```

## Usage

### Run on 5 events (test):
```bash
npm run enrich:events 5
```

### Run on all events needing enrichment:
```bash
npm run enrich:events
```

## What It Does

1. **Loads events** from Supabase that need enrichment (missing `website_url` or `image_url`)

2. **Finds official website** using Firecrawl search:
   - Query: `"{event_name} 2026 official site"`
   - Picks the most relevant official page

3. **Extracts event data** using Firecrawl extract:
   - Dates (start/end)
   - Location (city, country)
   - Format (in-person/virtual/hybrid)
   - Speakers
   - Pricing
   - Images (OG, hero, logo)

4. **Downloads images** locally to `./events/images/{event_id}/`:
   - Priority: OG → hero → logo
   - Formats: WebP

5. **Uploads to Supabase Storage**:
   - Path: `industry-events/{event_id}/{filename}.webp`
   - Public URLs stored in `image_url` field

6. **Updates database**:
   - `website_url`
   - `image_url` and `image_path`
   - `date_start`, `date_end`
   - `location_city`, `location_country`
   - `format`
   - `enrichment_status`: success | partial | needs_review
   - `enriched_at` timestamp
   - `enrichment_metadata` (speakers, pricing, etc.)

## Output Files

All saved to `./events/enrichment/`:

- **enrichment_queue.json** - List of events processed
- **run_log.json** - Execution summary with errors
- **images_manifest.json** - Image download/upload status per event

## Enrichment Status

- **success**: Website + image + dates + location found
- **partial**: Some data found (website or image)
- **needs_review**: Minimal data found, manual review needed
- **failed**: Error during enrichment

## Safety Features

- ✅ **No duplicate events** - Only updates existing records
- ✅ **Re-run safe** - Skips already enriched events (unless forced)
- ✅ **Preserves existing data** - Only updates null/empty fields
- ✅ **Error handling** - Continues processing even if one event fails
- ✅ **Detailed logging** - All actions logged to files

## Troubleshooting

### Firecrawl API errors
- Check `FIRECRAWL_API_KEY` in `.env.local`
- Verify API key is active in Firecrawl dashboard
- Check rate limits

### Supabase Storage errors
- Ensure `industry-events` bucket exists
- Check bucket is public
- Verify `SUPABASE_SERVICE_ROLE_KEY` has storage permissions

### Image download failures
- Images stored as URLs in `enrichment_metadata` even if download fails
- Check network connectivity
- Some images may be behind authentication

## Next Steps

After enrichment:
1. Review `run_log.json` for failed events
2. Manually review events with `enrichment_status = 'needs_review'`
3. Re-run on failed events if needed
4. Verify images in Supabase Storage dashboard
