/**
 * Google Apps Script Webhook Service
 * Sends form data to Google Sheets as backup
 * 
 * Senior Dev Approach:
 * - Type-safe interfaces
 * - Retry logic with exponential backoff
 * - Error handling and logging
 * - Environment variable validation
 */

// Types
interface GoogleAppsScriptPayload {
  type: 'hiring' | 'talent' | 'contact';
  secret: string;
  timestamp: string;
  data: Record<string, any>;
}

interface GoogleAppsScriptResponse {
  success: boolean;
  id?: string;
  error?: string;
}

// Configuration
const getGoogleAppsScriptConfig = () => {
  const url = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL;
  const secret = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_SECRET;
  const enabled = import.meta.env.VITE_ENABLE_GOOGLE_BACKUP !== 'false';

  if (!url || !secret) {
    console.warn('[Google Apps Script] Not configured - URL or secret missing');
  }

  return {
    url,
    secret,
    enabled: enabled && !!url && !!secret,
  };
};

/**
 * Send data to Google Apps Script webhook
 * with retry logic and error handling
 */
export const sendToGoogleAppsScript = async (
  type: 'hiring' | 'talent' | 'contact',
  data: Record<string, any>,
  options: { retry?: boolean; maxAttempts?: number } = {}
): Promise<GoogleAppsScriptResponse> => {
  const config = getGoogleAppsScriptConfig();

  // A missing URL/secret is a real failure, not a silent pass. Reporting
  // success here would let the UI confirm a submission that never left the
  // browser.
  if (!config.enabled) {
    console.error('[Google Apps Script] Not configured - URL or secret missing');
    return {
      success: false,
      error: 'Google Sheets sync is not configured (missing webhook URL or secret)',
    };
  }

  const { retry = true, maxAttempts = 3 } = options;

  const payload: GoogleAppsScriptPayload = {
    type,
    secret: config.secret,
    timestamp: new Date().toISOString(),
    data,
  };

  let lastError: Error | null = null;
  let attempt = 0;

  while (attempt < maxAttempts) {
    attempt++;

    try {
      console.log(`[Google Apps Script] Attempt ${attempt}/${maxAttempts} for ${type}`);

      const response = await fetch(config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain', // Avoid CORS preflight
        },
        body: JSON.stringify(payload),
        redirect: 'follow', // Follow redirects from Google Apps Script
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: GoogleAppsScriptResponse = await response.json();

      if (result.success) {
        console.log(`[Google Apps Script] Success on attempt ${attempt}`, result.id);
        return result;
      } else {
        throw new Error(result.error || 'Unknown error from Google Apps Script');
      }
    } catch (error) {
      lastError = error as Error;
      console.warn(
        `[Google Apps Script] Attempt ${attempt} failed:`,
        error
      );

      // Don't retry if not enabled or this is the last attempt
      if (!retry || attempt >= maxAttempts) {
        break;
      }

      // Exponential backoff: 1s, 2s, 4s
      const delayMs = Math.pow(2, attempt - 1) * 1000;
      console.log(`[Google Apps Script] Retrying in ${delayMs}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  // All attempts failed
  console.error(
    `[Google Apps Script] All ${maxAttempts} attempts failed:`,
    lastError
  );

  return {
    success: false,
    error: lastError?.message || 'Unknown error',
  };
};

/**
 * Batch send multiple items (useful for admin dashboard sync)
 */
export const batchSendToGoogleAppsScript = async (
  items: Array<{ type: 'hiring' | 'talent' | 'contact'; data: Record<string, any> }>
): Promise<{ success: number; failed: number; total: number }> => {
  console.log(`[Google Apps Script] Batch sending ${items.length} items`);

  const results = await Promise.allSettled(
    items.map((item) => sendToGoogleAppsScript(item.type, item.data))
  );

  const success = results.filter(
    (r) => r.status === 'fulfilled' && r.value.success
  ).length;

  const failed = results.length - success;

  console.log(
    `[Google Apps Script] Batch complete: ${success}/${results.length} successful`
  );

  return {
    success,
    failed,
    total: results.length,
  };
};

/**
 * Test the Google Apps Script connection
 */
export const testGoogleAppsScriptConnection = async (): Promise<boolean> => {
  const config = getGoogleAppsScriptConfig();

  if (!config.enabled) {
    return false;
  }

  try {
    const result = await sendToGoogleAppsScript(
      'contact',
      {
        name: 'Test Connection',
        email: 'test@example.com',
        message: 'This is a test message to verify webhook connection',
        _test: true,
      },
      { retry: false, maxAttempts: 1 }
    );

    return result.success;
  } catch (error) {
    console.error('[Google Apps Script] Connection test failed:', error);
    return false;
  }
};
