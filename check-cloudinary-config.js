/**
 * Cloudinary Configuration Checker
 * 
 * Run this in your browser console to check current Cloudinary setup
 * Copy-paste the entire script into DevTools console
 */

(function checkCloudinaryConfig() {
  console.clear();
  console.log('%c🔧 Cloudinary Configuration Check', 'font-size: 20px; font-weight: bold; color: #667eea;');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #cbd5e0;');
  console.log('');

  // Check environment variables
  const cloudName = import.meta?.env?.VITE_CLOUDINARY_CLOUD_NAME || 
                    process.env?.VITE_CLOUDINARY_CLOUD_NAME ||
                    window.VITE_CLOUDINARY_CLOUD_NAME;
  
  const uploadPreset = import.meta?.env?.VITE_CLOUDINARY_UPLOAD_PRESET || 
                       process.env?.VITE_CLOUDINARY_UPLOAD_PRESET ||
                       window.VITE_CLOUDINARY_UPLOAD_PRESET;

  console.log('%c📋 Environment Variables', 'font-size: 16px; font-weight: bold; color: #4a5568;');
  console.log('');
  
  if (cloudName) {
    console.log('%c✅ VITE_CLOUDINARY_CLOUD_NAME:', 'color: #48bb78; font-weight: bold;', cloudName);
  } else {
    console.log('%c❌ VITE_CLOUDINARY_CLOUD_NAME:', 'color: #f56565; font-weight: bold;', 'NOT FOUND');
    console.log('%c   → Check your .env file and restart dev server', 'color: #718096;');
  }

  if (uploadPreset) {
    console.log('%c✅ VITE_CLOUDINARY_UPLOAD_PRESET:', 'color: #48bb78; font-weight: bold;', uploadPreset);
  } else {
    console.log('%c❌ VITE_CLOUDINARY_UPLOAD_PRESET:', 'color: #f56565; font-weight: bold;', 'NOT FOUND');
    console.log('%c   → Check your .env file and restart dev server', 'color: #718096;');
  }

  console.log('');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #cbd5e0;');
  console.log('');

  // Test URLs
  if (cloudName && uploadPreset) {
    console.log('%c🧪 Testing Cloudinary Upload Endpoint', 'font-size: 16px; font-weight: bold; color: #4a5568;');
    console.log('');

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`;
    console.log('%c📤 Upload Endpoint:', 'font-weight: bold;', uploadUrl);
    console.log('');

    // Test if we can reach Cloudinary
    console.log('%c⏳ Testing connection...', 'color: #ed8936;');
    
    fetch(uploadUrl, {
      method: 'OPTIONS',
    })
      .then(() => {
        console.log('%c✅ Cloudinary API is reachable', 'color: #48bb78; font-weight: bold;');
        console.log('');
        console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #cbd5e0;');
        console.log('');
        console.log('%c🔍 Next Steps:', 'font-size: 16px; font-weight: bold; color: #4a5568;');
        console.log('');
        console.log('%c1. Go to: https://console.cloudinary.com/', 'color: #2d3748;');
        console.log('%c2. Navigate to: Settings → Upload → Upload Presets', 'color: #2d3748;');
        console.log('%c3. Edit preset: ' + uploadPreset, 'color: #2d3748;');
        console.log('%c4. Verify these settings:', 'color: #2d3748;');
        console.log('');
        console.log('%c   ✓ Signing Mode = Unsigned', 'color: #667eea; font-weight: bold;');
        console.log('%c   ✓ Delivery Type = Public (NOT Authenticated)', 'color: #667eea; font-weight: bold;');
        console.log('%c   ✓ Resource Type = Raw (enabled)', 'color: #667eea; font-weight: bold;');
        console.log('');
        console.log('%c5. Save and test with: test-cloudinary-upload.html', 'color: #2d3748;');
        console.log('');
        console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #cbd5e0;');
        console.log('');
        console.log('%c📁 Test Files Created:', 'font-size: 16px; font-weight: bold; color: #4a5568;');
        console.log('');
        console.log('%c • test-cloudinary-upload.html', 'color: #4299e1;', '→ Interactive upload test');
        console.log('%c • CLOUDINARY_FIX_SUMMARY.md', 'color: #4299e1;', '→ Quick fix guide');
        console.log('%c • YOUR_SETTINGS_ANALYSIS.md', 'color: #4299e1;', '→ Your settings analysis');
        console.log('%c • CLOUDINARY_TROUBLESHOOTING.md', 'color: #4299e1;', '→ Complete guide');
        console.log('');
      })
      .catch((error) => {
        console.log('%c❌ Cannot reach Cloudinary API', 'color: #f56565; font-weight: bold;');
        console.log('%c   Error:', 'color: #718096;', error.message);
        console.log('%c   → Check your internet connection', 'color: #718096;');
      });

  } else {
    console.log('%c⚠️  Cannot test - environment variables missing', 'color: #ed8936; font-weight: bold;');
    console.log('');
    console.log('%c🔧 Fix:', 'font-size: 16px; font-weight: bold; color: #4a5568;');
    console.log('');
    console.log('%c1. Check your .env file contains:', 'color: #2d3748;');
    console.log('%c   VITE_CLOUDINARY_CLOUD_NAME=rkgr2tc2', 'color: #667eea; font-family: monospace;');
    console.log('%c   VITE_CLOUDINARY_UPLOAD_PRESET=sember_preset', 'color: #667eea; font-family: monospace;');
    console.log('');
    console.log('%c2. Restart your dev server:', 'color: #2d3748;');
    console.log('%c   npm run dev', 'color: #667eea; font-family: monospace;');
    console.log('');
    console.log('%c3. Refresh this page and run this script again', 'color: #2d3748;');
    console.log('');
  }

  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #cbd5e0;');
  console.log('');
  console.log('%c💡 Tip: Use test-cloudinary-upload.html for detailed testing', 'color: #4299e1; font-style: italic;');
  console.log('');

})();
