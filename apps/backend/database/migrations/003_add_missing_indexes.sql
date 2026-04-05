-- Migration 003: Index manquants pour performances
-- Audit DBA du 2026-04-05

-- Index sur annonces.categorie (filtre fréquent dans getFiltered)
CREATE INDEX IF NOT EXISTS idx_annonces_categorie ON annonces(categorie);

-- Index sur annonces.auteur_id (FK + filtre fréquent)
CREATE INDEX IF NOT EXISTS idx_annonces_auteur_id ON annonces(auteur_id);

-- Index composite pour la route publique (statut + date_publication DESC)
-- Couvre la requête : WHERE statut = 'publie' ORDER BY date_publication DESC
CREATE INDEX IF NOT EXISTS idx_annonces_statut_date_pub ON annonces(statut, date_publication DESC);

-- Index sur projets.type_projet (filtre fréquent dans getFiltered)
CREATE INDEX IF NOT EXISTS idx_projets_type_projet ON projets(type_projet);

-- Index composite pour les projets featured
-- Couvre la requête : WHERE featured = 1 AND statut = 'termine' ORDER BY created_at DESC
CREATE INDEX IF NOT EXISTS idx_projets_featured_statut ON projets(featured, statut, created_at DESC);

-- Index composite pour les projets publics
-- Couvre la requête : WHERE statut = 'termine' ORDER BY created_at DESC
CREATE INDEX IF NOT EXISTS idx_projets_statut_created ON projets(statut, created_at DESC);

-- Index sur logs.action (filtre fréquent dans getLogs)
CREATE INDEX IF NOT EXISTS idx_logs_action ON logs(action);

-- Index sur logs.user_id (filtre fréquent dans getLogs)
CREATE INDEX IF NOT EXISTS idx_logs_user_id ON logs(user_id);

-- Index composite pour le nettoyage des logs par date
CREATE INDEX IF NOT EXISTS idx_logs_entity_type ON logs(entity_type);
