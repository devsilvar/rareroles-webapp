/**
 * Supabase Edge Function for Health Check
 * 
 * This runs on Supabase's edge network, not Hostinger
 * 
 * Endpoint: https://[your-project-id].supabase.co/functions/v1/health
 * 
 * Deploy: supabase functions deploy health
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const startTime = Date.now()

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    
    const supabase = createClient(supabaseUrl, supabaseKey)

    const checks = {
      application: {
        status: 'up',
        version: '1.0.0',
        environment: 'production',
        timestamp: new Date().toISOString(),
      },
      database: {
        status: 'unknown',
        latency: 0,
        accessible: false,
      },
    }

    // Test database connectivity
    const dbCheckStart = Date.now()
    
    try {
      const { data, error } = await supabase
        .from('talent_submissions')
        .select('id', { count: 'exact', head: true })
        .limit(1)

      const dbLatency = Date.now() - dbCheckStart

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      checks.database = {
        status: 'up',
        latency: dbLatency,
        accessible: true,
      }
    } catch (dbError) {
      const dbLatency = Date.now() - dbCheckStart
      
      checks.database = {
        status: 'down',
        latency: dbLatency,
        accessible: false,
        error: dbError.message,
      }

      return new Response(
        JSON.stringify({
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          error: 'Database unavailable',
          checks,
          totalLatency: Date.now() - startTime,
        }),
        {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // All checks passed
    const overallStatus =
      checks.database.status === 'up' && checks.application.status === 'up'
        ? 'healthy'
        : 'degraded'

    return new Response(
      JSON.stringify({
        status: overallStatus,
        timestamp: new Date().toISOString(),
        checks,
        totalLatency: Date.now() - startTime,
        message: 'All systems operational',
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
        totalLatency: Date.now() - startTime,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
