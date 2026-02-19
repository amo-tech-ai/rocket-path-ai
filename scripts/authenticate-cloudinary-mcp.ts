#!/usr/bin/env tsx
/**
 * Cloudinary MCP Authentication Helper
 * 
 * This script helps you get an OAuth access token for Cloudinary MCP server
 * using the MCP Inspector tool.
 * 
 * Usage:
 *   npm run auth:cloudinary-mcp
 * 
 * Or directly:
 *   tsx scripts/authenticate-cloudinary-mcp.ts
 */

import { execSync } from 'child_process';
import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';

const MCP_SERVER_URL = 'https://asset-management.mcp.cloudinary.com/sse';
const MCP_CONFIG_PATH = path.join(process.cwd(), '.cursor', 'mcp.json');

console.log('🔐 Cloudinary MCP Authentication Helper\n');
console.log('This will help you get an OAuth access token for Cloudinary MCP.\n');

// Check if MCP Inspector is available
console.log('📦 Checking for MCP Inspector...');
try {
  execSync('npx --yes @modelcontextprotocol/inspector --version', { stdio: 'ignore' });
  console.log('✅ MCP Inspector is available\n');
} catch (error) {
  console.log('⚠️  MCP Inspector not found. Installing...');
  try {
    execSync('npm install -g @modelcontextprotocol/inspector', { stdio: 'inherit' });
    console.log('✅ MCP Inspector installed\n');
  } catch (installError) {
    console.error('❌ Failed to install MCP Inspector');
    console.error('Please install manually: npm install -g @modelcontextprotocol/inspector');
    process.exit(1);
  }
}

console.log('📋 Manual Steps Required:\n');
console.log('1. The MCP Inspector will open in your browser');
console.log('2. In the inspector:');
console.log('   - Transport type: Select "SSE"');
console.log(`   - URL: ${MCP_SERVER_URL}`);
console.log('   - Click "Open Auth Settings"');
console.log('   - Click "Quick OAuth Flow"');
console.log('   - Authorize on the OAuth screen');
console.log('   - Follow the OAuth Flow Progress steps');
console.log('   - Copy the "access_token" value when authentication completes\n');

console.log('3. Paste the access token below when prompted\n');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Ask user if they want to open inspector
rl.question('Open MCP Inspector now? (y/n): ', (answer) => {
  if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    console.log('\n🚀 Opening MCP Inspector...\n');
    try {
      execSync('npx @modelcontextprotocol/inspector', { stdio: 'inherit' });
    } catch (error) {
      console.error('❌ Failed to open MCP Inspector');
      console.error('Please run manually: npx @modelcontextprotocol/inspector');
    }
  }

  // Wait for user to complete OAuth flow
  setTimeout(() => {
    rl.question('\n📝 Paste your access_token here (or press Enter to skip): ', (token) => {
      if (token.trim()) {
        updateMCPConfig(token.trim());
      } else {
        console.log('\n⚠️  No token provided. You can update .cursor/mcp.json manually later.');
        console.log('\nTo add token manually, update the config:');
        console.log(JSON.stringify({
          'cloudinary-asset-mgmt': {
            url: MCP_SERVER_URL,
            authorization_token: 'YOUR_ACCESS_TOKEN_HERE'
          }
        }, null, 2));
      }
      rl.close();
    });
  }, 2000);
});

function updateMCPConfig(token: string) {
  try {
    // Read current config
    const configContent = fs.readFileSync(MCP_CONFIG_PATH, 'utf-8');
    const config = JSON.parse(configContent);

    // Update Cloudinary config with token
    if (!config.mcpServers) {
      config.mcpServers = {};
    }

    config.mcpServers['cloudinary-asset-mgmt'] = {
      url: MCP_SERVER_URL,
      authorization_token: token
    };

    // Write updated config
    fs.writeFileSync(MCP_CONFIG_PATH, JSON.stringify(config, null, 2));

    console.log('\n✅ Updated .cursor/mcp.json with access token');
    console.log('\n🔄 Next steps:');
    console.log('1. Restart Cursor completely');
    console.log('2. Check Settings → Tools & MCP');
    console.log('3. cloudinary-asset-mgmt should show "Connected"');
    console.log('\n✅ Authentication complete!');
  } catch (error: any) {
    console.error('\n❌ Failed to update config:', error.message);
    console.log('\n📝 Manual update required:');
    console.log(`Add to .cursor/mcp.json:`);
    console.log(JSON.stringify({
      'cloudinary-asset-mgmt': {
        url: MCP_SERVER_URL,
        authorization_token: token
      }
    }, null, 2));
  }
}
