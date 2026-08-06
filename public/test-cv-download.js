// Quick Cloudinary CV Download Test Script
// Run in browser console on the admin talent page

(async function testCVDownload() {
  console.log('🔧 Cloudinary CV Download Test Starting...\n');
  
  // Configuration
  const CLOUD_NAME = 'rkgr2tc2';
  const TEST_PUBLIC_ID = 'rareroles/cvs/test/sample'; // Adjust based on your data
  
  // Test 1: Check Configuration
  console.log('✅ Test 1: Configuration Check');
  console.log('Cloud Name:', CLOUD_NAME);
  console.log('');
  
  // Test 2: Generate URLs
  console.log('✅ Test 2: URL Generation');
  const urls = {
    public: `https://res.cloudinary.com/${CLOUD_NAME}/raw/upload/${TEST_PUBLIC_ID}.pdf`,
    authenticated: `https://res.cloudinary.com/${CLOUD_NAME}/raw/authenticated/${TEST_PUBLIC_ID}.pdf`,
    withDownload: `https://res.cloudinary.com/${CLOUD_NAME}/raw/upload/fl_attachment:CV.pdf/${TEST_PUBLIC_ID}.pdf`,
  };
  
  console.log('Public URL:', urls.public);
  console.log('Authenticated URL:', urls.authenticated);
  console.log('Download URL:', urls.withDownload);
  console.log('');
  
  // Test 3: Test Accessibility
  console.log('✅ Test 3: Testing URL Accessibility');
  
  for (const [type, url] of Object.entries(urls)) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        console.log(`✅ ${type}: SUCCESS (${response.status})`);
      } else {
        console.log(`❌ ${type}: FAILED (${response.status} ${response.statusText})`);
        if (response.status === 401) {
          console.log('   🔒 401 = Upload preset is set to AUTHENTICATED delivery');
          console.log('   💡 Fix: Change to PUBLIC in Cloudinary Dashboard');
        }
      }
    } catch (error) {
      console.log(`❌ ${type}: ERROR`, error.message);
    }
  }
  
  console.log('');
  console.log('📋 DIAGNOSIS COMPLETE');
  console.log('');
  console.log('If all URLs show 401:');
  console.log('1. Go to https://cloudinary.com/console');
  console.log('2. Settings → Upload → Upload Presets');
  console.log('3. Edit "sember_preset"');
  console.log('4. Change delivery type to "public"');
  console.log('5. Save and restart dev server');
  console.log('');
  console.log('🧪 Want to test with real CV URL?');
  console.log('Run: testRealCV("YOUR_CV_URL")');
  
  // Make testRealCV available globally
  window.testRealCV = async function(url) {
    console.log('🧪 Testing real CV URL:', url);
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        console.log('✅ URL is accessible!');
        console.log('Status:', response.status);
        console.log('Trying download...');
        
        // Try download
        const downloadResponse = await fetch(url);
        if (downloadResponse.ok) {
          const blob = await downloadResponse.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = 'CV.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);
          console.log('✅ Download successful!');
        }
      } else {
        console.log('❌ URL is NOT accessible');
        console.log('Status:', response.status, response.statusText);
        if (response.status === 401) {
          console.log('🔒 401 UNAUTHORIZED - Upload preset is authenticated');
          console.log('💡 Change to public in Cloudinary Dashboard');
        }
      }
    } catch (error) {
      console.log('❌ Error:', error.message);
    }
  };
})();
