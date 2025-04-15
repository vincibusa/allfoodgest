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

export async function POST(request: Request) {
  try {
    // Controlla se le variabili d'ambiente sono disponibili
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ 
        error: 'Configurazione di Supabase non disponibile. Verifica le variabili d\'ambiente.' 
      }, { status: 500 });
    }

    const { email, password, action } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email e password sono richieste' }, { status: 400 });
    }
    
    if (action === 'signin') {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (signInError) {
        return NextResponse.json({ error: signInError.message }, { status: 401 });
      }
      
      return NextResponse.json({
        user: data.user,
        session: data.session,
      });
    } else if (action === 'signup') {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (signUpError) {
        return NextResponse.json({ error: signUpError.message }, { status: 400 });
      }
      
      return NextResponse.json({
        user: data.user,
        session: data.session,
      }, { status: 201 });
    } else {
      return NextResponse.json({ error: 'Azione non valida' }, { status: 400 });
    }
  } catch (error) {
    console.error('Errore durante l\'autenticazione:', error);
    return NextResponse.json({ error: 'Errore durante l\'autenticazione' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    // Controlla se le variabili d'ambiente sono disponibili
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ 
        error: 'Configurazione di Supabase non disponibile. Verifica le variabili d\'ambiente.' 
      }, { status: 500 });
    }

    const { error: signOutError } = await supabase.auth.signOut();
    
    if (signOutError) {
      return NextResponse.json({ error: signOutError.message }, { status: 400 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Errore durante il logout:', error);
    return NextResponse.json({ error: 'Errore durante il logout' }, { status: 500 });
  }
} 