'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Link from 'next/link';
import { HomeIcon, NewspaperIcon, PencilIcon } from '@heroicons/react/24/outline';

export default function ArticoloLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [articleId, setArticleId] = useState<string | null>(null);
  const isEditRoute = pathname?.includes('/modifica');

  useEffect(() => {
    if (pathname) {
      const matches = pathname.match(/\/articoli\/(\d+)/);
      if (matches && matches[1]) {
        setArticleId(matches[1]);
      }
    }
  }, [pathname]);

  return (
    <DashboardLayout>
      {/* Breadcrumb */}
      <nav className="flex mb-5" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              <HomeIcon className="w-4 h-4 mr-2" />
              Home
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg
                className="w-3 h-3 text-gray-400 mx-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <Link
                href="/articoli"
                className="ml-1 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                <span className="flex items-center">
                  <NewspaperIcon className="w-4 h-4 mr-1" />
                  Articoli
                </span>
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg
                className="w-3 h-3 text-gray-400 mx-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                {isEditRoute ? (
                  <span className="flex items-center">
                    <PencilIcon className="w-4 h-4 mr-1" />
                    Modifica Articolo
                  </span>
                ) : (
                  'Dettaglio Articolo'
                )}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {children}

      {/* Barra di azioni */}
      {articleId && !isEditRoute && (
        <div className="mt-8 flex justify-between border-t border-gray-200 pt-6">
          <Link
            href="/articoli"
            className="rounded-md bg-white py-2 px-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Torna alla lista
          </Link>
          
          <Link
            href={`/articoli/${articleId}/modifica`}
            className="rounded-md bg-teal-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            Modifica articolo
          </Link>
        </div>
      )}
    </DashboardLayout>
  );
} 