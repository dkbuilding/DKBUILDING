/**
 * Modèle TypeScript pour les Projets
 * Backend Cold DK BUILDING
 */

export interface Projet {
  id: number;
  titre: string;
  description?: string;
  contenu?: string;
  type_projet?: 'charpente' | 'bardage' | 'couverture' | 'photovoltaique' | 'terrassement' | 'autre';
  client?: string;
  lieu?: string;
  date_debut?: string;
  date_fin?: string;
  statut: 'en_cours' | 'termine' | 'archive';
  images?: string[]; // JSON array de chemins
  documents?: string[]; // JSON array de chemins
  videos?: string[]; // JSON array de chemins
  meta_keywords?: string;
  meta_description?: string;
  slug: string;
  featured: boolean;
  vue_count: number;
  created_at: string;
  updated_at: string;
}

export interface ProjetCreateInput {
  titre: string;
  description?: string;
  contenu?: string;
  type_projet?: 'charpente' | 'bardage' | 'couverture' | 'photovoltaique' | 'terrassement' | 'autre';
  client?: string;
  lieu?: string;
  date_debut?: string;
  date_fin?: string;
  statut?: 'en_cours' | 'termine' | 'archive';
  images?: string[];
  documents?: string[];
  videos?: string[];
  meta_keywords?: string;
  meta_description?: string;
  slug?: string;
  featured?: boolean;
}

export interface ProjetUpdateInput {
  titre?: string;
  description?: string;
  contenu?: string;
  type_projet?: 'charpente' | 'bardage' | 'couverture' | 'photovoltaique' | 'terrassement' | 'autre';
  client?: string;
  lieu?: string;
  date_debut?: string;
  date_fin?: string;
  statut?: 'en_cours' | 'termine' | 'archive';
  images?: string[];
  documents?: string[];
  videos?: string[];
  meta_keywords?: string;
  meta_description?: string;
  slug?: string;
  featured?: boolean;
}

export interface ProjetFilters {
  statut?: 'en_cours' | 'termine' | 'archive';
  type_projet?: 'charpente' | 'bardage' | 'couverture' | 'photovoltaique' | 'terrassement' | 'autre';
  featured?: boolean;
  limit?: number;
  offset?: number;
  orderBy?: 'date_debut' | 'date_fin' | 'created_at' | 'vue_count';
  order?: 'ASC' | 'DESC';
}

