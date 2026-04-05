# Site Web DK BUILDING - Documentation Technique

## Vue d'ensemble

Site web moderne pour DK BUILDING, entreprise spécialisée dans la construction métallique (charpente, bardage, couverture, terrassement) basée à Albi, Tarn.

### Informations Entreprise

- **Nom** : DK BUILDING
- **SIREN** : 947 998 555
- **RCS** : Albi B 947998555
- **Adresse** : 59 Rue Pierre Cormary, 81000 Albi
- **Dirigeant** : Dicalou KHAMIDOV
- **Création** : 9 janvier 2023
- **Forme juridique** : SAS
- **Capital** : 1 000 €

## Architecture Technique

### Frontend

- **Framework** : React 18 + Vite
- **Styling** : TailwindCSS + CSS Custom
- **Animations** : GSAP + ScrollTrigger
- **Routing** : React Router DOM
- **Icônes** : Lucide React
- **Build** : Vite (optimisé pour la production)

### Backend

- **Runtime** : Node.js
- **Framework** : Express.js
- **Email** : Nodemailer
- **Validation** : Express Validator
- **Sécurité** : Helmet, CORS
- **Logs** : Morgan

### Palette de Couleurs

- **Jaune primaire** : `#F3E719` (CTA, accents, hover)
- **Noir profond** : `#0E0E0E` (backgrounds, textes)
- **Blanc** : `#FFFFFF` (textes sur fond sombre)
- **Gris** : Palette complète de `#F8F8F8` à `#101010`

## Structure du Projet

```bash
Site Web/apps/
├── frontend/                 # Application React
│   ├── src/
│   │   ├── components/      # Composants réutilisables
│   │   │   ├── Hero.jsx
│   │   │   ├── Services.jsx
│   │   │   ├── Portfolio.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Navigation.jsx
│   │   ├── pages/           # Pages de l'application
│   │   │   └── Home.jsx
│   │   ├── utils/           # Utilitaires
│   │   │   └── motion.js    # Tokens d'animation GSAP
│   │   ├── styles/          # Styles globaux
│   │   │   └── index.css
│   │   ├── App.jsx          # Composant racine
│   │   └── main.jsx         # Point d'entrée
│   ├── public/              # Assets statiques
│   │   ├── robots.txt
│   │   └── sitemap.xml
│   ├── tailwind.config.js   # Configuration TailwindCSS
│   ├── postcss.config.js    # Configuration PostCSS
│   └── package.json         # Dépendances frontend
└── backend/                 # API Node.js
    ├── routes/              # Routes API
    │   └── contact.js       # Route formulaire de contact
    ├── utils/               # Utilitaires backend
    │   └── emailService.js  # Service d'envoi d'emails
    ├── server.js            # Serveur Express principal
    ├── env.example          # Variables d'environnement
    └── package.json         # Dépendances backend
```

## Fonctionnalités

### 1. Page d'Accueil (Hero)

- **Logo animé** : Animation GSAP au chargement
- **Typographie forte** : Police Space Grotesk pour les titres
- **Parallax** : Éléments de fond avec ScrollTrigger
- **CTA principal** : Bouton "Demander un devis gratuit"
- **Indicateur de scroll** : Animation bounce continue

### 2. Section Services

- **Grid responsive** : 5 cartes (Charpente, Bardage, Couverture, Photovoltaïque, Climatisation)
- **Animations reveal** : Stagger GSAP au scroll
- **Hover effects** : Transform GPU-friendly
- **Icônes** : Lucide React (Hammer, Shield, Home, Sun, Thermometer)
- **Détails techniques** : Liste des fonctionnalités par service

### 3. Galerie Portfolio

- **Lightbox moderne** : Navigation avec clavier et boutons
- **Lazy loading** : Optimisation des performances
- **Filtres** : Par type de projet (optionnel)
- **Layout masonry** : Responsive et fluide
- **Données réelles** : Projets avec localisation

### 4. Section À Propos

- **Données légales** : SIREN, RCS, adresse complète
- **Statistiques** : Compteurs animés (années, projets, etc.)
- **Valeurs** : Expertise, qualité, proximité
- **Timeline** : Histoire de l'entreprise depuis 2023

### 5. Formulaire de Contact

- **Multi-étapes** : 3 étapes progressives
- **Validation temps réel** : Express Validator
- **Types de projet** : Charpente, Bardage, Couverture, Mixte
- **Backend intégré** : Envoi d'emails automatiques
- **Confirmation** : Email de confirmation au client

### 6. Navigation

- **Responsive** : Menu hamburger mobile
- **Sticky** : Changement d'apparence au scroll
- **Smooth scroll** : Navigation fluide entre sections
- **Accessibilité** : ARIA labels et focus management

### 7. Footer

- **Informations légales** : SIREN, RCS, adresse
- **Liens rapides** : Navigation et services
- **Contact** : Téléphone, email, adresse, horaires
- **Réseaux sociaux** : LinkedIn intégré

