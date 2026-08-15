/**
 * Livine International School - Supabase Integration Client
 * 
 * To connect to your Supabase PostgreSQL backend:
 * 1. Create a free project at https://supabase.com
 * 2. Run the SQL in `supabase/schema.sql` in the Supabase SQL Editor
 * 3. Add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env or Vercel Environment Variables
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
