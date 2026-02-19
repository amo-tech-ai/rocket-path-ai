#!/bin/bash

# Firecrawl MCP Test Script
# Verifies MCP configuration and API key

echo "🔍 Testing Firecrawl MCP Configuration..."
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
  echo "❌ .env.local not found"
  exit 1
fi

# Check if API key is set
if grep -q "FIRECRAWL_API_KEY" .env.local; then
  echo "✅ FIRECRAWL_API_KEY found in .env.local"
  API_KEY=$(grep "FIRECRAWL_API_KEY" .env.local | cut -d '=' -f2)
  if [ -n "$API_KEY" ]; then
    echo "   Key: ${API_KEY:0:10}..."
  else
    echo "❌ API key is empty"
    exit 1
  fi
else
  echo "❌ FIRECRAWL_API_KEY not found in .env.local"
  exit 1
fi

# Check if MCP config exists
if [ ! -f ".cursor/mcp.json" ]; then
  echo "❌ .cursor/mcp.json not found"
  exit 1
fi

# Check if firecrawl-mcp is configured
if grep -q "firecrawl-mcp" .cursor/mcp.json; then
  echo "✅ firecrawl-mcp found in .cursor/mcp.json"
else
  echo "❌ firecrawl-mcp not found in .cursor/mcp.json"
  exit 1
fi

# Validate JSON
if command -v jq &> /dev/null; then
  if jq empty .cursor/mcp.json 2>/dev/null; then
    echo "✅ MCP configuration JSON is valid"
  else
    echo "❌ MCP configuration JSON is invalid"
    exit 1
  fi
fi

echo ""
echo "✅ All configuration checks passed!"
echo ""
echo "📝 Next steps:"
echo "   1. Restart Cursor to load the new MCP configuration"
echo "   2. Check MCP tools in: ~/.cursor/projects/home-sk-startupai16L/mcps/firecrawl-mcp/"
echo "   3. Test in Cursor chat: 'Use Firecrawl to scrape https://example.com'"
echo ""
