/**
 * Supabase Key Verification Script
 * Run: node verify-supabase-key.js
 * 
 * This will decode your JWT token and verify it matches your project URL
 */

import { readFileSync } from 'fs';
import { Buffer } from 'buffer';

// Read .env file
const envFile = readFileSync('.env', 'utf8');
const envVars = {};

envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

function decodeJWT(token) {
  try {
    // JWT format: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { error: 'Invalid JWT format - should have 3 parts separated by dots' };
    }

    // Decode the payload (second part)
    const payload = Buffer.from(parts[1], 'base64').toString('utf8');
    return JSON.parse(payload);
  } catch (error) {
    return { error: `Failed to decode JWT: ${error.message}` };
  }
}

console.log('\n🔍 Supabase Configuration Verification\n');
console.log('='.repeat(60));

// Get environment variables
const url = envVars.VITE_SUPABASE_URL;
const key = envVars.VITE_SUPABASE_PUBLISHABLE_KEY;

// Extract project ID from URL
const urlMatch = url?.match(/https:\/\/([^.]+)\.supabase\.co/);
const projectIdFromUrl = urlMatch ? urlMatch[1] : null;

console.log('\n📋 Current Configuration:');
console.log('─'.repeat(60));
console.log(`URL:        ${url}`);
console.log(`Project ID: ${projectIdFromUrl}`);
console.log(`Key:        ${key ? key.substring(0, 30) + '...' : 'MISSING'}`);

if (!url || !key) {
  console.log('\n❌ ERROR: Missing environment variables!');
  console.log('Make sure your .env file has:');
  console.log('  - VITE_SUPABASE_URL');
  console.log('  - VITE_SUPABASE_PUBLISHABLE_KEY');
  process.exit(1);
}

// Decode the JWT
console.log('\n🔓 Decoding JWT Token:');
console.log('─'.repeat(60));

const decoded = decodeJWT(key);

if (decoded.error) {
  console.log(`❌ ${decoded.error}`);
  process.exit(1);
}

console.log(JSON.stringify(decoded, null, 2));

// Verify match
console.log('\n✅ Verification Results:');
console.log('─'.repeat(60));

const projectIdFromKey = decoded.ref;
const isValid = projectIdFromUrl === projectIdFromKey;

if (isValid) {
  console.log('✅ SUCCESS: Project IDs match!');
  console.log(`   URL project:  ${projectIdFromUrl}`);
  console.log(`   Key project:  ${projectIdFromKey}`);
  console.log('\n✅ Your configuration is correct!');
  console.log('   The "Invalid API key" error might be due to:');
  console.log('   1. Key not activated yet (wait a few minutes)');
  console.log('   2. Browser cache (clear it and restart dev server)');
  console.log('   3. RLS policies (run diagnose-and-fix.sql)');
} else {
  console.log('❌ MISMATCH DETECTED!');
  console.log(`   URL project:  ${projectIdFromUrl}`);
  console.log(`   Key project:  ${projectIdFromKey}`);
  console.log('\n🔧 How to fix:');
  console.log(`   1. Go to: https://supabase.com/dashboard/project/${projectIdFromUrl}/settings/api`);
  console.log('   2. Copy the "anon public" key');
  console.log('   3. Update VITE_SUPABASE_PUBLISHABLE_KEY in .env');
  console.log('   4. Restart your dev server');
}

console.log('\n' + '='.repeat(60) + '\n');
