/**
 * Configuration SEO centralisee pour DK BUILDING.
 * Toutes les constantes SEO en un seul endroit pour faciliter la maintenance.
 */

export const SITE_URL = 'https://dkbuilding.fr';
export const SITE_NAME = 'DK BUILDING';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/images/OG/og-image.jpg`;
export const PHONE = '+33768113839';
export const PHONE_DISPLAY = '07 68 11 38 39';
export const EMAIL = 'contact@dkbuilding.fr';
export const ADDRESS = {
  street: '59 Rue Pierre Cormary',
  city: 'Albi',
  postalCode: '81000',
  region: 'Tarn',
  country: 'FR',
};

/**
 * Meta tags par page.
 * Chaque cle correspond a un identifiant de page.
 * title : 50-60 chars | description : 150-160 chars
 */
export const PAGE_SEO = {
  home: {
    title: 'DK BUILDING — Charpente, Bardage, Couverture a Albi (81)',
    description:
      'DK BUILDING, expert en charpente metallique, bardage et couverture a Albi dans le Tarn. Devis gratuit sous 24h. Intervention Occitanie. SIREN 947998555.',
    canonical: `${SITE_URL}/`,
    ogType: 'website',
  },
  mentionsLegales: {
    title: 'Mentions legales — DK BUILDING | Albi',
    description:
      'Mentions legales de DK BUILDING, entreprise de construction a Albi (81). SIREN 947998555, SAS au capital de 1 000 EUR. Informations juridiques.',
    canonical: `${SITE_URL}/legal/mentions-legales`,
    ogType: 'website',
  },
  politiqueConfidentialite: {
    title: 'Politique de confidentialite — DK BUILDING | Albi',
    description:
      'Politique de confidentialite et protection des donnees personnelles de DK BUILDING. Conformite RGPD. Vos droits et nos engagements.',
    canonical: `${SITE_URL}/legal/politique-confidentialite`,
    ogType: 'website',
  },
  cgv: {
    title: 'Conditions generales de vente — DK BUILDING | Albi',
    description:
      'Conditions generales de vente de DK BUILDING, entreprise de construction a Albi. Modalites de commande, paiement, livraison et garanties.',
    canonical: `${SITE_URL}/legal/cgv`,
    ogType: 'website',
  },
  newsDetail: {
    // Sera surcharge dynamiquement avec les donnees de l'article
    title: 'Actualites — DK BUILDING | Albi',
    description: 'Decouvrez les dernieres actualites de DK BUILDING : projets en cours, realisations et nouvelles du secteur BTP a Albi.',
    canonical: `${SITE_URL}/news`,
    ogType: 'article',
  },
  error: {
    title: 'Page non trouvee — DK BUILDING',
    description: 'La page que vous recherchez n\'existe pas ou a ete deplacee. Retournez a l\'accueil de DK BUILDING.',
    canonical: `${SITE_URL}/`,
    noindex: true,
  },
};

export default PAGE_SEO;
