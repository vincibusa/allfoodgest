'use client';

import { useState, useEffect, Fragment } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getArticoli, deleteArticolo, togglePubblicazione } from '../../services/articoliService';
import { Articolo } from '../../types/articolo';
import Link from 'next/link';
import { Dialog, Transition } from '@headlessui/react';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon, 
  PlusIcon,
  FunnelIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import ArticoloDetail from '../../components/articoli/ArticoloDetail';

export default function ArticoliPage() {
  const [articoli, setArticoli] = useState<Articolo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('tutti');
  const [ricerca, setRicerca] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [articoloSelezionato, setArticoloSelezionato] = useState<Articolo | null>(null);
  const [mostraDettaglio, setMostraDettaglio] = useState(false);

  useEffect(() => {
    caricaArticoli();
  }, []);

  async function caricaArticoli() {
    setLoading(true);
    try {
      const data = await getArticoli();
      setArticoli(data);
    } catch (error) {
      console.error('Errore nel caricamento degli articoli:', error);
    } finally {
      setLoading(false);
    }
  }

  async function refreshArticoli() {
    setRefreshing(true);
    try {
      const data = await getArticoli();
      setArticoli(data);
    } catch (error) {
      console.error('Errore nel caricamento degli articoli:', error);
    } finally {
      setRefreshing(false);
    }
  }

  async function handleEliminaArticolo(id: number) {
    const conferma = window.confirm('Sei sicuro di voler eliminare questo articolo?');
    
    if (conferma) {
      try {
        await deleteArticolo(id);
        setArticoli(articoli.filter(art => art.id !== id));
      } catch (error) {
        console.error('Errore durante l\'eliminazione dell\'articolo:', error);
      }
    }
  }

  async function handleTogglePubblicazione(id: number, pubblicato: boolean) {
    try {
      await togglePubblicazione(id, !pubblicato);
      setArticoli(articoli.map(art => 
        art.id === id ? { ...art, pubblicato: !pubblicato } : art
      ));
    } catch (error) {
      console.error('Errore durante il cambio di stato dell\'articolo:', error);
    }
  }

  function apriDettaglioArticolo(articolo: Articolo) {
    setArticoloSelezionato(articolo);
    setMostraDettaglio(true);
  }

  function chiudiDettaglioArticolo() {
    setMostraDettaglio(false);
    setArticoloSelezionato(null);
  }

  const articoliFiltrati = articoli.filter(articolo => {
    const matchRicerca = articolo.titolo.toLowerCase().includes(ricerca.toLowerCase()) || 
                      articolo.autore.toLowerCase().includes(ricerca.toLowerCase());
    
    if (filtro === 'tutti') return matchRicerca;
    if (filtro === 'pubblicati') return articolo.pubblicato && matchRicerca;
    if (filtro === 'bozze') return !articolo.pubblicato && matchRicerca;
    
    return matchRicerca;
  });

  return (
    <DashboardLayout>
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Gestione Articoli</h1>
        <p className="mt-1 text-sm text-gray-500">Gestisci e organizza tutti gli articoli del tuo blog</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div className="relative mt-1 flex-1 w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Cerca articoli..."
            value={ricerca}
            onChange={(e) => setRicerca(e.target.value)}
            className="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2 self-end">
          <button
            onClick={refreshArticoli}
            disabled={refreshing}
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <ArrowPathIcon 
              className={`-ml-0.5 mr-1.5 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} 
              aria-hidden="true" 
            />
            Aggiorna
          </button>
          <Link
            href="/articoli/nuovo"
            className="inline-flex items-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-4 w-4" aria-hidden="true" />
            Nuovo Articolo
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center mb-4 gap-2">
        <span className="flex items-center text-sm text-gray-500 mr-2">
          <FunnelIcon className="h-4 w-4 mr-1" />
          Filtra:
        </span>
        <button 
          onClick={() => setFiltro('tutti')}
          className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            filtro === 'tutti' 
              ? 'bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-600/20' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Tutti
        </button>
        <button 
          onClick={() => setFiltro('pubblicati')}
          className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            filtro === 'pubblicati' 
              ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <CheckCircleIcon className={`mr-1.5 h-4 w-4 ${filtro === 'pubblicati' ? 'text-green-600' : 'text-gray-400'}`} />
          Pubblicati
        </button>
        <button 
          onClick={() => setFiltro('bozze')}
          className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            filtro === 'bozze' 
              ? 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <ClockIcon className={`mr-1.5 h-4 w-4 ${filtro === 'bozze' ? 'text-amber-600' : 'text-gray-400'}`} />
          Bozze
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
        </div>
      ) : (
        <div className="bg-white overflow-hidden sm:rounded-lg border border-gray-200">
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
                  <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stato
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {articoliFiltrati.length > 0 ? (
                  articoliFiltrati.map((articolo) => (
                    <tr key={articolo.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => apriDettaglioArticolo(articolo)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{articolo.titolo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{articolo.autore}</div>
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{articolo.categoria}</div>
                      </td>
                      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(articolo.data_pubblicazione).toLocaleDateString('it-IT')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer ${
                            articolo.pubblicato 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTogglePubblicazione(articolo.id, articolo.pubblicato);
                          }}
                        >
                          {articolo.pubblicato ? 'Pubblicato' : 'Bozza'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              apriDettaglioArticolo(articolo);
                            }}
                            className="text-gray-400 hover:text-gray-500"
                            title="Visualizza"
                          >
                            <EyeIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                          <Link
                            href={`/articoli/${articolo.id}/modifica`}
                            className="text-teal-600 hover:text-teal-900"
                            title="Modifica"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <PencilIcon className="h-5 w-5" aria-hidden="true" />
                          </Link>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEliminaArticolo(articolo.id);
                            }}
                            className="text-red-600 hover:text-red-900"
                            title="Elimina"
                          >
                            <TrashIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                      Nessun articolo trovato
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modale per il dettaglio dell'articolo */}
      <Transition appear show={mostraDettaglio} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={chiudiDettaglioArticolo}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Dettaglio Articolo
                    </Dialog.Title>
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                      onClick={chiudiDettaglioArticolo}
                    >
                      <span className="sr-only">Chiudi</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  
                  {articoloSelezionato && (
                    <div className="mt-2">
                      <ArticoloDetail articolo={articoloSelezionato} />
                      
                      <div className="mt-6 flex justify-end space-x-3">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none"
                          onClick={chiudiDettaglioArticolo}
                        >
                          Chiudi
                        </button>
                        <Link
                          href={`/articoli/${articoloSelezionato.id}/modifica`}
                          className="inline-flex justify-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 focus:outline-none"
                        >
                          Modifica
                        </Link>
                      </div>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </DashboardLayout>
  );
} 