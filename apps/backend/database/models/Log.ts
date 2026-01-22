/**
 * Modèle TypeScript pour les Logs
 * Backend Cold DK BUILDING
 */

export interface Log {
  id: number;
  action: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'upload' | 'download';
  entity_type?: 'annonce' | 'projet' | 'media' | 'admin_user';
  entity_id?: number;
  user_id?: number;
  details?: string; // JSON avec détails
  timestamp: string;
}

export interface LogCreateInput {
  action: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'upload' | 'download';
  entity_type?: 'annonce' | 'projet' | 'media' | 'admin_user';
  entity_id?: number;
  user_id?: number;
  details?: Record<string, any>;
}

export interface LogFilters {
  action?: string;
  entity_type?: string;
  entity_id?: number;
  user_id?: number;
  limit?: number;
  offset?: number;
  orderBy?: 'timestamp';
  order?: 'ASC' | 'DESC';
}

