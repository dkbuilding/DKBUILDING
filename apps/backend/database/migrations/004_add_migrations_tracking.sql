-- Migration 004: Table de suivi des migrations
-- Date: 2026-04-05
-- Permet de tracker quelles migrations ont été appliquées

CREATE TABLE IF NOT EXISTS _migrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT NOT NULL UNIQUE,
  applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  checksum TEXT
);

-- Enregistrer les migrations déjà appliquées
INSERT OR IGNORE INTO _migrations (filename, applied_at) VALUES ('001_create_tables.sql', CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO _migrations (filename, applied_at) VALUES ('002_insert_defaults.sql', CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO _migrations (filename, applied_at) VALUES ('003_add_missing_indexes.sql', CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO _migrations (filename, applied_at) VALUES ('004_add_migrations_tracking.sql', CURRENT_TIMESTAMP);

