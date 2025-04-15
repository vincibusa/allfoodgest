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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServiceClient();
    const id = params.id;
    
    const { data, error } = await supabase
      .from('articoli')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Errore recupero articolo:', error);
    return NextResponse.json({ error: 'Errore durante il recupero dell\'articolo' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServiceClient();
    const id = params.id;
    const aggiornamenti = await request.json();
    
    // Log per debug
    console.log('Aggiornamento articolo:', id, aggiornamenti);
    
    const { data, error } = await supabase
      .from('articoli')
      .update(aggiornamenti)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Errore Supabase:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Errore aggiornamento articolo:', error);
    return NextResponse.json({ error: 'Errore durante l\'aggiornamento dell\'articolo' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServiceClient();
    const id = params.id;
    
    // Log per debug
    console.log('Eliminazione articolo:', id);
    
    const { error } = await supabase
      .from('articoli')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Errore Supabase:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Errore eliminazione articolo:', error);
    return NextResponse.json({ error: 'Errore durante l\'eliminazione dell\'articolo' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServiceClient();
    const id = params.id;
    const { pubblicato } = await request.json();
    
    // Log per debug
    console.log('Cambio stato articolo:', id, pubblicato);
    
    if (pubblicato === undefined) {
      return NextResponse.json({ error: 'Il campo pubblicato è richiesto' }, { status: 400 });
    }
    
    const { data, error } = await supabase
      .from('articoli')
      .update({ pubblicato })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Errore Supabase:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Errore cambio stato articolo:', error);
    return NextResponse.json({ error: 'Errore durante il cambio di stato dell\'articolo' }, { status: 500 });
  }
} 