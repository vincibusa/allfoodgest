import React from 'react';
import { useArticoli } from '../../hooks/useArticoli';
import { Card, Button } from '../ui';
import { PencilIcon, TrashIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface ArticoliListProps {
  defaultFiltered?: boolean;
  limit?: number;
  filterPublished?: boolean;
  showControls?: boolean;
  onDelete?: (id: number) => void;
}

export const ArticoliList: React.FC<ArticoliListProps> = ({
  limit,
  filterPublished,
  showControls = true,
  onDelete
}) => {
  const {
    articoli,
    loading,
    error,
    deleteArticolo,
    togglePubblicazione,
    fetchArticoli
  } = useArticoli();

  // Filtra e limita gli articoli
  const filteredArticoli = React.useMemo(() => {
    let result = [...articoli];
    
    // Applica il filtro per pubblicati/bozze se specificato
    if (filterPublished !== undefined) {
      result = result.filter(art => art.pubblicato === filterPublished);
    }
    
    // Limita il numero di articoli se specificato
    if (limit && limit > 0) {
      result = result.slice(0, limit);
    }
    
    return result;
  }, [articoli, filterPublished, limit]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Sei sicuro di voler eliminare questo articolo?')) {
      try {
        await deleteArticolo(id);
        if (onDelete) {
          onDelete(id);
        }
      } catch (error) {
        console.error('Errore durante l\'eliminazione:', error);
      }
    }
  };

  const handleTogglePubblicazione = async (id: number, pubblicato: boolean) => {
    try {
      await togglePubblicazione(id, !pubblicato);
    } catch (error) {
      console.error('Errore durante il cambio di stato:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
        <p className="text-sm text-red-700">{error}</p>
        <Button
          className="mt-2"
          variant="outline"
          size="sm"
          onClick={() => fetchArticoli()}
        >
          Riprova
        </Button>
      </div>
    );
  }

  if (filteredArticoli.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        {filterPublished === true
          ? 'Nessun articolo pubblicato trovato.'
          : filterPublished === false
          ? 'Nessuna bozza trovata.'
          : 'Nessun articolo trovato.'}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredArticoli.map(articolo => (
        <Card key={articolo.id} className="transition-all hover:shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <Link href={`/articoli/${articolo.id}`} className="text-lg font-medium text-gray-900 hover:text-teal-600">
                {articolo.titolo}
              </Link>
              <p className="text-sm text-gray-500 mt-1">
                {articolo.autore} • {new Date(articolo.data_pubblicazione).toLocaleDateString('it-IT')}
              </p>
              <div className="mt-2 flex items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {articolo.categoria}
                </span>
                <span 
                  className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer ${
                    articolo.pubblicato 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                      : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                  }`}
                  onClick={() => handleTogglePubblicazione(articolo.id, articolo.pubblicato)}
                >
                  {articolo.pubblicato ? (
                    <>
                      <CheckCircleIcon className="mr-1 h-3 w-3" />
                      Pubblicato
                    </>
                  ) : (
                    <>
                      <ClockIcon className="mr-1 h-3 w-3" />
                      Bozza
                    </>
                  )}
                </span>
              </div>
            </div>
            
            {showControls && (
              <div className="flex space-x-2">
                <Link href={`/articoli/${articolo.id}/modifica`}>
                  <Button variant="outline" size="sm" icon={<PencilIcon className="h-4 w-4" />}>
                    Modifica
                  </Button>
                </Link>
                <Button 
                  variant="danger" 
                  size="sm" 
                  icon={<TrashIcon className="h-4 w-4" />}
                  onClick={() => handleDelete(articolo.id)}
                >
                  Elimina
                </Button>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}; 