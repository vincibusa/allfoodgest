import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const { email, password, action } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email e password sono richieste' }, { status: 400 });
    }
    
    if (action === 'signin') {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 401 });
      }
      
      return NextResponse.json({
        user: data.user,
        session: data.session,
      });
    } else if (action === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      
      return NextResponse.json({
        user: data.user,
        session: data.session,
      }, { status: 201 });
    } else {
      return NextResponse.json({ error: 'Azione non valida' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Errore durante l\'autenticazione' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Errore durante il logout' }, { status: 500 });
  }
} 