import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validation helper to ensure we don't pass an empty or invalid string to createClient
const isValidUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const finalUrl = isValidUrl(supabaseUrl) 
  ? supabaseUrl! 
  : 'https://vfdmpuxvzixtucbuvpas.supabase.co'; // Default to the one provided if env is missing

const finalKey = (supabaseAnonKey && supabaseAnonKey.length > 10) 
  ? supabaseAnonKey 
  : 'sb_publishable_0k4a2wiQto8iePgNQu3rkw_qZu_yZm7'; // Use the provided one as fallback

export const supabase = createClient(finalUrl, finalKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing in environment. Using fallback/placeholder values.');
}
