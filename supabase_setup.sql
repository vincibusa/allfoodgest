-- Creazione del bucket per le immagini
INSERT INTO storage.buckets (id, name, public)
VALUES ('immagini', 'immagini', true);

-- Imposta le policy di accesso al bucket
CREATE POLICY "Immagini accessibili a tutti" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'immagini');

-- Permette agli utenti autenticati di caricare immagini
CREATE POLICY "Caricamento immagini per utenti autenticati" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'immagini'
    AND auth.role() = 'authenticated'
  );

-- Permette agli utenti autenticati di aggiornare le proprie immagini
CREATE POLICY "Modifica immagini per utenti autenticati" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'immagini'
    AND auth.role() = 'authenticated'
  );

-- Permette agli utenti autenticati di eliminare le proprie immagini
CREATE POLICY "Eliminazione immagini per utenti autenticati" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'immagini'
    AND auth.role() = 'authenticated'
  );

-- Funzione per gestire automaticamente le eliminazioni di articoli
CREATE OR REPLACE FUNCTION delete_article_images()
RETURNS TRIGGER AS $$
DECLARE
  image_path TEXT;
BEGIN
  -- Estrai il percorso dell'immagine dall'URL
  IF OLD.immagine_url IS NOT NULL THEN
    image_path := SUBSTRING(OLD.immagine_url FROM '[^/]+$');
    
    -- Elimina l'immagine dal bucket
    IF image_path IS NOT NULL THEN
      DELETE FROM storage.objects
      WHERE name = image_path AND bucket_id = 'immagini';
    END IF;
  END IF;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger per eliminare automaticamente le immagini quando un articolo viene eliminato
CREATE TRIGGER trigger_delete_article_images
BEFORE DELETE ON articoli
FOR EACH ROW
EXECUTE FUNCTION delete_article_images();

-- Attiva la gestione delle file modifiche
CREATE OR REPLACE FUNCTION log_image_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO storage.logs (event, bucket_id, object_name)
    VALUES ('INSERT', NEW.bucket_id, NEW.name);
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO storage.logs (event, bucket_id, object_name)
    VALUES ('UPDATE', NEW.bucket_id, NEW.name);
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO storage.logs (event, bucket_id, object_name)
    VALUES ('DELETE', OLD.bucket_id, OLD.name);
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Crea la tabella di log se non esiste
CREATE TABLE IF NOT EXISTS storage.logs (
  id BIGSERIAL PRIMARY KEY,
  event TEXT NOT NULL,
  bucket_id TEXT NOT NULL,
  object_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger per loggare le modifiche alle immagini
CREATE TRIGGER trigger_log_image_changes
AFTER INSERT OR UPDATE OR DELETE ON storage.objects
FOR EACH ROW
EXECUTE FUNCTION log_image_changes(); 