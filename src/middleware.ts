import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Array di origini consentite
const allowedOrigins = [
  'http://localhost:3000',
  'https://allfoodgestionale.vercel.app',
  // Aggiungi qui altre origini consentite
];

export function middleware(request: NextRequest) {
  // Ottieni l'origine dalla richiesta
  const origin = request.headers.get('origin') || '';
  
  // Verifica se il percorso inizia con /api/
  const isApiRoute = request.nextUrl.pathname.startsWith('/api/');
  
  // Se non è una richiesta API, continua normalmente
  if (!isApiRoute) {
    return NextResponse.next();
  }

  // Per le richieste API, gestisci CORS
  const response = NextResponse.next();

  // Gestisci CORS per le richieste OPTIONS (preflight)
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
        'Access-Control-Max-Age': '86400', // 24 ore
      },
    });
  }

  // Per le altre richieste, aggiungi le intestazioni CORS
  response.headers.set('Access-Control-Allow-Origin', 
    allowedOrigins.includes(origin) ? origin : allowedOrigins[0]
  );
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
}

// Configura il middleware per essere eseguito solo sui percorsi API
export const config = {
  matcher: [
    '/api/:path*',
  ],
}; 