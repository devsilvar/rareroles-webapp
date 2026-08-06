/**
 * Data Sync Orchestration
 * Coordinates dual-write to Supabase + Google Apps Script
 * 
 * Senior Dev Approach:
 * - Parallel writes for performance
 * - Detailed error tracking
 * - Graceful degradation
 * - Promise.allSettled for non-blocking failures
 */

import { saveHiringEnquiry, saveTalentSubmission, saveContact } from './supabase';
import { sendToGoogleAppsScript } from './google-apps-script';

// Types
export interface SyncResult {
  supabase: { success: boolean; error?: string; data?: any };
  googleAppsScript: { success: boolean; error?: string; id?: string };
  overall: 'success' | 'partial' | 'failed';
  timestamp: string;
}

interface HiringData {
  company: string;
  contact_name: string;
  email: string;
  phone?: string;
  location?: string;
  roles: Array<{ title: string; count: number }>;
  seniority?: string;
  timeline?: string;
  details?: string;
}

interface TalentData {
  name: string;
  email: string;
  phone?: string;
  desired_role: string;
  custom_role?: string;
  experience?: string;
  location?: string;
  links?: string;
  about?: string;
  cv_url?: string;
  cv_file_path?: string;
  cv_file_name?: string;
}

interface ContactData {
  name: string;
  email: string;
  company?: string;
  message: string;
  source: string;
}

/**
 * Sync hiring enquiry to both destinations
 */
export const syncHiringEnquiry = async (
  data: HiringData
): Promise<SyncResult> => {
  const timestamp = new Date().toISOString();
  console.log('[DataSync] Starting hiring enquiry sync');

  // Parallel writes using Promise.allSettled (doesn't throw on single failure)
  const [supabaseResult, googleResult] = await Promise.allSettled([
    saveHiringEnquiry(data),
    sendToGoogleAppsScript('hiring', data),
  ]);

  // Process Supabase result
  const supabase = {
    success: supabaseResult.status === 'fulfilled',
    error:
      supabaseResult.status === 'rejected'
        ? supabaseResult.reason?.message
        : undefined,
    data: supabaseResult.status === 'fulfilled' ? supabaseResult.value : undefined,
  };

  // Process Google Apps Script result
  const googleAppsScript = {
    success:
      googleResult.status === 'fulfilled' && googleResult.value.success,
    error:
      googleResult.status === 'rejected'
        ? googleResult.reason?.message
        : googleResult.status === 'fulfilled'
        ? googleResult.value.error
        : undefined,
    id:
      googleResult.status === 'fulfilled' ? googleResult.value.id : undefined,
  };

  // Determine overall status
  let overall: 'success' | 'partial' | 'failed';
  if (supabase.success && googleAppsScript.success) {
    overall = 'success';
  } else if (supabase.success || googleAppsScript.success) {
    overall = 'partial';
  } else {
    overall = 'failed';
  }

  const result: SyncResult = {
    supabase,
    googleAppsScript,
    overall,
    timestamp,
  };

  console.log('[DataSync] Hiring enquiry sync complete:', overall, result);
  return result;
};

/**
 * Sync talent submission to both destinations
 */
export const syncTalentSubmission = async (
  data: TalentData
): Promise<SyncResult> => {
  const timestamp = new Date().toISOString();
  console.log('[DataSync] Starting talent submission sync');

  const [supabaseResult, googleResult] = await Promise.allSettled([
    saveTalentSubmission(data),
    sendToGoogleAppsScript('talent', data),
  ]);

  const supabase = {
    success: supabaseResult.status === 'fulfilled',
    error:
      supabaseResult.status === 'rejected'
        ? supabaseResult.reason?.message
        : undefined,
    data: supabaseResult.status === 'fulfilled' ? supabaseResult.value : undefined,
  };

  const googleAppsScript = {
    success:
      googleResult.status === 'fulfilled' && googleResult.value.success,
    error:
      googleResult.status === 'rejected'
        ? googleResult.reason?.message
        : googleResult.status === 'fulfilled'
        ? googleResult.value.error
        : undefined,
    id:
      googleResult.status === 'fulfilled' ? googleResult.value.id : undefined,
  };

  let overall: 'success' | 'partial' | 'failed';
  if (supabase.success && googleAppsScript.success) {
    overall = 'success';
  } else if (supabase.success || googleAppsScript.success) {
    overall = 'partial';
  } else {
    overall = 'failed';
  }

  const result: SyncResult = {
    supabase,
    googleAppsScript,
    overall,
    timestamp,
  };

  console.log('[DataSync] Talent submission sync complete:', overall, result);
  return result;
};

/**
 * Sync contact form to both destinations
 */
export const syncContact = async (data: ContactData): Promise<SyncResult> => {
  const timestamp = new Date().toISOString();
  console.log('[DataSync] Starting contact sync');

  const [supabaseResult, googleResult] = await Promise.allSettled([
    saveContact(data),
    sendToGoogleAppsScript('contact', data),
  ]);

  const supabase = {
    success: supabaseResult.status === 'fulfilled',
    error:
      supabaseResult.status === 'rejected'
        ? supabaseResult.reason?.message
        : undefined,
    data: supabaseResult.status === 'fulfilled' ? supabaseResult.value : undefined,
  };

  const googleAppsScript = {
    success:
      googleResult.status === 'fulfilled' && googleResult.value.success,
    error:
      googleResult.status === 'rejected'
        ? googleResult.reason?.message
        : googleResult.status === 'fulfilled'
        ? googleResult.value.error
        : undefined,
    id:
      googleResult.status === 'fulfilled' ? googleResult.value.id : undefined,
  };

  let overall: 'success' | 'partial' | 'failed';
  if (supabase.success && googleAppsScript.success) {
    overall = 'success';
  } else if (supabase.success || googleAppsScript.success) {
    overall = 'partial';
  } else {
    overall = 'failed';
  }

  const result: SyncResult = {
    supabase,
    googleAppsScript,
    overall,
    timestamp,
  };

  console.log('[DataSync] Contact sync complete:', overall, result);
  return result;
};

/**
 * Get sync statistics (useful for admin dashboard)
 */
export const getSyncStats = (results: SyncResult[]) => {
  const total = results.length;
  const successful = results.filter((r) => r.overall === 'success').length;
  const partial = results.filter((r) => r.overall === 'partial').length;
  const failed = results.filter((r) => r.overall === 'failed').length;

  const supabaseSuccess = results.filter((r) => r.supabase.success).length;
  const googleSuccess = results.filter((r) => r.googleAppsScript.success).length;

  return {
    total,
    successful,
    partial,
    failed,
    successRate: total > 0 ? ((successful / total) * 100).toFixed(1) : '0',
    supabase: {
      success: supabaseSuccess,
      failed: total - supabaseSuccess,
      rate: total > 0 ? ((supabaseSuccess / total) * 100).toFixed(1) : '0',
    },
    google: {
      success: googleSuccess,
      failed: total - googleSuccess,
      rate: total > 0 ? ((googleSuccess / total) * 100).toFixed(1) : '0',
    },
  };
};
