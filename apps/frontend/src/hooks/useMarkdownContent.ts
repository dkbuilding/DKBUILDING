/**
 * Hook personnalisé pour charger le contenu d'un fichier Markdown
 */

import { useState, useEffect } from 'react';

interface UseMarkdownContentReturn {
  readonly content: string;
  readonly loading: boolean;
  readonly error: string | null;
}

/**
 * Charge et retourne le contenu d'un fichier Markdown depuis public/
 * @param markdownPath - Chemin relatif vers le fichier Markdown dans public/
 */
export const useMarkdownContent = (markdownPath: string): UseMarkdownContentReturn => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMarkdown = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(markdownPath);

        if (!response.ok) {
          throw new Error(`Erreur lors du chargement du fichier: ${response.statusText}`);
        }

        let text = await response.text();

        // Remplacer les placeholders dynamiques
        const currentDate = new Date().toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        text = text.replace(/\{\{DATE\}\}/g, currentDate);

        setContent(text);
      } catch (err: unknown) {
        console.error('Erreur lors du chargement du Markdown:', err);
        const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (markdownPath) {
      loadMarkdown();
    }
  }, [markdownPath]);

  return { content, loading, error };
};
