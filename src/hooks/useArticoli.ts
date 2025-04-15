import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Articolo } from '../types/articolo';

export function useArticoli(initialArticoli: Articolo[] = []) {
  const [articoli, setArticoli] = useState<Articolo[]>(initialArticoli);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Imposta gli articoli iniziali se forniti
    if (initialArticoli.length > 0) {
      setArticoli(initialArticoli);
      setLoading(false);
    } else {
      // Carica gli articoli dal database
      fetchArticoli();
    }
  }, [initialArticoli]);
  
  // Funzione per recuperare gli articoli dal database
  const fetchArticoli = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('articoli')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setArticoli(data || []);
    } catch (err: any) {
      setError(err.message || 'Errore durante il recupero degli articoli');
      console.error('Errore durante il recupero degli articoli:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Funzione per aggiornare un articolo
  const updateArticolo = async (id: number, updates: Partial<Articolo>) => {
    try {
      const { data, error } = await supabase
        .from('articoli')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      // Aggiorna l'interfaccia
      setArticoli((prevArticoli) =>
        prevArticoli.map((art) => (art.id === id ? (data as Articolo) : art))
      );
      
      return data as Articolo;
    } catch (err: any) {
      setError(err.message || `Errore durante l'aggiornamento dell'articolo con ID ${id}`);
      console.error(`Errore durante l'aggiornamento dell'articolo con ID ${id}:`, err);
      throw err;
    }
  };
  
  // Funzione per eliminare un articolo
  const deleteArticolo = async (id: number) => {
    try {
      const { error } = await supabase
        .from('articoli')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // Aggiorna l'interfaccia
      setArticoli((prevArticoli) => prevArticoli.filter((art) => art.id !== id));
      
      return true;
    } catch (err: any) {
      setError(err.message || `Errore durante l'eliminazione dell'articolo con ID ${id}`);
      console.error(`Errore durante l'eliminazione dell'articolo con ID ${id}:`, err);
      throw err;
    }
  };
  
  // Funzione per creare un nuovo articolo
  const createArticolo = async (nuovoArticolo: Omit<Articolo, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('articoli')
        .insert([nuovoArticolo])
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      // Aggiorna l'interfaccia
      setArticoli((prevArticoli) => [data as Articolo, ...prevArticoli]);
      
      return data as Articolo;
    } catch (err: any) {
      setError(err.message || "Errore durante la creazione dell'articolo");
      console.error("Errore durante la creazione dell'articolo:", err);
      throw err;
    }
  };
  
  // Funzione per cambiare lo stato di pubblicazione di un articolo
  const togglePubblicazione = async (id: number, pubblicato: boolean) => {
    return updateArticolo(id, { pubblicato });
  };
  
  // Restituisci lo stato e le funzioni di aggiornamento
  return {
    articoli,
    loading,
    error,
    fetchArticoli,
    updateArticolo,
    deleteArticolo,
    createArticolo,
    togglePubblicazione
  };
} 