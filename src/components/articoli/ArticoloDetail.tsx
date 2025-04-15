import React from 'react';
import { Articolo } from '../../types/articolo';
import { CheckCircleIcon, ClockIcon, CalendarIcon, UserIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { Card } from '../ui';

interface ArticoloDetailProps {
  articolo: Articolo;
}

const ArticoloDetail: React.FC<ArticoloDetailProps> = ({ articolo }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Intestazione con immagine di copertina */}
      {articolo.immagine_url && (
        <div className="relative w-full h-80">
          <Image
            src={articolo.immagine_url}
            alt={articolo.titolo}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Intestazione articolo */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {articolo.categoria}
            </span>
            <span 
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                articolo.pubblicato 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}
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
          <div className="text-sm text-gray-500">
            <time dateTime={articolo.created_at}>
              Creato: {new Date(articolo.created_at).toLocaleDateString('it-IT')}
            </time>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">{articolo.titolo}</h1>

        <div className="flex items-center text-sm text-gray-500 mb-8">
          <UserIcon className="h-4 w-4 mr-1" />
          <span>{articolo.autore}</span>
          <span className="mx-2">•</span>
          <CalendarIcon className="h-4 w-4 mr-1" />
          <time dateTime={articolo.data_pubblicazione}>
            {new Date(articolo.data_pubblicazione).toLocaleDateString('it-IT')}
          </time>
        </div>

        {/* Contenuto articolo */}
        <div className="prose prose-lg max-w-none">
          {articolo.contenuto.split('\n').map((paragrafo, index) => (
            <p key={index} className="mb-4">{paragrafo}</p>
          ))}
        </div>

        {/* Metadati e informazioni aggiuntive */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Informazioni aggiuntive</h3>
          <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{articolo.id}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Ultimo aggiornamento</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(articolo.updated_at).toLocaleString('it-IT')}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">URL Immagine</dt>
              <dd className="mt-1 text-sm text-gray-900 break-all">
                {articolo.immagine_url || 'Nessuna immagine'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default ArticoloDetail; 