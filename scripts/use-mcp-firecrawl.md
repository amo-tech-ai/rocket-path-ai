# Using MCP Firecrawl for Image Download

## Current Implementation

The script `download-event-images.ts` currently uses direct Firecrawl API calls as a fallback. To use MCP Firecrawl tools instead, you can call it from Cursor Agent.

## How to Use MCP Firecrawl

### Option 1: Run from Cursor Agent (Recommended)

The agent can use MCP Firecrawl tools directly. Ask the agent:

```
Use Firecrawl MCP to download images for industry events. 
Run the download-event-images script and use MCP tools for scraping.
```

The agent will:
1. List events needing images
2. Use MCP Firecrawl `scrape_url` tool for each event URL
3. Extract images from the scraped content
4. Download and upload images

### Option 2: Modify Script to Use MCP Tools

If you want the script itself to use MCP, you need to:

1. **Import MCP tool calling** (when available in Node.js context)
2. **Replace API calls** with MCP tool calls:

```typescript
// Instead of direct API:
const result = await firecrawlScrape(url);

// Use MCP tool:
const result = await call_mcp_tool({
  server: 'firecrawl-mcp',
  toolName: 'scrape_url',  // or 'scrape', check available tools
  arguments: { url }
});
```

## Available Firecrawl MCP Tools

Check available tools after restarting Cursor:
```
~/.cursor/projects/home-sk-startupai16L/mcps/firecrawl-mcp/tools/
```

Common tools:
- `scrape_url` - Scrape a single URL
- `crawl_url` - Crawl a website
- `search` - Search for URLs
- `extract` - Extract structured data

## Current Workflow

1. **List events** - Shows all events needing images with their URLs
2. **Scrape with Firecrawl** - Uses API (fallback) or MCP (when available)
3. **Extract images** - Finds OG image, hero, or logo
4. **Download** - Saves locally
5. **Upload** - To Supabase Storage
6. **Update DB** - Saves image_url and image_path

## Quick Start

```bash
# List and process 5 events
npm run download:images 5

# Process all events
npm run download:images
```

The script will:
- ✅ List all events with URLs
- ✅ Show which ones need images
- ✅ Process each one
- ✅ Save results to `events/enrichment/`
