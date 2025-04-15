import { Articolo, NuovoArticolo } from '../types/articolo';

// Ottieni tutti gli articoli
export async function getArticoli(): Promise<Articolo[]> {
  const response = await fetch('/api/articoli');
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Errore nel recupero degli articoli');
  }
  
  return response.json();
}

// Ottieni articoli filtrati
export async function getArticoliFiltrati(filtri: {
  categoria?: string;
  pubblicato?: boolean;
}): Promise<Articolo[]> {
  let url = '/api/articoli?';
  
  if (filtri.categoria) {
    url += `categoria=${encodeURIComponent(filtri.categoria)}&`;
  }
  
  if (filtri.pubblicato !== undefined) {
    url += `pubblicato=${filtri.pubblicato}`;
  }
  
  const response = await fetch(url);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Errore nel recupero degli articoli filtrati');
  }
  
  return response.json();
}

// Ottieni un articolo per ID
export async function getArticoloById(id: number): Promise<Articolo | null> {
  const response = await fetch(`/api/articoli/${id}`);
  
  if (response.status === 404) {
    return null;
  }
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `Errore nel recupero dell'articolo con ID ${id}`);
  }
  
  return response.json();
}

// Crea un nuovo articolo
export async function createArticolo(articolo: NuovoArticolo): Promise<Articolo> {
  const response = await fetch('/api/articoli', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(articolo),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Errore nella creazione dell\'articolo');
  }
  
  return response.json();
}

// Aggiorna un articolo esistente
export async function updateArticolo(id: number, articolo: Partial<Articolo>): Promise<Articolo> {
  const response = await fetch(`/api/articoli/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(articolo),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `Errore nell'aggiornamento dell'articolo con ID ${id}`);
  }
  
  return response.json();
}

// Elimina un articolo
export async function deleteArticolo(id: number): Promise<void> {
  const response = await fetch(`/api/articoli/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `Errore nell'eliminazione dell'articolo con ID ${id}`);
  }
}

// Cambia lo stato di pubblicazione di un articolo
export async function togglePubblicazione(id: number, pubblicato: boolean): Promise<Articolo> {
  const response = await fetch(`/api/articoli/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pubblicato }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `Errore nel cambio di stato dell'articolo con ID ${id}`);
  }
  
  return response.json();
}

// Ottieni statistiche
export async function getStatistiche() {
  const response = await fetch('/api/stats');
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Errore nel recupero delle statistiche');
  }
  
  return response.json();
} 