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

// Creazione del client Supabase
const supabase = createClient(supabaseUrl || '', supabaseServiceKey || '');

export async function GET() {
  try {
    // Controlla se le variabili d'ambiente sono disponibili
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ 
        error: 'Configurazione di Supabase non disponibile. Verifica le variabili d\'ambiente.' 
      }, { status: 500 });
    }

    // Recupera tutti gli articoli
    const { data: articoli, error } = await supabase
      .from('articoli')
      .select('*');
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    // Calcola le statistiche
    const totaleArticoli = articoli.length;
    const articoliPubblicati = articoli.filter(art => art.pubblicato).length;
    const articoliInBozza = totaleArticoli - articoliPubblicati;
    
    // Articoli raggruppati per categoria
    const perCategoria: Record<string, number> = {};
    articoli.forEach(art => {
      const cat = art.categoria;
      perCategoria[cat] = (perCategoria[cat] || 0) + 1;
    });
    
    // Articoli più recenti
    const ultimiArticoli = [...articoli]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
    
    // Articoli più vecchi che potrebbero richiedere aggiornamento
    const daAggiornare = [...articoli]
      .sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime())
      .slice(0, 5);
    
    return NextResponse.json({
      totaleArticoli,
      articoliPubblicati,
      articoliInBozza,
      perCategoria,
      ultimiArticoli,
      daAggiornare
    });
  } catch (error) {
    console.error('Errore durante il recupero delle statistiche:', error);
    return NextResponse.json({ error: 'Errore durante il recupero delle statistiche' }, { status: 500 });
  }
} 