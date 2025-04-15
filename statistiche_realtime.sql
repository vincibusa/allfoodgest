-- Creazione della vista materializzata per le statistiche
CREATE MATERIALIZED VIEW statistiche_articoli AS
SELECT
  COUNT(*) AS totale_articoli,
  COUNT(*) FILTER (WHERE pubblicato = TRUE) AS articoli_pubblicati,
  COUNT(*) FILTER (WHERE pubblicato = FALSE) AS articoli_in_bozza,
  categoria,
  COUNT(*) AS conteggio_per_categoria
FROM
  articoli
GROUP BY
  categoria;

-- Creazione di una funzione per aggiornare la vista materializzata
CREATE OR REPLACE FUNCTION refresh_statistiche_articoli()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW statistiche_articoli;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Creazione di un trigger per aggiornare automaticamente le statistiche quando la tabella articoli cambia
CREATE TRIGGER refresh_statistiche_after_articoli_change
AFTER INSERT OR UPDATE OR DELETE ON articoli
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_statistiche_articoli();

-- Configurazione per abilitare il real-time per le statistiche articoli
ALTER TABLE articoli REPLICA IDENTITY FULL;

-- Creazione di una funzione per notificare i client delle modifiche alle statistiche
CREATE OR REPLACE FUNCTION notify_statistiche_change()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'statistiche_change',
    json_build_object(
      'timestamp', NOW(),
      'action', TG_OP,
      'schema', TG_TABLE_SCHEMA,
      'table', TG_TABLE_NAME
    )::text
  );
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Creazione di un trigger per inviare notifiche real-time quando le statistiche cambiano
CREATE TRIGGER notify_statistiche_change_trigger
AFTER INSERT OR UPDATE OR DELETE ON articoli
FOR EACH STATEMENT
EXECUTE FUNCTION notify_statistiche_change();

-- Creazione di una vista per ottenere rapidamente gli ultimi articoli
CREATE VIEW ultimi_articoli AS
SELECT *
FROM articoli
ORDER BY created_at DESC
LIMIT 5;

-- Creazione di una vista per ottenere gli articoli da aggiornare
CREATE VIEW articoli_da_aggiornare AS
SELECT *
FROM articoli
ORDER BY updated_at ASC
LIMIT 5;

-- Permettere l'accesso alle viste per gli utenti autenticati
GRANT SELECT ON statistiche_articoli TO authenticated;
GRANT SELECT ON ultimi_articoli TO authenticated;
GRANT SELECT ON articoli_da_aggiornare TO authenticated; 