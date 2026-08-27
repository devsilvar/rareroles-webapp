/**
 * Image Optimization Script
 * Converts all images to WebP and AVIF formats with responsive sizes
 * 
 * Expected results:
 * - 85% reduction in file size
 * - 7-10 MB per page → 800 KB-1.5 MB
 * - Massive navigation speed improvement
 * 
 * Usage: node scripts/optimize-images.js
 */

import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join, basename, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ASSETS_DIR = join(__dirname, '../src/assets');
const QUALITY_WEBP = 80;
const QUALITY_AVIF = 70;

// Responsive image sizes
const SIZES = [
  { width: 640, suffix: '-640w' },
  { width: 1024, suffix: '-1024w' },
  { width: 1920, suffix: '-1920w' },
];

// Image extensions to process
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.jfif'];

/**
 * Get all image files from assets directory
 */
async function getImageFiles(dir) {
  const files = await readdir(dir);
  const imageFiles = [];
  
  for (const file of files) {
    const fullPath = join(dir, file);
    const stats = await stat(fullPath);
    
    if (stats.isFile()) {
      const ext = extname(file).toLowerCase();
      if (IMAGE_EXTENSIONS.includes(ext)) {
        imageFiles.push(fullPath);
      }
    }
  }
  
  return imageFiles;
}

/**
 * Get file size in human-readable format
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Optimize a single image
 */
async function optimizeImage(inputPath) {
  const fileName = basename(inputPath);
  const fileNameWithoutExt = fileName.replace(/\.(jpg|jpeg|png|jfif)$/i, '');
  const dirName = dirname(inputPath);
  
  console.log(`\n📸 Processing: ${fileName}`);
  
  try {
    // Get original file size
    const stats = await stat(inputPath);
    const originalSize = stats.size;
    console.log(`   Original: ${formatBytes(originalSize)}`);
    
    let totalSaved = 0;
    
    // Generate responsive WebP versions
    for (const size of SIZES) {
      const outputPath = join(dirName, `${fileNameWithoutExt}${size.suffix}.webp`);
      
      await sharp(inputPath)
        .resize(size.width, null, { 
          fit: 'inside', 
          withoutEnlargement: true 
        })
        .webp({ quality: QUALITY_WEBP })
        .toFile(outputPath);
      
      const newStats = await stat(outputPath);
      console.log(`   ✓ ${fileNameWithoutExt}${size.suffix}.webp: ${formatBytes(newStats.size)}`);
      totalSaved += (originalSize - newStats.size);
    }
    
    // Generate single AVIF version (smallest, for modern browsers)
    const avifPath = join(dirName, `${fileNameWithoutExt}.avif`);
    await sharp(inputPath)
      .resize(1920, null, { fit: 'inside', withoutEnlargement: true })
      .avif({ quality: QUALITY_AVIF })
      .toFile(avifPath);
    
    const avifStats = await stat(avifPath);
    console.log(`   ✓ ${fileNameWithoutExt}.avif: ${formatBytes(avifStats.size)}`);
    
    // Generate a medium WebP as default fallback
    const defaultWebpPath = join(dirName, `${fileNameWithoutExt}.webp`);
    await sharp(inputPath)
      .resize(1024, null, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: QUALITY_WEBP })
      .toFile(defaultWebpPath);
    
    const defaultStats = await stat(defaultWebpPath);
    console.log(`   ✓ ${fileNameWithoutExt}.webp: ${formatBytes(defaultStats.size)}`);
    
    // Calculate savings
    const percentSaved = ((originalSize - avifStats.size) / originalSize * 100).toFixed(1);
    console.log(`   💰 Saved: ${percentSaved}% (AVIF vs Original)`);
    
    return {
      original: originalSize,
      optimized: avifStats.size,
      saved: originalSize - avifStats.size
    };
    
  } catch (error) {
    console.error(`   ❌ Error processing ${fileName}:`, error.message);
    return { original: 0, optimized: 0, saved: 0 };
  }
}

/**
 * Main optimization function
 */
async function optimizeAll() {
  console.log('🚀 Starting Image Optimization...\n');
  console.log(`📁 Assets directory: ${ASSETS_DIR}\n`);
  
  try {
    const imageFiles = await getImageFiles(ASSETS_DIR);
    
    if (imageFiles.length === 0) {
      console.log('❌ No images found to optimize!');
      return;
    }
    
    console.log(`Found ${imageFiles.length} images to optimize\n`);
    console.log('━'.repeat(60));
    
    let totalOriginal = 0;
    let totalOptimized = 0;
    
    for (const imagePath of imageFiles) {
      const result = await optimizeImage(imagePath);
      totalOriginal += result.original;
      totalOptimized += result.optimized;
    }
    
    console.log('\n' + '━'.repeat(60));
    console.log('\n📊 OPTIMIZATION SUMMARY\n');
    console.log(`   Total Original Size: ${formatBytes(totalOriginal)}`);
    console.log(`   Total Optimized Size: ${formatBytes(totalOptimized)}`);
    console.log(`   Total Saved: ${formatBytes(totalOriginal - totalOptimized)}`);
    console.log(`   Reduction: ${((totalOriginal - totalOptimized) / totalOriginal * 100).toFixed(1)}%`);
    console.log('\n✅ Optimization complete!\n');
    console.log('Next steps:');
    console.log('1. Update ResponsiveImage component to use new formats');
    console.log('2. Test images in browser (check Network tab)');
    console.log('3. Consider removing original large files after verification\n');
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run optimization
optimizeAll();
