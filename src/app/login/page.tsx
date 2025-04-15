'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { EnvelopeIcon, LockClosedIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { Input, Button, Card } from '../../components/ui';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn(email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Si è verificato un errore durante l&apos;accesso');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center">
            <svg
              className="h-8 w-8 text-teal-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h2 className="mt-4 text-center text-3xl font-bold tracking-tight text-gray-900">
            Accedi al Gestionale
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Inserisci le tue credenziali per accedere alla piattaforma
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-4 mb-6">
              <div className="flex">
                <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Indirizzo email"
              placeholder="nome@esempio.com"
              icon={<EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />}
            />

            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              placeholder="••••••••"
              icon={<LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />}
            />

            <Button 
              type="submit" 
              fullWidth 
              isLoading={loading}
            >
              Accedi
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Informazioni</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Contatta l&apos;amministratore per ottenere le credenziali di accesso.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 