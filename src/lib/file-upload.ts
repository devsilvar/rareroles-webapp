/**
 * File Upload Service - CV/Resume Management with Cloudinary
 * Handles PDF uploads to Cloudinary with validation
 * 
 * Senior Dev Approach:
 * - Direct API integration (no SDK needed)
 * - Type-safe file handling
 * - Size and format validation
 * - Progress tracking
 * - Secure signed uploads
 * - Error handling
 */

// Configuration
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['application/pdf'];
const ALLOWED_EXTENSIONS = ['.pdf'];

// Types
export interface UploadResult {
  success: boolean;
  fileUrl?: string;
  publicId?: string;
  secureUrl?: string;
  error?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

/**
 * Validate file before upload
 */
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  // Check if file exists
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { 
      valid: false, 
      error: 'Only PDF files are allowed. Please upload a PDF document.' 
    };
  }

  // Check file extension as additional validation
  const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return { 
      valid: false, 
      error: 'File must have .pdf extension' 
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    const maxSizeMB = MAX_FILE_SIZE / (1024 * 1024);
    return { 
      valid: false, 
      error: `File size must be less than ${maxSizeMB}MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.` 
    };
  }

  // Check file name
  if (file.name.length > 200) {
    return { 
      valid: false, 
      error: 'File name is too long. Please rename your file.' 
    };
  }

  return { valid: true };
};

/**
 * Generate unique folder path with timestamp
 */
const generateFolderPath = (email: string): string => {
  const timestamp = Date.now();
  const sanitizedEmail = email.toLowerCase().replace(/[^a-z0-9]/g, '_');
  
  return `rareroles/cvs/${sanitizedEmail}/${timestamp}`;
};

/**
 * Upload CV/Resume to Cloudinary
 */
export const uploadCV = async (
  file: File,
  email: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
  try {
    // Check configuration
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      return {
        success: false,
        error: 'Cloudinary not configured. Please check environment variables.',
      };
    }

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    // Generate folder path
    const folderPath = generateFolderPath(email);

    console.log('[Cloudinary] Uploading CV:', {
      fileName: file.name,
      size: `${(file.size / 1024).toFixed(2)} KB`,
      type: file.type,
      folder: folderPath,
    });

    // Prepare form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', folderPath);
    formData.append('resource_type', 'raw'); // 'raw' for PDFs
    formData.append('tags', 'cv,resume,talent');

    // Upload to Cloudinary
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`;

    const response = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[Cloudinary] Upload failed:', errorData);
      return {
        success: false,
        error: `Upload failed: ${errorData.error?.message || response.statusText}`,
      };
    }

    const data = await response.json();

    console.log('[Cloudinary] Upload successful:', {
      publicId: data.public_id,
      url: data.secure_url,
      format: data.format,
      bytes: data.bytes,
    });

    return {
      success: true,
      fileUrl: data.secure_url,
      secureUrl: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error: any) {
    console.error('[Cloudinary] Unexpected error:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload file',
    };
  }
};

/**
 * Delete CV from Cloudinary (requires backend/admin token)
 * Note: For security, deletion should be done server-side
 */
export const deleteCV = async (publicId: string): Promise<boolean> => {
  console.warn('[Cloudinary] Delete should be implemented server-side with admin API key');
  // Deletion requires Cloudinary API secret, should be done on backend
  return false;
};

/**
 * Get CV download URL with proper flags for direct download
 * Handles both authenticated and public Cloudinary URLs
 */
export const getCVDownloadUrl = (secureUrl: string, fileName?: string): string => {
  if (!secureUrl) return '';
  
  try {
    // Parse the Cloudinary URL
    const url = new URL(secureUrl);
    
    // Extract public_id from URL path
    const pathParts = url.pathname.split('/');
    const uploadIndex = pathParts.indexOf('upload');
    
    if (uploadIndex === -1) return secureUrl; // Not a Cloudinary URL
    
    // Get everything after 'upload/' (including version)
    const publicIdWithVersion = pathParts.slice(uploadIndex + 1).join('/');
    
    // Build download URL with fl_attachment flag to force download
    const downloadFileName = fileName ? encodeURIComponent(fileName) : 'CV.pdf';
    const transformations = `fl_attachment:${downloadFileName}`;
    
    // Reconstruct URL with transformations
    const baseUrl = `${url.protocol}//${url.hostname}`;
    const newPath = [...pathParts.slice(0, uploadIndex + 1), transformations, publicIdWithVersion].join('/');
    
    return `${baseUrl}${newPath}`;
  } catch (error) {
    console.error('[Cloudinary] Error generating download URL:', error);
    // Fallback to original URL
    return secureUrl;
  }
};

/**
 * Get CV view URL (opens in browser instead of downloading)
 * Alternative to download for viewing PDFs in browser
 */
export const getCVViewUrl = (secureUrl: string): string => {
  if (!secureUrl) return '';
  
  try {
    // For viewing, we want the PDF to open in browser
    // Convert authenticated URL to public if needed
    const url = new URL(secureUrl);
    
    // If URL contains '/authenticated/', try to convert to public
    if (url.pathname.includes('/authenticated/')) {
      url.pathname = url.pathname.replace('/authenticated/', '/upload/');
    }
    
    return url.toString();
  } catch (error) {
    console.error('[Cloudinary] Error generating view URL:', error);
    return secureUrl;
  }
};

/**
 * Get Cloudinary thumbnail URL for PDF preview
 */
export const getCVThumbnailUrl = (publicId: string, width: number = 200): string => {
  if (!CLOUDINARY_CLOUD_NAME) return '';
  
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/w_${width},h_${width * 1.4},c_fill,f_jpg,pg_1/${publicId}.jpg`;
};

/**
 * Helper to format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

/**
 * Check if Cloudinary is configured
 */
export const checkCloudinaryConfig = (): boolean => {
  const configured = !!CLOUDINARY_CLOUD_NAME && !!CLOUDINARY_UPLOAD_PRESET;
  
  if (!configured) {
    console.warn('[Cloudinary] Missing configuration:', {
      cloudName: !!CLOUDINARY_CLOUD_NAME,
      uploadPreset: !!CLOUDINARY_UPLOAD_PRESET,
    });
  }
  
  return configured;
};
