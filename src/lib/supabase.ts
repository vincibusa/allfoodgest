import { createClient } from '@supabase/supabase-js';

// Verifica e ottieni le variabili d'ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!supabaseUrl) {
  console.error('NEXT_PUBLIC_SUPABASE_URL non è stata configurata nelle variabili d\'ambiente');
}

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseAnonKey) {
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY non è stata configurata nelle variabili d\'ambiente');
}

// Crea e esporta il client Supabase
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    persistSession: true,
    storageKey: 'supabase-auth',
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
}); 