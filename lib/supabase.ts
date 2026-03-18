import { createClient } from '@supabase/supabase-js';

// These will be populated via .env.local in development and via your deployment env vars in production
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
