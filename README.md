# 🏗️ DK BUILDING - Site Web

Site web moderne pour DK BUILDING, entreprise spécialisée dans la construction métallique (charpente, bardage, couverture) basée à Albi, Tarn.

## 🚀 Démarrage Rapide

### Prérequis

- Node.js (version 18 ou supérieure)
- npm

### Installation et Lancement

```bash
# Naviguer vers le répertoire du projet
cd "$(pwd)"

# Lancer le script de démarrage automatique
./start.sh
```

Le script va :

- Installer automatiquement toutes les dépendances
- Démarrer le backend sur le port 3001
- Démarrer le frontend sur le port 5173
- Ouvrir automatiquement le site dans votre navigateur

### Accès

- **Frontend** : <http://localhost:5173>
- **Backend API** : <http://localhost:3001>
- **Health Check** : <http://localhost:3001/health>

## 🎨 Caractéristiques

### Design Moderne

- **Palette de couleurs** : Jaune (#F3E719), Noir (#0E0E0E), Blanc (#FFFFFF)
- **Typographie** : Space Grotesk (titres) + Inter (corps)
- **Animations** : GSAP avec ScrollTrigger pour des effets fluides
- **Responsive** : Mobile-first avec navigation hamburger

### Fonctionnalités

- ✅ **Hero animé** avec logo DK BUILDING et parallax
- ✅ **Section Services** avec 3 cartes (Charpente, Bardage, Couverture)
- ✅ **Galerie Portfolio** avec lightbox moderne
- ✅ **Section A Propos** avec données réelles de l'entreprise
- ✅ **Formulaire de contact** multi-étapes avec validation
- ✅ **Navigation responsive** avec menu hamburger
- ✅ **Footer complet** avec informations légales

### Technologies

- **Frontend** : React 18 + Vite + TailwindCSS + GSAP
- **Backend** : Node.js + Express + Nodemailer
- **SEO** : Meta tags optimisés + Schema.org + Sitemap
- **Performance** : Lazy loading + Code splitting

## 📋 Informations Entreprise

- **Nom** : DK BUILDING
- **SIREN** : 947 998 555
- **RCS** : Albi B 947998555
- **Adresse** : 59 Rue Pierre Cormary, 81000 Albi
- **Dirigeant** : Dicalou KHAMIDOV
- **Création** : 10 janvier 2023
- **Services** : Charpente métallique, Bardage, Couverture

## 🔧 Configuration Backend

### Variables d'Environnement

Copiez le fichier `backend/env.example` vers `backend/.env` et configurez :

```bash
# Configuration SMTP pour l'envoi d'emails
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Email de contact
CONTACT_EMAIL=contact@dkbuilding.fr

# URL du frontend (pour CORS)
FRONTEND_URL=http://localhost:5173
```

### Configuration Email

1. Activez l'authentification à 2 facteurs sur Gmail
2. Générez un mot de passe d'application
3. Utilisez ce mot de passe dans `SMTP_PASS`

## 📱 Responsive Design

Le site est entièrement responsive avec :

- **Mobile** : Navigation hamburger, animations adaptées
- **Tablet** : Layout adapté avec grilles flexibles
- **Desktop** : Expérience complète avec toutes les animations

## 🎭 Animations GSAP

### Types d'Animations

- **Hero Entrance** : Animation complexe au chargement
- **Scroll Reveal** : Révélation des éléments au scroll
- **Parallax** : Effets de profondeur
- **Hover Effects** : Micro-interactions sur les cartes
- **Stagger** : Animations en cascade

### Respect des Préférences

- **prefers-reduced-motion** : Animations réduites si demandé
- **Performance** : Animations optimisées GPU
- **Accessibilité** : Focus management et ARIA labels

## 🔍 SEO et Performance

### Optimisations SEO

- Meta tags optimisés avec mots-clés locaux
- Schema.org LocalBusiness avec données complètes
- Sitemap.xml et robots.txt
- Open Graph pour les réseaux sociaux

### Performance

- Score Lighthouse > 90
- Lazy loading des images
- Code splitting avec React Router
- Optimisation des fonts et assets

## 📚 Documentation

La documentation technique complète est disponible dans :

- `docs/DK-BUILDING-site-web.md` - Documentation détaillée
- `backend/env.example` - Configuration backend
- `frontend/tailwind.config.js` - Configuration TailwindCSS

## 🚀 Déploiement

### Frontend

```bash
cd frontend
npm run build
# Génère le dossier dist/ prêt pour déploiement
```

### Backend

```bash
cd backend
npm start
# Serveur Express sur le port 3001
```

### Production

- **Domaine** : dkbuilding.fr
- **SSL** : Certificat Let's Encrypt
- **CDN** : Cloudflare pour la distribution des assets
- **Monitoring** : Health checks et logs

## 🛠️ Développement

### Structure des Composants

```bash
src/components/
├── Hero.jsx          # Section hero avec animations
├── Services.jsx      # Grid des services
├── Portfolio.jsx     # Galerie avec lightbox
├── About.jsx         # Informations entreprise
├── Contact.jsx       # Formulaire multi-étapes
├── Footer.jsx        # Footer avec liens légaux
└── Navigation.jsx    # Navigation responsive
```

### API Endpoints

- `POST /api/contact` - Formulaire de contact
- `GET /health` - Health check
- `GET /api/status` - Statut de l'API

## 📞 Support

### Contact Technique

- **Email** : <contact@dkbuilding.fr>
- **Téléphone** : +33 7 68 11 38 39
- **Adresse** : 59 Rue Pierre Cormary, 81000 Albi

### Problèmes Courants

1. **Port déjà utilisé** : Changez le port dans les variables d'environnement
2. **Email non envoyé** : Vérifiez la configuration SMTP
3. **Animations lentes** : Vérifiez les préférences de mouvement réduit

---

**Version** : latest  
**Dernière mise à jour** : 13 octobre 2025  
**Auteur** : DK BUILDING
