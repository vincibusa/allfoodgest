'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Articolo } from '../../../types/articolo';
import { getArticoloById } from '../../../services/articoliService';
import ArticoloDetail from '../../../components/articoli/ArticoloDetail';
import { Button } from '../../../components/ui';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function ArticoloDetailPage() {
  // Usa useParams invece di params come prop
  const params = useParams();
  const id = params.id as string;
  
  const router = useRouter();
  const [articolo, setArticolo] = useState<Articolo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchArticolo = async () => {
      try {
        setLoading(true);
        const data = await getArticoloById(Number(id));
        setArticolo(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Si è verificato un errore durante il recupero dell&apos;articolo');
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticolo();
  }, [id]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto my-8 px-4">
        <Button variant="outline" onClick={() => router.back()} icon={<ArrowLeftIcon className="h-4 w-4" />}>
          Torna indietro
        </Button>
        
        <div className="mt-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }
  
  if (!articolo) {
    return (
      <div className="max-w-4xl mx-auto my-8 px-4">
        <Button variant="outline" onClick={() => router.back()} icon={<ArrowLeftIcon className="h-4 w-4" />}>
          Torna indietro
        </Button>
        
        <div className="mt-6 text-center py-12">
          <h2 className="text-xl font-semibold text-gray-700">Articolo non trovato</h2>
          <p className="mt-2 text-gray-500">L&apos;articolo che stai cercando potrebbe essere stato rimosso o non esiste.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto my-8 px-4">
      <div className="mb-8">
        <Button variant="outline" onClick={() => router.back()} icon={<ArrowLeftIcon className="h-4 w-4" />}>
          Torna alla lista
        </Button>
      </div>
      
      <ArticoloDetail articolo={articolo} />
    </div>
  );
} 