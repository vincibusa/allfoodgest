'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ArticoloForm from '../../../../components/articoli/ArticoloForm';
import { getArticoloById } from '../../../../services/articoliService';
import { Articolo } from '../../../../types/articolo';
import Link from 'next/link';

export default function ModificaArticoloPage() {
  const params = useParams();
  const id = params.id as string;
  
  const router = useRouter();
  const [articolo, setArticolo] = useState<Articolo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function caricaArticolo() {
      try {
        const articleId = parseInt(id);
        if (isNaN(articleId)) {
          setError('ID articolo non valido');
          setLoading(false);
          return;
        }

        const data = await getArticoloById(articleId);
        if (!data) {
          setError('Articolo non trovato');
        } else {
          setArticolo(data);
        }
      } catch (err: any) {
        setError(err.message || 'Si è verificato un errore durante il caricamento dell\'articolo');
      } finally {
        setLoading(false);
      }
    }

    caricaArticolo();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !articolo) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Errore</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error || 'Articolo non trovato'}</p>
            </div>
            <div className="mt-4">
              <Link
                href="/articoli"
                className="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100"
              >
                Torna alla lista degli articoli
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Modifica articolo</h1>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <ArticoloForm articolo={articolo} isEditing={true} />
      </div>
    </div>
  );
} 