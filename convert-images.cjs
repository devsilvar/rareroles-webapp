/**
 * Image Optimization Script
 * Converts heavy images (>500KB) to WebP format with 80% quality
 * Reduces image sizes by ~75% while maintaining visual quality
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'src', 'assets');

// Heavy images to convert (>500KB)
const imagesToConvert = [
  'fintech.jpg',      // 2027 KB
  'telecom.jpg',      // 2019 KB
  'r1.jpg',           // 1809 KB
  'blacklady.jpg',    // 1108 KB
  'techgirl.jpg',     // 1040 KB
  'blackladywihlaptop.jpg', // 778 KB
  'r2.jpg',           // 357 KB - included for consistency
  'heroo.jpg',        // 352 KB - used in hero sections
  'vision.jpg',       // 352 KB
  'hiring.jpg',       // 333 KB
  'prepare.jpg',      // 280 KB
];

async function convertToWebP(filename) {
  const inputPath = path.join(assetsDir, filename);
  const outputFilename = filename.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  const outputPath = path.join(assetsDir, outputFilename);

  try {
    // Check if input file exists
    if (!fs.existsSync(inputPath)) {
      console.log(`❌ File not found: ${filename}`);
      return;
    }

    // Get original file size
    const originalStats = fs.statSync(inputPath);
    const originalSizeKB = (originalStats.size / 1024).toFixed(2);

    // Convert to WebP with 80% quality
    await sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath);

    // Get new file size
    const newStats = fs.statSync(outputPath);
    const newSizeKB = (newStats.size / 1024).toFixed(2);
    const reduction = (((originalStats.size - newStats.size) / originalStats.size) * 100).toFixed(1);

    console.log(`✅ ${filename} → ${outputFilename}`);
    console.log(`   ${originalSizeKB} KB → ${newSizeKB} KB (${reduction}% reduction)`);
  } catch (error) {
    console.error(`❌ Error converting ${filename}:`, error.message);
  }
}

async function convertAllImages() {
  console.log('🖼️  Starting image optimization...\n');
  console.log(`Converting ${imagesToConvert.length} heavy images to WebP format\n`);

  let totalOriginal = 0;
  let totalNew = 0;

  for (const filename of imagesToConvert) {
    const inputPath = path.join(assetsDir, filename);
    if (fs.existsSync(inputPath)) {
      const originalStats = fs.statSync(inputPath);
      totalOriginal += originalStats.size;
    }
    await convertToWebP(filename);
    
    const outputFilename = filename.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    const outputPath = path.join(assetsDir, outputFilename);
    if (fs.existsSync(outputPath)) {
      const newStats = fs.statSync(outputPath);
      totalNew += newStats.size;
    }
    console.log('');
  }

  const totalOriginalMB = (totalOriginal / 1024 / 1024).toFixed(2);
  const totalNewMB = (totalNew / 1024 / 1024).toFixed(2);
  const totalReduction = (((totalOriginal - totalNew) / totalOriginal) * 100).toFixed(1);
  const spaceSaved = ((totalOriginal - totalNew) / 1024 / 1024).toFixed(2);

  console.log('═══════════════════════════════════════');
  console.log('📊 OPTIMIZATION SUMMARY');
  console.log('═══════════════════════════════════════');
  console.log(`Total original size: ${totalOriginalMB} MB`);
  console.log(`Total optimized size: ${totalNewMB} MB`);
  console.log(`Total reduction: ${totalReduction}%`);
  console.log(`Space saved: ${spaceSaved} MB`);
  console.log('═══════════════════════════════════════');
  console.log('\n✨ Image optimization complete!');
  console.log('📝 Original JPG files kept as fallback for older browsers');
}

// Run the conversion
convertAllImages().catch(console.error);
