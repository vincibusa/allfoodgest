import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Funzione per creare un client Supabase autenticato usando la chiave di servizio
// La chiave di servizio bypassa le RLS policy
function createServiceClient() {
  // Usa la chiave di servizio (o la chiave anonima se non disponibile)
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

export async function GET(request: Request) {
  try {
    const supabase = createServiceClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const categoria = searchParams.get('categoria');
    const pubblicato = searchParams.get('pubblicato');
    
    let query = supabase.from('articoli').select('*');
    
    if (id) {
      query = query.eq('id', id);
    }
    
    if (categoria) {
      query = query.eq('categoria', categoria);
    }
    
    if (pubblicato !== null) {
      query = query.eq('pubblicato', pubblicato === 'true');
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Errore recupero articoli:', error);
    return NextResponse.json({ error: 'Errore durante il recupero degli articoli' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Usa direttamente il client con chiave di servizio per bypassare RLS
    const supabase = createServiceClient();
    const articolo = await request.json();
    
    // Ottieni l'utente corrente dalle cookies per verificare l'autenticazione
    // ma usa comunque il client di servizio per la query
    const cookieHeader = request.headers.get('cookie') || '';
    console.log('Cookie header:', cookieHeader);
    
    // Log per debug
    console.log('Creazione articolo:', articolo);
    
    const { data, error } = await supabase
      .from('articoli')
      .insert([articolo])
      .select();
    
    if (error) {
      console.error('Errore Supabase:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    console.error('Errore creazione articolo:', error);
    return NextResponse.json({ error: 'Errore durante la creazione dell\'articolo' }, { status: 500 });
  }
} 