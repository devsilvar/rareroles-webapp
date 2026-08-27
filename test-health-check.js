/**
 * Health Check Test Script
 * 
 * Purpose: Quickly test if your health check endpoint is working
 * Usage: node test-health-check.js
 */

async function testHealthCheck() {
  console.log('🏥 Testing RareRoles Health Check Endpoint...\n');

  const url = 'https://rarerolestechnologies.com/.netlify/functions/health';
  
  try {
    const startTime = Date.now();
    const response = await fetch(url);
    const endTime = Date.now();
    const data = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('⏱️  Response Time:', (endTime - startTime) + 'ms\n');
    
    console.log('📦 Health Check Results:');
    console.log('   Overall Status:', data.status);
    console.log('   Timestamp:', data.timestamp);
    console.log('   Total Latency:', data.totalLatency + 'ms\n');
    
    if (data.checks) {
      console.log('🖥️  Application:');
      console.log('   Status:', data.checks.application.status);
      console.log('   Version:', data.checks.application.version);
      console.log('   Environment:', data.checks.application.environment);
      console.log('');
      
      console.log('💾 Database:');
      console.log('   Status:', data.checks.database.status);
      console.log('   Latency:', data.checks.database.latency + 'ms');
      console.log('   Accessible:', data.checks.database.accessible);
      console.log('');
    }
    
    if (data.status === 'healthy') {
      console.log('✅ SUCCESS! All systems operational');
      console.log('   Your health check is working correctly.');
      console.log('   You can now set up UptimeRobot monitoring.');
    } else if (data.status === 'degraded') {
      console.log('⚠️  WARNING! System is degraded');
      console.log('   Some services may not be fully operational.');
      console.log('   Check the details above for more information.');
    } else {
      console.log('❌ FAILURE! System is unhealthy');
      console.log('   Error:', data.error);
      console.log('   Please troubleshoot using HEALTH_CHECK_SETUP.md');
    }
    
    console.log('\n📍 Endpoint URL:', url);
    console.log('📖 Full Guide: HEALTH_CHECK_SETUP.md');
    
  } catch (error) {
    console.log('❌ FAILURE! Health check failed\n');
    console.log('Error:', error.message);
    console.log('\n🔍 Troubleshooting:');
    console.log('   1. Is the site deployed? Check Netlify dashboard');
    console.log('   2. Is the health function deployed? Check netlify/functions/health.js');
    console.log('   3. Are environment variables set? Check Netlify env vars');
    console.log('   4. Is Supabase running? Check https://status.supabase.com');
    console.log('\n📖 Full Guide: HEALTH_CHECK_SETUP.md');
  }
}

// Run the test
testHealthCheck();
