'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getStatistiche } from '../../services/articoliService';
import { Articolo } from '../../types/articolo';
import Link from 'next/link';
import { 
  ChartBarIcon, 
  DocumentTextIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  ClockIcon,
  ArrowUpIcon
} from '@heroicons/react/24/outline';

type Statistiche = {
  totaleArticoli: number;
  articoliPubblicati: number;
  articoliInBozza: number;
  perCategoria: Record<string, number>;
  ultimiArticoli: Articolo[];
  daAggiornare: Articolo[];
};

export default function StatistichePage() {
  const [stats, setStats] = useState<Statistiche | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function caricaStatistiche() {
      try {
        const data = await getStatistiche();
        setStats(data as Statistiche);
      } catch (error) {
        console.error("Errore nel caricamento delle statistiche:", error);
      } finally {
        setLoading(false);
      }
    }

    caricaStatistiche();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  // Se non ci sono statistiche o se non ci sono articoli
  if (!stats || stats.totaleArticoli === 0) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Nessun articolo presente</h3>
          <p className="mt-1 text-sm text-gray-500">Inizia creando il tuo primo articolo.</p>
          <div className="mt-6">
            <Link
              href="/articoli/nuovo"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Crea nuovo articolo
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const categorie = Object.entries(stats.perCategoria || {}).sort((a, b) => (b[1] as number) - (a[1] as number));
  const percentualePubblicati = Math.round((stats.articoliPubblicati / stats.totaleArticoli) * 100);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Statistiche</h1>
          <div className="text-right">
            <p className="text-sm text-gray-500">Informazioni dettagliate sugli articoli</p>
          </div>
        </div>

        {/* Statistiche principali */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DocumentTextIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Totale Articoli</dt>
                    <dd>
                      <div className="text-lg font-bold text-gray-900">{stats.totaleArticoli}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Articoli Pubblicati</dt>
                    <dd>
                      <div className="text-lg font-bold text-gray-900">{stats.articoliPubblicati}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ExclamationCircleIcon className="h-6 w-6 text-yellow-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Articoli in Bozza</dt>
                    <dd>
                      <div className="text-lg font-bold text-gray-900">{stats.articoliInBozza}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChartBarIcon className="h-6 w-6 text-blue-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Percentuale Pubblicati</dt>
                    <dd>
                      <div className="text-lg font-bold text-gray-900">{percentualePubblicati}%</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Distribuzione per categoria */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Distribuzione per Categoria</h3>
            <div className="space-y-4">
              {categorie.map(([categoria, count]) => {
                const percentage = Math.round((count as number / stats.totaleArticoli) * 100);
                return (
                  <div key={categoria}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium text-gray-700">{categoria}</div>
                      <div className="text-sm font-medium text-gray-500">{count} articoli ({percentage}%)</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Articoli da aggiornare */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Articoli da Aggiornare</h3>
            <div className="space-y-3 overflow-hidden">
              {stats.daAggiornare && stats.daAggiornare.length > 0 ? (
                <div className="overflow-y-auto max-h-60 -mr-2 pr-2">
                  {stats.daAggiornare.map((articolo: Articolo) => (
                    <div key={articolo.id} className="bg-gray-50 p-3 rounded-md mb-2">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium text-indigo-600">{articolo.titolo}</p>
                          <p className="text-xs text-gray-500">
                            Ultimo aggiornamento: {new Date(articolo.updated_at).toLocaleDateString('it-IT')}
                          </p>
                        </div>
                        <Link
                          href={`/articoli/${articolo.id}/modifica`}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                        >
                          Aggiorna
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Nessun articolo che richiede aggiornamento.</p>
              )}
            </div>
          </div>
        </div>

        {/* Ultimi articoli */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ultimi Articoli Aggiunti</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Titolo
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Autore
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stato
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.ultimiArticoli && stats.ultimiArticoli.map((articolo: Articolo) => (
                    <tr key={articolo.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/articoli/${articolo.id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-900">
                          {articolo.titolo}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{articolo.autore}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{articolo.categoria}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{new Date(articolo.created_at).toLocaleDateString('it-IT')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            articolo.pubblicato 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {articolo.pubblicato ? 'Pubblicato' : 'Bozza'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 