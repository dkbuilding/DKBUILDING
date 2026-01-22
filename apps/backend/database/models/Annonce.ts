/**
 * Modèle TypeScript pour les Annonces
 * Backend Cold DK BUILDING
 */

export interface Annonce {
  id: number;
  titre: string;
  description?: string;
  contenu?: string;
  categorie?: 'actualite' | 'offre' | 'evenement';
  date_publication: string;
  date_modification: string;
  auteur_id?: number;
  statut: 'brouillon' | 'publie' | 'archive';
  images?: string[]; // JSON array de chemins
  documents?: string[]; // JSON array de chemins
  meta_keywords?: string;
  meta_description?: string;
  slug: string;
  vue_count: number;
  created_at: string;
  updated_at: string;
}

export interface AnnonceCreateInput {
  titre: string;
  description?: string;
  contenu?: string;
  categorie?: 'actualite' | 'offre' | 'evenement';
  auteur_id?: number;
  statut?: 'brouillon' | 'publie' | 'archive';
  images?: string[];
  documents?: string[];
  meta_keywords?: string;
  meta_description?: string;
  slug?: string;
}

export interface AnnonceUpdateInput {
  titre?: string;
  description?: string;
  contenu?: string;
  categorie?: 'actualite' | 'offre' | 'evenement';
  statut?: 'brouillon' | 'publie' | 'archive';
  images?: string[];
  documents?: string[];
  meta_keywords?: string;
  meta_description?: string;
  slug?: string;
}

export interface AnnonceFilters {
  statut?: 'brouillon' | 'publie' | 'archive';
  categorie?: 'actualite' | 'offre' | 'evenement';
  auteur_id?: number;
  limit?: number;
  offset?: number;
  orderBy?: 'date_publication' | 'created_at' | 'vue_count';
  order?: 'ASC' | 'DESC';
}

