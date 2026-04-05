-- Migration 003: Table de tracking des migrations
-- Permet de savoir quelles migrations ont déjà été exécutées

CREATE TABLE IF NOT EXISTS _migrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT UNIQUE NOT NULL,
  executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Enregistrer les migrations précédentes comme déjà exécutées
INSERT OR IGNORE INTO _migrations (filename) VALUES ('001_create_tables.sql');
INSERT OR IGNORE INTO _migrations (filename) VALUES ('002_insert_defaults.sql');
INSERT OR IGNORE INTO _migrations (filename) VALUES ('003_add_migrations_tracking.sql');

