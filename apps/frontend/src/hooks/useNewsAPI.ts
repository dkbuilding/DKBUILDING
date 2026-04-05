/**
 * Hooks pour récupérer les actualités depuis l'API backend
 * Utilise React Query pour le cache intelligent et la déduplication
 */

import { useQuery } from '@tanstack/react-query';

/** Structure d'un article retourné par l'API */
interface NewsArticle {
  readonly id: number;
  readonly titre: string;
  readonly description?: string;
  readonly contenu?: string;
  readonly categorie?: string;
  readonly date_publication: string;
  readonly statut: string;
  readonly images?: readonly string[];
  readonly documents?: readonly string[];
  readonly meta_keywords?: string;
  readonly meta_description?: string;
  readonly slug: string;
  readonly vue_count: number;
  readonly created_at: string;
  readonly updated_at: string;
  // Champs formatés par le backend (route /api/news)
  readonly title?: string;
  readonly excerpt?: string;
  readonly content?: string;
  readonly date?: string;
  readonly category?: string;
  readonly image?: string | null;
  readonly featured?: boolean;
  readonly isPublished?: boolean;
}

/** Réponse standard de l'API backend */
interface APIResponse<T> {
  readonly success: boolean;
  readonly data: T;
  readonly message?: string;
}

interface UseNewsAPIReturn {
  readonly news: readonly NewsArticle[];
  readonly loading: boolean;
  readonly error: string | null;
  readonly refetch: () => void;
}

interface UseArticleAPIReturn {
  readonly article: NewsArticle | null;
  readonly loading: boolean;
  readonly error: string | null;
  readonly refetch: () => void;
}

/**
 * Construit l'URL de base de l'API selon l'environnement
 */
function getApiUrl(): string {
  const isDev = import.meta.env.DEV;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  return (isDev || !apiBaseUrl) ? '/api' : apiBaseUrl;
}

/**
 * Fonction de fetch pour les news (partagée pour déduplication)
 */
async function fetchNewsList(): Promise<readonly NewsArticle[]> {
  const apiUrl = getApiUrl();
  const newsUrl = `${apiUrl}/news`;

  if (import.meta.env.DEV) {
    console.log('[useNewsAPI] Fetching news from:', newsUrl);
  }

  const response = await fetch(newsUrl, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
  }

  const result: APIResponse<NewsArticle[]> = await response.json();

  if (result.success && result.data) {
    return result.data;
  }
  
  throw new Error(result.message ?? 'Erreur lors de la récupération des actualités');
}

/**
 * Fonction de fetch pour un article spécifique
 */
async function fetchArticleById(articleId: number | string): Promise<NewsArticle> {
  const apiUrl = getApiUrl();

  const response = await fetch(`${apiUrl}/news/${articleId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Article non trouvé');
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result: APIResponse<NewsArticle> = await response.json();

  if (result.success && result.data) {
    return result.data;
  }
  
  throw new Error(result.message ?? "Erreur lors de la récupération de l'article");
}

/**
 * Transforme une erreur en message lisible
 */
function getErrorMessage(err: unknown): string {
  if (err instanceof TypeError && err.message.includes('fetch')) {
    return 'Impossible de contacter le backend. Vérifiez que le serveur backend est démarré.';
  }
  if (err instanceof Error) {
    if (err.message.includes('404')) {
      return 'Route /api/news non trouvée. Vérifiez que le backend est démarré.';
    }
    if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
      return 'Erreur de connexion réseau. Le backend peut ne pas être accessible.';
    }
    return err.message;
  }
  return 'Erreur inconnue lors de la récupération des actualités';
}

/**
 * Hook pour récupérer la liste des actualités
 * Utilise React Query pour le cache, la déduplication et le retry automatique
 */
export const useNewsAPI = (): UseNewsAPIReturn => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['news'],
    queryFn: fetchNewsList,
    staleTime: 1000 * 60 * 5,     // Données fraîches pendant 5 minutes
    gcTime: 1000 * 60 * 30,       // Cache conservé 30 minutes
    retry: 1,                      // 1 retry en cas d'erreur
    refetchOnWindowFocus: false,   // Pas de refetch au focus de la fenêtre
  });

  return {
    news: data ?? [],
    loading: isLoading,
    error: error ? getErrorMessage(error) : null,
    refetch,
  };
};

/**
 * Hook pour récupérer un article spécifique par ID
 * Utilise React Query pour le cache et la déduplication
 */
export const useArticleAPI = (articleId: number | string | undefined): UseArticleAPIReturn => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['news', 'article', articleId],
    queryFn: () => fetchArticleById(articleId!),
    enabled: !!articleId,
    staleTime: 1000 * 60 * 5,     // 5 minutes
    gcTime: 1000 * 60 * 30,       // 30 minutes en cache
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return {
    article: data ?? null,
    loading: isLoading,
    error: error ? getErrorMessage(error) : null,
    refetch,
  };
};
