-- Migration 001: Création des tables principales

-- Table admin_users (extension de l'existant)
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT,
  role TEXT DEFAULT 'admin',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME
);

-- Table annonces
CREATE TABLE IF NOT EXISTS annonces (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titre TEXT NOT NULL,
  description TEXT,
  contenu TEXT,
  categorie TEXT,
  date_publication DATETIME DEFAULT CURRENT_TIMESTAMP,
  date_modification DATETIME DEFAULT CURRENT_TIMESTAMP,
  auteur_id INTEGER,
  statut TEXT DEFAULT 'brouillon',
  images TEXT,
  documents TEXT,
  meta_keywords TEXT,
  meta_description TEXT,
  slug TEXT UNIQUE,
  vue_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (auteur_id) REFERENCES admin_users(id)
);

-- Table projets
CREATE TABLE IF NOT EXISTS projets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titre TEXT NOT NULL,
  description TEXT,
  contenu TEXT,
  type_projet TEXT,
  client TEXT,
  lieu TEXT,
  date_debut DATE,
  date_fin DATE,
  statut TEXT DEFAULT 'en_cours',
  images TEXT,
  documents TEXT,
  videos TEXT,
  meta_keywords TEXT,
  meta_description TEXT,
  slug TEXT UNIQUE,
  featured BOOLEAN DEFAULT 0,
  vue_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table logs
CREATE TABLE IF NOT EXISTS logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id INTEGER,
  user_id INTEGER,
  details TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES admin_users(id)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_annonces_statut ON annonces(statut);
CREATE INDEX IF NOT EXISTS idx_annonces_slug ON annonces(slug);
CREATE INDEX IF NOT EXISTS idx_annonces_date_publication ON annonces(date_publication);
CREATE INDEX IF NOT EXISTS idx_projets_statut ON projets(statut);
CREATE INDEX IF NOT EXISTS idx_projets_slug ON projets(slug);
CREATE INDEX IF NOT EXISTS idx_projets_featured ON projets(featured);
CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_logs_entity ON logs(entity_type, entity_id);

