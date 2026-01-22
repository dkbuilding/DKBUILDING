/**
 * Modèle TypeScript pour les Utilisateurs Admin
 * Backend Cold DK BUILDING
 */

export interface AdminUser {
  id: number;
  username: string;
  password_hash: string;
  email?: string;
  role: 'admin' | 'editor';
  created_at: string;
  last_login?: string;
}

export interface AdminUserCreateInput {
  username: string;
  password: string;
  email?: string;
  role?: 'admin' | 'editor';
}

export interface AdminUserUpdateInput {
  username?: string;
  password?: string;
  email?: string;
  role?: 'admin' | 'editor';
}

