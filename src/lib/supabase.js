// src/lib/supabase.js
// ------------------------------------------------------------------
// Initialises the Supabase client using environment variables.
// Copy .env.local.example → .env.local and fill in your project
// credentials before running the app.
// ------------------------------------------------------------------
import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnon) {
  // Warn loudly in development; fail gracefully in production.
  console.warn(
    '[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
    'Copy .env.local.example → .env.local and add your credentials.'
  );
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnon ?? '');
