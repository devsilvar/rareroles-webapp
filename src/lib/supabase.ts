/**
 * Supabase Client Configuration
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================================================
// ANALYTICS HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate conversion rate (contacted / total submissions)
 */
export async function getConversionRate(): Promise<number> {
  try {
    const [hiringRes, talentRes, contactRes] = await Promise.all([
      supabase.from('hiring_enquiries').select('contacted'),
      supabase.from('talent_submissions').select('contacted'),
      supabase.from('contacts').select('contacted'),
    ]);

    const allSubmissions = [
      ...(hiringRes.data || []),
      ...(talentRes.data || []),
      ...(contactRes.data || []),
    ];

    if (allSubmissions.length === 0) return 0;

    const contactedCount = allSubmissions.filter(s => s.contacted).length;
    return Math.round((contactedCount / allSubmissions.length) * 100);
  } catch (error) {
    console.error('Error calculating conversion rate:', error);
    return 0;
  }
}

/**
 * Calculate average response time in hours
 */
export async function getAverageResponseTime(): Promise<number> {
  try {
    const [hiringRes, talentRes, contactRes] = await Promise.all([
      supabase.from('hiring_enquiries').select('created_at, contacted_at').eq('contacted', true),
      supabase.from('talent_submissions').select('created_at, contacted_at').eq('contacted', true),
      supabase.from('contacts').select('created_at, contacted_at').eq('contacted', true),
    ]);

    const allContacted = [
      ...(hiringRes.data || []),
      ...(talentRes.data || []),
      ...(contactRes.data || []),
    ].filter(item => item.contacted_at);

    if (allContacted.length === 0) return 0;

    const responseTimes = allContacted.map(item => {
      const created = new Date(item.created_at).getTime();
      const contacted = new Date(item.contacted_at).getTime();
      return (contacted - created) / (1000 * 60 * 60); // Convert to hours
    });

    const avgHours = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
    return Math.round(avgHours * 10) / 10; // Round to 1 decimal
  } catch (error) {
    console.error('Error calculating average response time:', error);
    return 0;
  }
}

// ============================================================================
// DATA PERSISTENCE FUNCTIONS
// ============================================================================

/**
 * Save hiring enquiry to Supabase
 */
export async function saveHiringEnquiry(data: any) {
  const { data: result, error } = await supabase
    .from('hiring_enquiries')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return result;
}

/**
 * Save talent submission to Supabase
 */
export async function saveTalentSubmission(data: any) {
  const { data: result, error } = await supabase
    .from('talent_submissions')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return result;
}

/**
 * Save contact form to Supabase
 */
export async function saveContact(data: any) {
  const { data: result, error } = await supabase
    .from('contacts')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return result;
}
