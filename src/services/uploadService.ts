import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * Carica un'immagine su Supabase Storage
 * @param file Il file da caricare
 * @param bucket Il bucket di storage (default: 'immagini')
 * @returns URL pubblico dell'immagine caricata
 */
export const uploadImmagine = async (file: File, bucket = 'immagini'): Promise<string> => {
  try {
    // Genera un nome file unico per evitare conflitti
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Carica il file su Supabase Storage
    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw new Error(`Errore durante il caricamento dell'immagine: ${error.message}`);
    }

    // Ottieni l'URL pubblico del file caricato
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error: unknown) {
    console.error('Errore durante il caricamento dell\'immagine:', error);
    throw new Error(error instanceof Error ? error.message : 'Errore durante il caricamento dell\'immagine');
  }
};

/**
 * Elimina un'immagine da Supabase Storage
 * @param url URL pubblico dell'immagine da eliminare
 * @param bucket Il bucket di storage (default: 'immagini')
 * @returns Booleano che indica il successo dell'operazione
 */
export const eliminaImmagine = async (url: string, bucket = 'immagini'): Promise<boolean> => {
  try {
    // Estrai il percorso del file dall'URL
    const urlObj = new URL(url);
    const path = urlObj.pathname.split('/').pop();
    
    if (!path) {
      throw new Error('Percorso file non valido');
    }

    // Elimina il file
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      throw new Error(`Errore durante l'eliminazione dell'immagine: ${error.message}`);
    }

    return true;
  } catch (error: unknown) {
    console.error('Errore durante l\'eliminazione dell\'immagine:', error);
    throw new Error(error instanceof Error ? error.message : 'Errore durante l\'eliminazione dell\'immagine');
  }
}; 