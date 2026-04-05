import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour charger le contenu d'un fichier Markdown
 * @param {string} markdownPath - Chemin relatif vers le fichier Markdown dans public/
 * @returns {object} - { content, loading, error }
 */
export const useMarkdownContent = (markdownPath) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMarkdown = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Charger le fichier Markdown depuis public/
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
      } catch (err) {
        console.error('Erreur lors du chargement du Markdown:', err);
        setError(err.message);
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

