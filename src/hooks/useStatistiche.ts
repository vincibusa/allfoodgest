import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface StatisticheArticoli {
  totaleArticoli: number;
  articoliPubblicati: number;
  articoliInBozza: number;
  perCategoria: Record<string, number>;
  ultimiArticoli: Record<string, unknown>[];
  daAggiornare: Record<string, unknown>[];
}

export function useStatistiche() {
  const [statistiche, setStatistiche] = useState<StatisticheArticoli | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Carica le statistiche iniziali
    fetchStatistiche();
  }, []);
  
  // Funzione per recuperare le statistiche dal database
  const fetchStatistiche = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('statistiche_articoli').select('*');
      
      if (error) {
        throw error;
      }
      
      // Ottieni gli ultimi articoli
      const { data: ultimiArticoli, error: errorUltimi } = await supabase
        .from('ultimi_articoli')
        .select('*');
      
      if (errorUltimi) {
        console.error('Errore durante il recupero degli ultimi articoli:', errorUltimi);
      }
      
      // Ottieni gli articoli da aggiornare
      const { data: daAggiornare, error: errorDaAggiornare } = await supabase
        .from('articoli_da_aggiornare')
        .select('*');
      
      if (errorDaAggiornare) {
        console.error('Errore durante il recupero degli articoli da aggiornare:', errorDaAggiornare);
      }
      
      // Calcola statistiche per categoria
      const perCategoria: Record<string, number> = {};
      data?.forEach(item => {
        perCategoria[item.categoria] = item.conteggio_per_categoria;
      });
      
      // Costruisci l'oggetto statistiche
      const totaleArticoli = data?.reduce((sum, item) => sum + item.conteggio_per_categoria, 0) || 0;
      const articoliPubblicati = data?.reduce((sum, item) => sum + (item.articoli_pubblicati || 0), 0) || 0;
      const articoliInBozza = data?.reduce((sum, item) => sum + (item.articoli_in_bozza || 0), 0) || 0;
      
      setStatistiche({
        totaleArticoli,
        articoliPubblicati,
        articoliInBozza,
        perCategoria,
        ultimiArticoli: ultimiArticoli || [],
        daAggiornare: daAggiornare || []
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore durante il recupero delle statistiche');
      console.error('Errore durante il recupero delle statistiche:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Restituisci lo stato e le funzioni di aggiornamento
  return {
    statistiche,
    loading,
    error,
    refreshStatistiche: fetchStatistiche
  };
} 