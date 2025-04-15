# Gestionale Articoli

Un'applicazione Next.js per la gestione degli articoli di giornale con Supabase come backend.

## Requisiti

- Node.js 18+ (consigliato)
- Account Supabase (gratuito)

## Installazione

1. Clonare il repository
```bash
git clone <repository-url>
cd allfoodgestionale
```

2. Installare le dipendenze
```bash
npm install
```

## Configurazione di Supabase

1. Creare un nuovo progetto su [Supabase](https://supabase.io)

2. Una volta creato il progetto, andare su Project Settings > API e copiare:
   - URL del progetto
   - anon key (chiave pubblica anonima)

3. Creare un file `.env.local` nella root del progetto con le seguenti variabili:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Nel SQL Editor di Supabase, eseguire le seguenti query per creare la tabella degli articoli:

```sql
-- Creazione della tabella articoli
CREATE TABLE articoli (
    id BIGSERIAL PRIMARY KEY,
    titolo TEXT NOT NULL,
    contenuto TEXT NOT NULL,
    autore TEXT NOT NULL,
    categoria TEXT NOT NULL,
    data_pubblicazione DATE NOT NULL,
    immagine_url TEXT,
    pubblicato BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Aggiunta di un trigger per aggiornare automaticamente updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER articoli_updated_at
BEFORE UPDATE ON articoli
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Configurazione delle Row Level Security (RLS)
ALTER TABLE articoli ENABLE ROW LEVEL SECURITY;

-- Policy per consentire l'accesso anonimo in lettura
CREATE POLICY "Consenti accesso anonimo in lettura" ON articoli
FOR SELECT USING (true);

-- Policy per consentire l'inserimento, l'aggiornamento e l'eliminazione solo agli utenti autenticati
CREATE POLICY "Consenti modifica agli utenti autenticati" ON articoli
FOR ALL USING (auth.role() = 'authenticated');
```

5. Per configurare l'autenticazione in Supabase:
   - Vai su Authentication > Settings
   - Assicurati che sia abilitato "Email Auth"
   - Nelle impostazioni di Supabase Authentication, puoi configurare le opzioni di conferma email, password, ecc.

6. Creare un utente di test:
   - Vai su Authentication > Users
   - Clicca su "Add User"
   - Inserisci email e password per il tuo utente di test

## Sviluppo

Per avviare il server di sviluppo:

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) con il tuo browser per vedere l'applicazione.

## Funzionalità

- Autenticazione con email/password tramite Supabase
- Dashboard con statistiche sugli articoli
- Gestione completa degli articoli:
  - Creazione
  - Modifica
  - Eliminazione
  - Pubblicazione/bozza
- Categorizzazione degli articoli
- Ricerca e filtraggio degli articoli

## Struttura del progetto

- `/src/app`: Pagine dell'applicazione (Next.js App Router)
- `/src/components`: Componenti React riutilizzabili
- `/src/context`: Context API di React per la gestione dello stato globale
- `/src/lib`: Utility e configurazioni
- `/src/services`: Servizi per interagire con Supabase
- `/src/types`: Definizioni dei tipi TypeScript

## Deploy su Vercel

La soluzione più semplice per deployare questa app è utilizzare [Vercel](https://vercel.com), la piattaforma degli sviluppatori di Next.js.

1. Importa il progetto su Vercel
2. Configura le variabili d'ambiente su Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Licenza

[MIT](LICENSE)
# allfoodgest
