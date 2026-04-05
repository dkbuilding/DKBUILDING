import { useEffect } from 'react';

/**
 * Hook SEO pour la gestion dynamique des meta tags dans une SPA.
 * Met a jour title, description, canonical, og:*, twitter:* et JSON-LD.
 * Compatible avec le prerendering Puppeteer (les modifications DOM sont capturees).
 *
 * @param {Object} options
 * @param {string} options.title - Title de la page (50-60 chars ideal)
 * @param {string} options.description - Meta description (150-160 chars ideal)
 * @param {string} options.canonical - URL canonique absolue
 * @param {string} [options.ogTitle] - OG title (fallback sur title)
 * @param {string} [options.ogDescription] - OG description (fallback sur description)
 * @param {string} [options.ogImage] - URL absolue de l'image OG
 * @param {string} [options.ogType] - Type OG (default: "website")
 * @param {Object} [options.jsonLd] - Schema JSON-LD supplementaire pour la page
 * @param {boolean} [options.noindex] - Si true, ajoute noindex
 */
export function useSEO({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = 'website',
  jsonLd,
  noindex = false,
}) {
  useEffect(() => {
    // --- Title ---
    if (title) {
      document.title = title;
    }

    // --- Helper pour creer/mettre a jour une meta ---
    const setMeta = (attr, attrValue, content) => {
      let el = document.querySelector(`meta[${attr}="${attrValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // --- Description ---
    if (description) {
      setMeta('name', 'description', description);
    }

    // --- Canonical ---
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonical);
    }

    // --- Robots ---
    if (noindex) {
      setMeta('name', 'robots', 'noindex, nofollow');
    }

    // --- Open Graph ---
    setMeta('property', 'og:title', ogTitle || title || '');
    setMeta('property', 'og:description', ogDescription || description || '');
    if (ogImage) {
      setMeta('property', 'og:image', ogImage);
    }
    setMeta('property', 'og:type', ogType);
    if (canonical) {
      setMeta('property', 'og:url', canonical);
    }

    // --- Twitter Cards ---
    setMeta('name', 'twitter:title', ogTitle || title || '');
    setMeta('name', 'twitter:description', ogDescription || description || '');
    if (ogImage) {
      setMeta('name', 'twitter:image', ogImage);
    }
    if (canonical) {
      setMeta('name', 'twitter:url', canonical);
    }

    // --- JSON-LD dynamique ---
    let scriptEl;
    if (jsonLd) {
      scriptEl = document.createElement('script');
      scriptEl.type = 'application/ld+json';
      scriptEl.id = 'seo-page-jsonld';
      scriptEl.textContent = JSON.stringify(jsonLd);
      // Supprimer l'ancien si present
      const old = document.getElementById('seo-page-jsonld');
      if (old) old.remove();
      document.head.appendChild(scriptEl);
    }

    // Cleanup : retirer le JSON-LD dynamique au demontage
    return () => {
      const el = document.getElementById('seo-page-jsonld');
      if (el) el.remove();
    };
  }, [title, description, canonical, ogTitle, ogDescription, ogImage, ogType, jsonLd, noindex]);
}

export default useSEO;
