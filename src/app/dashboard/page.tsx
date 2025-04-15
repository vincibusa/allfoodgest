'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getArticoli } from '../../services/articoliService';
import { Articolo } from '../../types/articolo';
import Link from 'next/link';

export default function DashboardPage() {
  const [statistiche, setStatistiche] = useState({
    totaleArticoli: 0,
    articoliPubblicati: 0,
    articoliInBozza: 0,
    ultimiArticoli: [] as Articolo[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function caricaDati() {
      try {
        const articoli = await getArticoli();
        
        const pubblicati = articoli.filter(art => art.pubblicato);
        const inBozza = articoli.filter(art => !art.pubblicato);
        const ultimi = [...articoli].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ).slice(0, 5);

        setStatistiche({
          totaleArticoli: articoli.length,
          articoliPubblicati: pubblicati.length,
          articoliInBozza: inBozza.length,
          ultimiArticoli: ultimi,
        });
      } catch (error) {
        console.error("Errore nel caricamento dei dati:", error);
      } finally {
        setLoading(false);
      }
    }

    caricaDati();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">Totale Articoli</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">{statistiche.totaleArticoli}</dd>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">Articoli Pubblicati</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">{statistiche.articoliPubblicati}</dd>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">Articoli in Bozza</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">{statistiche.articoliInBozza}</dd>
                </div>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Ultimi articoli</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Gli ultimi 5 articoli aggiunti</p>
                </div>
                <Link 
                  href="/articoli"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Vedi tutti
                </Link>
              </div>
              <ul role="list" className="divide-y divide-gray-200">
                {statistiche.ultimiArticoli.length > 0 ? (
                  statistiche.ultimiArticoli.map((articolo) => (
                    <li key={articolo.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <p className="font-medium text-indigo-600 truncate">{articolo.titolo}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(articolo.created_at).toLocaleDateString('it-IT')} • {articolo.autore}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <span 
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              articolo.pubblicato 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {articolo.pubblicato ? 'Pubblicato' : 'Bozza'}
                          </span>
                          <Link 
                            href={`/articoli/${articolo.id}`}
                            className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            Visualizza
                          </Link>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-12 text-center sm:px-6">
                    <p className="text-gray-500">Nessun articolo presente</p>
                    <div className="mt-4">
                      <Link
                        href="/articoli/nuovo"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Crea il primo articolo
                      </Link>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
} 