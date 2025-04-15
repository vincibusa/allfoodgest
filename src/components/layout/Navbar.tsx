import { Fragment } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { Menu, Transition } from '@headlessui/react';
import { 
  UserIcon, 
  BellIcon, 

} from '@heroicons/react/24/outline';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const { user, signOut } = useAuth();


  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left section */}
          <div className="md:hidden">
            {/* Navbar mostra solo il titolo su mobile, il resto è gestito dalla sidebar */}
            <h1 className="text-lg font-medium text-teal-600">Gestionale</h1>
          </div>
          


          {/* Right section */}
          <div className="flex w-full justify-end items-center space-x-4">
            {/* Notifications */}
            <button
              type="button"
              className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              <span className="sr-only">Visualizza notifiche</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
            </button>

            {/* Profile dropdown */}
            {user ? (
              <Menu as="div" className="relative ml-3">
                <div>
                  <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
                    <span className="sr-only">Apri menu utente</span>
                    <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-teal-600" aria-hidden="true" />
                    </div>
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm text-gray-900 font-medium truncate">{user.email}</p>
                      <p className="text-xs text-gray-500 mt-1">Amministratore</p>
                    </div>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/impostazioni"
                          className={classNames(
                            active ? 'bg-gray-100' : '',
                            'block px-4 py-2 text-sm text-gray-700'
                          )}
                        >
                          Impostazioni
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => signOut()}
                          className={classNames(
                            active ? 'bg-gray-100' : '',
                            'block w-full text-left px-4 py-2 text-sm text-gray-700'
                          )}
                        >
                          Esci
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <Link
                href="/login"
                className="text-gray-500 hover:text-gray-700 font-medium text-sm"
              >
                Accedi
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 