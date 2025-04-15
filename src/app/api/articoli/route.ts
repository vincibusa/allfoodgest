import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Verifica e ottieni le variabili d'ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!supabaseUrl) {
  console.error('NEXT_PUBLIC_SUPABASE_URL non è stata configurata nelle variabili d\'ambiente');
}

const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseServiceKey) {
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY non è stata configurata nelle variabili d\'ambiente');
}

// Funzione per creare un client Supabase autenticato usando la chiave di servizio
// La chiave di servizio bypassa le RLS policy
function createServiceClient() {
  // Usa la chiave di servizio (o la chiave anonima se non disponibile)
  return createClient(supabaseUrl || '', supabaseServiceKey || '', {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

export async function GET(request: Request) {
  try {
    // Controlla se le variabili d'ambiente sono disponibili
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ 
        error: 'Configurazione di Supabase non disponibile. Verifica le variabili d\'ambiente.' 
      }, { status: 500 });
    }

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
    // Controlla se le variabili d'ambiente sono disponibili
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ 
        error: 'Configurazione di Supabase non disponibile. Verifica le variabili d\'ambiente.' 
      }, { status: 500 });
    }

    const supabase = createServiceClient();
    const nuovoArticolo = await request.json();
    
    if (!nuovoArticolo.titolo || !nuovoArticolo.contenuto) {
      return NextResponse.json({ error: 'Titolo e contenuto sono richiesti' }, { status: 400 });
    }
    
    // Imposta automaticamente data di creazione e aggiornamento se non forniti
    if (!nuovoArticolo.created_at) {
      nuovoArticolo.created_at = new Date().toISOString();
    }
    
    if (!nuovoArticolo.updated_at) {
      nuovoArticolo.updated_at = new Date().toISOString();
    }
    
    const { data, error } = await supabase
      .from('articoli')
      .insert(nuovoArticolo)
      .select()
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Errore inserimento articolo:', error);
    return NextResponse.json({ error: 'Errore durante l\'inserimento dell\'articolo' }, { status: 500 });
  }
} 