/**
 * Cloudinary Advanced URL Utilities
 * Handles authenticated URLs, signed URLs, and transformations
 * 
 * For Senior Engineers: This handles the 401 error by providing multiple download strategies
 */

// Configuration
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

/**
 * Extract public ID from Cloudinary URL
 */
export const extractPublicId = (cloudinaryUrl: string): string | null => {
  try {
    const url = new URL(cloudinaryUrl);
    const pathParts = url.pathname.split('/');
    const uploadIndex = pathParts.indexOf('upload');
    
    if (uploadIndex === -1) return null;
    
    // Get everything after 'upload/' and remove version number if present
    const parts = pathParts.slice(uploadIndex + 1);
    
    // Remove version (v123456789) if present
    if (parts[0] && parts[0].startsWith('v') && !isNaN(Number(parts[0].substring(1)))) {
      parts.shift();
    }
    
    return parts.join('/').replace(/\.[^/.]+$/, ''); // Remove extension
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return null;
  }
};

/**
 * Convert authenticated URL to public URL
 * Handles the case where upload preset creates authenticated URLs
 */
export const convertToPublicUrl = (url: string): string => {
  if (!url) return '';
  
  try {
    // Replace /authenticated/ with /upload/ in path
    return url.replace('/authenticated/', '/upload/');
  } catch (error) {
    console.error('Error converting to public URL:', error);
    return url;
  }
};

/**
 * Generate Cloudinary URL with transformations
 * This creates a fresh public URL from the public_id
 */
export const generateCloudinaryUrl = (
  publicId: string,
  options: {
    resourceType?: 'image' | 'video' | 'raw';
    transformations?: string[];
    version?: string;
    forceDownload?: boolean;
    fileName?: string;
  } = {}
): string => {
  if (!CLOUDINARY_CLOUD_NAME || !publicId) return '';
  
  const {
    resourceType = 'raw',
    transformations = [],
    version,
    forceDownload = false,
    fileName,
  } = options;
  
  // Add download transformation if needed
  if (forceDownload) {
    const downloadName = fileName ? encodeURIComponent(fileName) : 'download.pdf';
    transformations.push(`fl_attachment:${downloadName}`);
  }
  
  // Build URL parts
  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;
  const transformPart = transformations.length > 0 ? `/${transformations.join(',')}` : '';
  const versionPart = version ? `/v${version}` : '';
  
  return `${baseUrl}${transformPart}${versionPart}/${publicId}`;
};

/**
 * Get multiple download strategies for CV
 * Returns array of URLs to try in order
 */
export const getCVDownloadStrategies = (cv_url: string, fileName?: string): string[] => {
  if (!cv_url) return [];
  
  const strategies: string[] = [];
  const publicId = extractPublicId(cv_url);
  
  // Strategy 1: Original URL (might work if public)
  strategies.push(cv_url);
  
  // Strategy 2: Convert authenticated to public
  const publicUrl = convertToPublicUrl(cv_url);
  if (publicUrl !== cv_url) {
    strategies.push(publicUrl);
  }
  
  // Strategy 3: Generate fresh public URL with download flag
  if (publicId && CLOUDINARY_CLOUD_NAME) {
    const downloadUrl = generateCloudinaryUrl(publicId, {
      resourceType: 'raw',
      forceDownload: true,
      fileName: fileName || 'CV.pdf',
    });
    strategies.push(downloadUrl);
  }
  
  // Strategy 4: Public URL without download flag (for viewing)
  if (publicId && CLOUDINARY_CLOUD_NAME) {
    const viewUrl = generateCloudinaryUrl(publicId, {
      resourceType: 'raw',
      forceDownload: false,
    });
    strategies.push(viewUrl);
  }
  
  return strategies;
};

/**
 * Advanced CV download with fallback strategies
 * Tries multiple methods to handle 401 errors
 */
export const downloadCVWithFallback = async (
  cv_url: string,
  fileName?: string
): Promise<{ success: boolean; method?: string; error?: string }> => {
  const strategies = getCVDownloadStrategies(cv_url, fileName);
  
  console.log('[CV Download] Trying strategies:', strategies);
  
  for (let i = 0; i < strategies.length; i++) {
    const url = strategies[i];
    const strategyName = `Strategy ${i + 1}`;
    
    try {
      console.log(`[CV Download] ${strategyName}: Trying ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
      });
      
      if (response.ok) {
        // Success! Download the file
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName || 'CV.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
        
        console.log(`[CV Download] ${strategyName}: SUCCESS`);
        return { success: true, method: strategyName };
      } else {
        console.warn(`[CV Download] ${strategyName}: Failed with status ${response.status}`);
      }
    } catch (error: any) {
      console.warn(`[CV Download] ${strategyName}: Error -`, error.message);
    }
  }
  
  // All strategies failed - try opening in new tab as last resort
  console.warn('[CV Download] All strategies failed. Opening in new tab...');
  const newWindow = window.open(strategies[0], '_blank');
  
  if (newWindow) {
    return { success: true, method: 'New Tab Fallback' };
  }
  
  return { 
    success: false, 
    error: 'All download strategies failed. Please check Cloudinary upload preset configuration.' 
  };
};

/**
 * Check if URL is accessible (not 401)
 */
export const testCloudinaryUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * Validate Cloudinary configuration
 */
export const validateCloudinaryConfig = (): { 
  valid: boolean; 
  issues: string[] 
} => {
  const issues: string[] = [];
  
  if (!CLOUDINARY_CLOUD_NAME) {
    issues.push('VITE_CLOUDINARY_CLOUD_NAME not configured');
  }
  
  if (!import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET) {
    issues.push('VITE_CLOUDINARY_UPLOAD_PRESET not configured');
  }
  
  return {
    valid: issues.length === 0,
    issues,
  };
};
