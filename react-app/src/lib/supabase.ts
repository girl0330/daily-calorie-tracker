import { createClient } from '@supabase/supabase-js';

type SupabaseConfig = {
  supabaseUrl: string;
  supabaseKey: string;
};

const SupabaseConfig: SupabaseConfig = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '',
};

export const supabase = createClient(SupabaseConfig.supabaseUrl, SupabaseConfig.supabaseKey);
