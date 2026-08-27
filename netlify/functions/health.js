/**
 * Health Check Endpoint for UptimeRobot Monitoring
 * 
 * Purpose: Verifies that the RareRoles application and Supabase connection are operational
 * 
 * Endpoint: /.netlify/functions/health
 * Method: GET
 * 
 * Response Format:
 * {
 *   "status": "healthy" | "degraded" | "unhealthy",
 *   "timestamp": "2026-08-26T22:30:00.000Z",
 *   "checks": {
 *     "database": { "status": "up", "latency": 45 },
 *     "application": { "status": "up", "version": "1.0.0" }
 *   },
 *   "uptime": 99.99
 * }
 * 
 * Status Codes:
 * - 200: Everything is healthy
 * - 503: Service unavailable (database down)
 * - 500: Internal server error
 */

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

// Health check configuration
const TIMEOUT_MS = 5000; // 5 second timeout for database check
const APP_VERSION = '1.0.0'; // Update this with each deployment

/**
 * Main handler function
 */
export async function handler(event, context) {
  const startTime = Date.now();

  try {
    // Initialize checks object
    const checks = {
      application: {
        status: 'up',
        version: APP_VERSION,
        environment: process.env.CONTEXT || 'production',
      },
      database: {
        status: 'unknown',
        latency: null,
        error: null,
      },
    };

    // Check 1: Supabase Configuration
    if (!supabaseUrl || !supabaseKey) {
      return {
        statusCode: 503,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
        body: JSON.stringify({
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          error: 'Supabase configuration missing',
          checks,
        }),
      };
    }

    // Check 2: Database Connectivity
    const dbCheckStart = Date.now();
    
    try {
      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
        },
      });

      // Simple query to verify database is responsive
      // Using count instead of fetching data for efficiency
      const { data, error, count } = await Promise.race([
        supabase
          .from('talent_submissions')
          .select('id', { count: 'exact', head: true })
          .limit(1),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Database timeout')), TIMEOUT_MS)
        ),
      ]);

      const dbLatency = Date.now() - dbCheckStart;

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "no rows returned" which is fine for health check
        throw error;
      }

      checks.database = {
        status: 'up',
        latency: dbLatency,
        accessible: true,
      };
    } catch (dbError) {
      const dbLatency = Date.now() - dbCheckStart;
      
      checks.database = {
        status: 'down',
        latency: dbLatency,
        accessible: false,
        error: dbError.message || 'Database connection failed',
      };

      // Database is down - return 503 Service Unavailable
      return {
        statusCode: 503,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
        body: JSON.stringify({
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          error: 'Database unavailable',
          checks,
          totalLatency: Date.now() - startTime,
        }),
      };
    }

    // All checks passed - return 200 OK
    const overallStatus =
      checks.database.status === 'up' && checks.application.status === 'up'
        ? 'healthy'
        : 'degraded';

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
      body: JSON.stringify({
        status: overallStatus,
        timestamp: new Date().toISOString(),
        checks,
        totalLatency: Date.now() - startTime,
        message: 'All systems operational',
      }),
    };
  } catch (error) {
    // Unexpected error - return 500 Internal Server Error
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
      body: JSON.stringify({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message || 'Internal server error',
        totalLatency: Date.now() - startTime,
      }),
    };
  }
}
