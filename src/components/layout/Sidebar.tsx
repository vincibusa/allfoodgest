'use client';

import { useState, Fragment } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { 
  HomeIcon, 

  PlusCircleIcon, 

  UserIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  ChartPieIcon,
  UsersIcon,

} from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, current: pathname === '/dashboard' },
    { name: 'Articoli', href: '/articoli', icon: DocumentTextIcon, current: pathname === '/articoli' || (pathname.startsWith('/articoli/') && !pathname.includes('/nuovo')) },
    { name: 'Nuovo Articolo', href: '/articoli/nuovo', icon: PlusCircleIcon, current: pathname === '/articoli/nuovo' },
    { name: 'Statistiche', href: '/statistiche', icon: ChartPieIcon, current: pathname === '/statistiche' },
    { name: 'Utenti', href: '/utenti', icon: UsersIcon, current: pathname === '/utenti' },
    { name: 'Impostazioni', href: '/impostazioni', icon: Cog6ToothIcon, current: pathname === '/impostazioni' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-0 left-0 z-40 p-4 md:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
        >
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          <span className="sr-only">Apri menu</span>
        </button>
      </div>

      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 md:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-gradient-to-b from-teal-600 to-teal-700 pt-5 pb-4">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Chiudi sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                
                <div className="flex flex-shrink-0 items-center px-4">
                  <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                    <span className="text-teal-600 font-bold text-xl">G</span>
                  </div>
                  <h1 className="ml-3 text-white font-bold text-xl">Gestionale</h1>
                </div>
                
                <div className="mt-8 flex-1 h-0 overflow-y-auto">
                  <nav className="space-y-1 px-2">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? 'bg-teal-800 text-white'
                            : 'text-white hover:bg-teal-800/70',
                          'group flex items-center px-3 py-3 text-base font-medium rounded-md transition-all duration-200'
                        )}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <item.icon className="mr-4 h-6 w-6 flex-shrink-0 text-teal-100" aria-hidden="true" />
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>
                
                {user && (
                  <div className="mt-auto border-t border-teal-800 p-4">
                    <div className="flex items-center mb-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-teal-800">
                        <UserIcon className="h-5 w-5 text-white" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-white truncate max-w-[180px]">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center px-4 py-2 text-white rounded-md bg-teal-800/50 hover:bg-teal-800 transition-colors duration-200"
                    >
                      <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-teal-100" />
                      Esci
                    </button>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-gradient-to-b from-teal-600 to-teal-700">
          <div className="flex h-16 flex-shrink-0 items-center px-4 border-b border-teal-800/50">
            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
              <span className="text-teal-600 font-bold text-xl">G</span>
            </div>
            <h1 className="ml-3 text-white font-semibold text-lg">Gestionale</h1>
          </div>
          
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <nav className="mt-3 flex-1 space-y-1 px-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    item.current
                      ? 'bg-teal-800 text-white'
                      : 'text-white hover:bg-teal-800/70',
                    'group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-200'
                  )}
                >
                  <item.icon 
                    className="mr-3 h-5 w-5 flex-shrink-0 text-teal-100" 
                    aria-hidden="true" 
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          {user ? (
            <div className="flex flex-shrink-0 border-t border-teal-800/50 p-4">
              <div className="group block w-full flex items-center">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-teal-800">
                  <UserIcon className="h-5 w-5 text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white truncate max-w-[140px]">{user.email}</p>
                  <button
                    onClick={handleSignOut}
                    className="mt-1 text-xs flex items-center text-teal-100 hover:text-white transition-colors duration-200"
                  >
                    <ArrowRightOnRectangleIcon className="mr-1 h-4 w-4" />
                    Esci
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-shrink-0 border-t border-teal-800/50 p-4">
              <Link
                href="/login"
                className="group block w-full flex items-center"
              >
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-teal-800">
                  <ArrowLeftOnRectangleIcon className="h-5 w-5 text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">Accedi</p>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 