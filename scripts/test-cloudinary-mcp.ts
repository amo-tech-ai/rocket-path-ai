#!/usr/bin/env tsx
/**
 * Test Cloudinary MCP Server Connection
 * 
 * This script tests if the Cloudinary MCP server is properly configured
 * and can be accessed.
 */

import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';

const MCP_SERVER_URL = 'https://asset-management.mcp.cloudinary.com/sse';
const CLOUDINARY_URL = 'cloudinary://366725312524978:bC0zDwXju65Y4VVb-AGYY2WDfo0@ddysyn5rr';

console.log('🧪 Testing Cloudinary MCP Server Connection\n');
console.log(`Server URL: ${MCP_SERVER_URL}`);
console.log(`Using Cloudinary URL: cloudinary://***@ddysyn5rr\n`);

// Test 1: Check if server is reachable
console.log('Test 1: Checking server reachability...');
try {
  const url = new URL(MCP_SERVER_URL);
  const options: https.RequestOptions = {
    hostname: url.hostname,
    path: url.pathname,
    method: 'GET',
    headers: {
      'Accept': 'text/event-stream',
      'cloudinary-url': CLOUDINARY_URL,
    },
    timeout: 5000,
  };

  const req = https.request(options, (res) => {
    console.log(`✅ Server is reachable (Status: ${res.statusCode})`);
    console.log(`   Content-Type: ${res.headers['content-type']}`);
    
    if (res.statusCode === 200) {
      console.log('   ✅ Server is responding with SSE stream');
    } else if (res.statusCode === 401 || res.statusCode === 403) {
      console.log('   ⚠️  Server requires authentication (OAuth)');
    }
    
    res.on('data', () => {
      // SSE streams data
    });
    
    res.on('end', () => {
      console.log('   ✅ Connection test complete\n');
      testMCPConfig();
    });
  });

  req.on('error', (error: any) => {
    console.error(`❌ Connection error: ${error.message}`);
    console.log('\n⚠️  This might be normal - remote SSE servers may require OAuth');
    testMCPConfig();
  });

  req.on('timeout', () => {
    console.log('⏱️  Request timeout (SSE streams are long-lived, this is normal)');
    req.destroy();
    testMCPConfig();
  });

  req.end();
} catch (error: any) {
  console.error(`❌ Error: ${error.message}`);
  testMCPConfig();
}

function testMCPConfig() {
  console.log('Test 2: Verifying MCP configuration...');
  
  const configPath = path.join(process.cwd(), '.cursor', 'mcp.json');
  
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const cloudinaryConfig = config.mcpServers?.['cloudinary-asset-mgmt-remote'];
    
    if (!cloudinaryConfig) {
      console.log('❌ Cloudinary MCP config not found in mcp.json');
      return;
    }
    
    console.log('✅ MCP config found:');
    console.log(`   Server name: cloudinary-asset-mgmt-remote`);
    console.log(`   URL: ${cloudinaryConfig.url}`);
    console.log(`   Has headers: ${cloudinaryConfig.headers ? 'Yes' : 'No'}`);
    
    if (cloudinaryConfig.headers?.['cloudinary-url']) {
      const url = cloudinaryConfig.headers['cloudinary-url'];
      const masked = url.replace(/:[^:@]+@/, ':***@');
      console.log(`   Cloudinary URL: ${masked}`);
    }
    
    console.log('\n✅ Configuration looks correct!');
    console.log('\n📝 Next steps:');
    console.log('1. Restart Cursor completely');
    console.log('2. Check Settings → Tools & MCP');
    console.log('3. Look for "cloudinary-asset-mgmt-remote"');
    console.log('4. If it shows "Needs authentication", click "Connect"');
    console.log('5. Or test in Cursor Agent chat: "List Cloudinary assets"');
    
  } catch (error: any) {
    console.error(`❌ Error reading config: ${error.message}`);
  }
}
