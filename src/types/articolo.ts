export interface Articolo {
  id: number;
  titolo: string;
  contenuto: string;
  autore: string;
  categoria: string;
  data_pubblicazione: string;
  immagine_url?: string;
  pubblicato: boolean;
  created_at: string;
  updated_at: string;
}

export interface NuovoArticolo {
  titolo: string;
  contenuto: string;
  autore: string;
  categoria: string;
  data_pubblicazione?: string;
  immagine_url?: string;
  pubblicato?: boolean;
} 