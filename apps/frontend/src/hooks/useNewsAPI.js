import { useState, useEffect, useCallback } from 'react';

/**
 * Hook personnalisé pour récupérer les actualités depuis l'API backend
 * 
 * @returns {Object} - { news, loading, error, refetch }
 */
export const useNewsAPI = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Récupère les actualités depuis l'API
   */
  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Toujours utiliser le proxy Vite /api en développement
      // Le proxy Vite route automatiquement /api vers http://localhost:3001
      // En production, utiliser l'URL complète si définie
      const isDev = import.meta.env.DEV;
      const apiBaseUrl = import.meta.env?.API_BASE_URL;
      
      // En développement, toujours utiliser le proxy Vite
      // En production, utiliser l'URL complète si disponible
      const apiUrl = (isDev || !apiBaseUrl) ? '/api' : apiBaseUrl;
      const newsUrl = `${apiUrl}/news`;
      
      // Log pour debug (uniquement en développement)
      if (isDev) {
        console.log('[useNewsAPI] Fetching news from:', newsUrl, { isDev, apiBaseUrl });
      }
      
      const response = await fetch(newsUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        cache: 'no-cache',
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        setNews(result.data);
      } else {
        throw new Error(result.message || 'Erreur lors de la récupération des actualités');
      }
    } catch (err) {
      let errorMessage = 'Erreur inconnue lors de la récupération des actualités';
      
      if (err instanceof TypeError && err.message.includes('fetch')) {
        // Erreur de connexion réseau
        errorMessage = 'Impossible de contacter le backend. Vérifiez que le serveur backend est démarré sur http://localhost:3001';
      } else if (err instanceof Error) {
        if (err.message.includes('404')) {
          errorMessage = 'Route /api/news non trouvée. Vérifiez que le backend est démarré et que la route existe.';
        } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          errorMessage = 'Erreur de connexion réseau. Le backend peut ne pas être accessible. Vérifiez que le backend est démarré sur localhost:3001.';
        } else {
          errorMessage = err.message;
        }
      }
      
      console.error('[useNewsAPI] Erreur lors de la récupération des actualités:', {
        error: err,
        apiUrl: newsUrl,
        message: err.message,
        stack: err.stack
      });
      setError(errorMessage);
      // En cas d'erreur, on ne doit pas utiliser de mocks selon les règles
      setNews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Récupération initiale des actualités
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return {
    news,
    loading,
    error,
    refetch: fetchNews
  };
};

/**
 * Hook pour récupérer un article spécifique par ID
 * 
 * @param {number} articleId - ID de l'article à récupérer
 * @returns {Object} - { article, loading, error, refetch }
 */
export const useArticleAPI = (articleId) => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArticle = useCallback(async () => {
    if (!articleId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Utiliser le proxy Vite en développement
      const isDev = import.meta.env.DEV;
      const apiBaseUrl = import.meta.env?.API_BASE_URL;
      const apiUrl = (isDev || !apiBaseUrl) ? '/api' : apiBaseUrl;
      
      const response = await fetch(`${apiUrl}/news/${articleId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        cache: 'no-cache',
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Article non trouvé');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        setArticle(result.data);
      } else {
        throw new Error(result.message || 'Erreur lors de la récupération de l\'article');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue lors de la récupération de l\'article';
      console.error('Erreur lors de la récupération de l\'article:', errorMessage);
      setError(errorMessage);
      setArticle(null);
    } finally {
      setLoading(false);
    }
  }, [articleId]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  return {
    article,
    loading,
    error,
    refetch: fetchArticle
  };
};