## Animations GSAP

### Tokens d'Animation

```javascript
// Durées
durations: {
  fast: 0.3,      // Micro-interactions
  normal: 0.6,    // Animations standard
  slow: 0.9,      // Animations complexes
  hero: 1.2       // Animations hero
}

// Easing
easing: {
  smooth: "power3.out",    // Mouvement naturel
  bounce: "power2.out",    // Effet rebond
  elastic: "elastic.out(1, 0.3)"  // Effet élastique
}
```

### Types d'Animations

- **fadeInUp** : Entrée avec translation verticale
- **scaleIn** : Entrée avec mise à l'échelle
- **slideInLeft/Right** : Entrée horizontale
- **heroEntrance** : Animation complexe pour hero
- **parallax** : Effet parallax avec ScrollTrigger

### ScrollTrigger Configuration

```javascript
scrollTriggerDefaults: {
  start: "top 80%",        // Déclenchement
  end: "bottom 20%",       // Fin
  toggleActions: "play none none reverse",  // Actions
  markers: false           // Désactivé en production
}
```

## API Backend

### Endpoints

#### POST /api/contact

**Description** : Traitement du formulaire de contact

**Body** :

```json
{
  "projectType": "charpente|bardage|couverture|mixte",
  "projectDetails": "string",
  "surface": "number",
  "deadline": "urgent|1-3mois|3-6mois|6mois+",
  "location": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "message": "string"
}
```

**Response** :

```json
{
  "success": true,
  "message": "Votre demande a été envoyée avec succès",
  "messageId": "email-message-id"
}
```

#### GET /health

**Description** : Vérification de l'état de l'API

**Response** :

```json
{
  "status": "OK",
  "message": "DK BUILDING API is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "latest"
}
```

### Service Email

- **Templates HTML** : Contact form et confirmation
- **Validation** : Express Validator
- **SMTP** : Configuration flexible (Gmail, etc.)
- **Sécurité** : Protection contre le spam

## Configuration

### Variables d'Environnement Backend

```bash
# Port du serveur
PORT=3001

# URL du frontend (CORS)
FRONTEND_URL=http://localhost:5173

# Configuration SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Email de contact
CONTACT_EMAIL=contact@dkbuilding.fr

# Environnement
NODE_ENV=development
```

### Configuration TailwindCSS

```javascript
theme: {
  extend: {
    colors: {
      'dk-yellow': '#F3E719',
      'dk-black': '#0E0E0E',
      'dk-white': '#FFFFFF',
      'dk-gray': { /* Palette complète */ }
    },
    fontFamily: {
      'display': ['Space Grotesk', 'Inter', 'system-ui'],
      'body': ['Inter', 'system-ui']
    }
  }
}
```

## SEO et Performance

### Métadonnées

- **Title** : Optimisé avec mots-clés locaux
- **Description** : 160 caractères avec SIREN
- **Keywords** : Charpente métallique, bardage, couverture, Albi, Tarn
- **Open Graph** : Facebook et Twitter
- **Schema.org** : LocalBusiness avec données complètes

### Performance

- **Lazy loading** : Images et composants
- **Code splitting** : React Router
- **Optimisation bundle** : Vite
- **Fonts** : Google Fonts avec preconnect
- **Images** : Formats optimisés (WebP)

### Accessibilité

- **prefers-reduced-motion** : Respect des préférences utilisateur
- **ARIA labels** : Navigation et formulaires
- **Focus management** : Tab navigation
- **Contraste** : Couleurs conformes WCAG
- **Sémantique** : HTML5 sémantique

## Déploiement

### Frontend (Vite)

```bash
cd frontend
npm run build
# Génère le dossier dist/ prêt pour déploiement
```

### Backend (Node.js)

```bash
cd backend
npm start
# Serveur Express sur le port 3001
```

### Production

- **Frontend** : Serveur web statique (Nginx, Apache)
- **Backend** : PM2 ou Docker
- **Domaine** : dkbuilding.fr
- **SSL** : Certificat Let's Encrypt
- **CDN** : Cloudflare pour les assets

## Maintenance

### Mises à jour

- **Dépendances** : npm audit et mise à jour régulière
- **Sécurité** : Helmet et CORS configurés
- **Logs** : Morgan pour le monitoring
- **Backup** : Sauvegarde régulière des données

### Monitoring

- **Health check** : Endpoint /health
- **Logs** : Console et fichiers
- **Performance** : Lighthouse CI
- **Uptime** : Monitoring externe

## Support et Contact

### Développement

- **Framework** : React + Node.js
- **Styling** : TailwindCSS
- **Animations** : GSAP
- **Email** : Nodemailer

### Contact Technique

- **Email** : <contact@dkbuilding.fr>
- **Téléphone** : +33 7 68 11 38 39
- **Adresse** : 59 Rue Pierre Cormary, 81000 Albi

---

**Version** : latest  
**Dernière mise à jour** : 13 octobre 2025  
**Auteur** : DK BUILDING
