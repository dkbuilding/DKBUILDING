# Guide d'Hébergement Gratuit — DK BUILDING

**Date** : 2025-01-18  
**Objectif** : Comparer les services d'hébergement gratuits pour héberger le site DK BUILDING en conservant toutes les fonctionnalités

---

## 🎯 Vue d'Ensemble

Votre site utilise :

- **Frontend** : React 19 + Vite 7 + Tailwind CSS 4
- **Fonctionnalités** : Actualités, Projets, Formulaire de contact, Administration, Médias
- **Besoin** : Hébergement gratuit avec support des fonctionnalités backend

---

## 🏆 Top 5 Services Recommandés (Gratuits)

### 1. **Vercel** ⭐⭐⭐⭐⭐ (RECOMMANDÉ)

**URL** : https://vercel.com

#### ✅ Avantages

- ✅ **100% gratuit** pour les projets personnels
- ✅ **Déploiement automatique** depuis GitHub/GitLab/Bitbucket
- ✅ **Vercel Functions** (Serverless) pour remplacer le backend
- ✅ **CDN global** (Edge Network) - Performance maximale
- ✅ **SSL automatique** (HTTPS gratuit)
- ✅ **Support React/Vite** natif
- ✅ **Prévisualisation** pour chaque commit (Pull Request)
- ✅ **Analytics** gratuits (trafic, performance)
- ✅ **Domaines personnalisés** gratuits (sous-domaines)

#### 📊 Limites Gratuites (Hobby Plan)

- **Bande passante** : 100 GB/mois
- **Fonctions serverless** : 100 GB-heures/mois
- **Invocations** : 1 million/mois
- **Builds** : Illimités
- **Déploiements** : Illimités
- **Domaines** : Illimités

#### 🔧 Compatibilité avec DK BUILDING

- ✅ Frontend React/Vite : **Parfait**
- ✅ Backend Functions : **Oui** (remplace Node.js backend)
- ✅ Base de données : **Oui** (via Vercel Postgres ou services externes)
- ✅ Stockage fichiers : **Oui** (via Vercel Blob ou services externes)
- ✅ Envoi d'emails : **Oui** (via Resend API directe ou Functions)

#### 💰 Coût

- **Gratuit** pour usage personnel
- **Pro** : $20/mois (si besoin de plus de ressources)

#### 🚀 Déploiement

```bash
# Installation
npm i -g vercel

# Déploiement
cd Site\ Web/apps/frontend
vercel

# Ou via GitHub (automatique)
# Connecter le repo GitHub → Déploiement automatique
```

---

### 2. **Netlify** ⭐⭐⭐⭐⭐

**URL** : https://www.netlify.com

#### ✅ Avantages

- ✅ **100% gratuit** (Starter Plan)
- ✅ **Déploiement automatique** depuis Git
- ✅ **Netlify Functions** (Serverless) pour backend
- ✅ **CDN global** (Edge Network)
- ✅ **SSL automatique** (HTTPS gratuit)
- ✅ **Support React/Vite** natif
- ✅ **Form Builder** intégré (pour formulaires)
- ✅ **Split Testing** gratuit (A/B testing)
- ✅ **Domaines personnalisés** gratuits

#### 📊 Limites Gratuites (Starter Plan)

- **Bande passante** : 100 GB/mois
- **Fonctions serverless** : 125 000 invocations/mois
- **Build minutes** : 300 minutes/mois
- **Déploiements** : Illimités
- **Domaines** : Illimités

#### 🔧 Compatibilité avec DK BUILDING

- ✅ Frontend React/Vite : **Parfait**
- ✅ Backend Functions : **Oui** (remplace Node.js backend)
- ✅ Base de données : **Oui** (via Netlify Fauna ou services externes)
- ✅ Stockage fichiers : **Oui** (via Netlify Large Media ou services externes)
- ✅ Envoi d'emails : **Oui** (via Netlify Functions + Resend)

#### 💰 Coût

- **Gratuit** pour usage personnel
- **Pro** : $19/mois (si besoin de plus de ressources)

#### 🚀 Déploiement

```bash
# Installation
npm i -g netlify-cli

# Déploiement
cd Site\ Web/apps/frontend
netlify deploy --prod

# Ou via GitHub (automatique)
# Connecter le repo GitHub → Déploiement automatique
```

---

### 3. **Cloudflare Pages** ⭐⭐⭐⭐

**URL** : https://pages.cloudflare.com

#### ✅ Avantages

- ✅ **100% gratuit** (illimité)
- ✅ **Déploiement automatique** depuis Git
- ✅ **Cloudflare Workers** (Serverless) pour backend
- ✅ **CDN global** (réseau Cloudflare - le plus rapide)
- ✅ **SSL automatique** (HTTPS gratuit)
- ✅ **Support React/Vite** natif
- ✅ **Analytics** gratuits
- ✅ **Domaines personnalisés** gratuits
- ✅ **Pas de limite de bande passante** (gratuit)

#### 📊 Limites Gratuites

- **Bande passante** : **Illimité** ⭐
- **Builds** : 500 builds/mois
- **Workers** : 100 000 requêtes/jour (gratuit)
- **Déploiements** : Illimités
- **Domaines** : Illimités

#### 🔧 Compatibilité avec DK BUILDING

- ✅ Frontend React/Vite : **Parfait**
- ✅ Backend Workers : **Oui** (remplace Node.js backend)
- ✅ Base de données : **Oui** (via Cloudflare D1 ou services externes)
- ✅ Stockage fichiers : **Oui** (via Cloudflare R2 ou services externes)
- ✅ Envoi d'emails : **Oui** (via Workers + Resend)

#### 💰 Coût

- **Gratuit** (illimité)
- **Workers Paid** : $5/mois (si besoin de plus de Workers)

#### 🚀 Déploiement

```bash
# Via GitHub (recommandé)
# Connecter le repo GitHub → Déploiement automatique

# Ou via Wrangler CLI
npm i -g wrangler
cd Site\ Web/apps/frontend
wrangler pages deploy dist
```

---

### 4. **GitHub Pages** ⭐⭐⭐

**URL** : https://pages.github.com

#### ✅ Avantages

- ✅ **100% gratuit** (illimité)
- ✅ **Intégration native** avec GitHub
- ✅ **SSL automatique** (HTTPS gratuit)
- ✅ **Domaines personnalisés** gratuits
- ✅ **Simple** à configurer

#### ❌ Limitations

- ❌ **Sites statiques uniquement** (pas de serverless)
- ❌ **Pas de backend** (nécessite services externes)
- ❌ **Pas de CDN** (performance limitée)
- ❌ **Pas de prévisualisation** automatique

#### 📊 Limites Gratuites

- **Bande passante** : 100 GB/mois
- **Stockage** : 1 GB
- **Builds** : Illimités
- **Domaines** : Illimités

#### 🔧 Compatibilité avec DK BUILDING

- ✅ Frontend React/Vite : **Oui** (après build)
- ❌ Backend : **Non** (nécessite services externes)
- ⚠️ Base de données : **Non** (nécessite services externes)
- ⚠️ Stockage fichiers : **Non** (nécessite services externes)
- ⚠️ Envoi d'emails : **Non** (nécessite services externes)

#### 💰 Coût

- **Gratuit** (illimité)

#### 🚀 Déploiement

```bash
# Build du projet
cd Site\ Web/apps/frontend
pnpm run build

# Déployer via GitHub Actions (automatique)
# Ou manuellement via gh-pages
npm i -g gh-pages
gh-pages -d dist
```

---

### 5. **Render** ⭐⭐⭐⭐

**URL** : https://render.com

#### ✅ Avantages

- ✅ **Gratuit** (Free Tier)
- ✅ **Déploiement automatique** depuis Git
- ✅ **Services backend** gratuits (Web Services)
- ✅ **Base de données** gratuite (PostgreSQL)
- ✅ **SSL automatique** (HTTPS gratuit)
- ✅ **Support React/Vite** natif

#### ⚠️ Limitations Gratuites

- ⚠️ **Services "spin down"** après 15 min d'inactivité (première requête lente)
- ⚠️ **Limite de RAM** : 512 MB
- ⚠️ **Limite CPU** : 0.1 CPU

#### 📊 Limites Gratuites (Free Tier)

- **Bande passante** : Illimité
- **Builds** : Illimités
- **Déploiements** : Illimités
- **Base de données** : PostgreSQL 1 GB (gratuit)
- **Services** : 1 service gratuit

#### 🔧 Compatibilité avec DK BUILDING

- ✅ Frontend React/Vite : **Parfait**
- ✅ Backend : **Oui** (Web Service gratuit)
- ✅ Base de données : **Oui** (PostgreSQL gratuit)
- ⚠️ Stockage fichiers : **Limité** (nécessite service externe)
- ✅ Envoi d'emails : **Oui** (via backend + Resend)

#### 💰 Coût

- **Gratuit** (avec limitations)
- **Starter** : $7/mois (sans spin down)

#### 🚀 Déploiement

```bash
# Via GitHub (recommandé)
# Connecter le repo GitHub → Créer un Static Site
# Render détecte automatiquement Vite
```

---

## 📊 Comparaison Détaillée

| Service              | Frontend    | Backend        | Base de Données | Stockage     | Email | Bande Passante | Coût      |
| -------------------- | ----------- | -------------- | --------------- | ------------ | ----- | -------------- | --------- |
| **Vercel**           | ✅ Natif    | ✅ Functions   | ✅ (Externe)    | ✅ (Externe) | ✅    | 100 GB/mois    | Gratuit   |
| **Netlify**          | ✅ Natif    | ✅ Functions   | ✅ (Externe)    | ✅ (Externe) | ✅    | 100 GB/mois    | Gratuit   |
| **Cloudflare Pages** | ✅ Natif    | ✅ Workers     | ✅ (Externe)    | ✅ (Externe) | ✅    | **Illimité**   | Gratuit   |
| **GitHub Pages**     | ✅ Statique | ❌ Non         | ❌ Non          | ❌ Non       | ❌    | 100 GB/mois    | Gratuit   |
| **Render**           | ✅ Natif    | ✅ Web Service | ✅ PostgreSQL   | ⚠️ Limité    | ✅    | Illimité       | Gratuit\* |

\*Render : Service "spin down" après 15 min d'inactivité

---

## 🎯 Recommandation pour DK BUILDING

### Option 1 : **Vercel** (Recommandé) ⭐

**Pourquoi Vercel ?**

- ✅ Support React/Vite natif (détection automatique)
- ✅ Déploiement en 1 clic depuis GitHub
- ✅ Vercel Functions pour remplacer le backend
- ✅ Performance excellente (Edge Network)
- ✅ Analytics gratuits
- ✅ Documentation excellente

**Migration nécessaire :**

1. Convertir le backend Node.js en Vercel Functions
2. Utiliser Supabase (gratuit) pour la base de données
3. Utiliser Cloudinary (gratuit) pour le stockage de fichiers
4. Utiliser Resend (gratuit) pour l'envoi d'emails

### Option 2 : **Cloudflare Pages** (Alternative) ⭐

**Pourquoi Cloudflare Pages ?**

- ✅ Bande passante **illimitée** (gratuit)
- ✅ Réseau CDN le plus rapide au monde
- ✅ Cloudflare Workers pour le backend
- ✅ Cloudflare D1 (base de données SQLite) gratuit
- ✅ Cloudflare R2 (stockage) gratuit (10 GB)

**Migration nécessaire :**

1. Convertir le backend en Cloudflare Workers
2. Utiliser Cloudflare D1 pour la base de données
3. Utiliser Cloudflare R2 pour le stockage
4. Utiliser Resend pour l'envoi d'emails

### Option 3 : **Netlify** (Alternative) ⭐

**Pourquoi Netlify ?**

- ✅ Très similaire à Vercel
- ✅ Netlify Functions pour le backend
- ✅ Form Builder intégré (pour formulaires)
- ✅ Bonne documentation

**Migration nécessaire :**

1. Convertir le backend en Netlify Functions
2. Utiliser Supabase pour la base de données
3. Utiliser Cloudinary pour le stockage
4. Utiliser Resend pour l'envoi d'emails

---

## 🔧 Services Complémentaires Gratuits (Nécessaires)

Pour remplacer complètement le backend, vous aurez besoin de :

### Base de Données

1. **Supabase** (Recommandé)
   - PostgreSQL gratuit (500 MB)
   - API REST automatique
   - Authentification intégrée
   - Stockage de fichiers (1 GB gratuit)
   - URL : https://supabase.com

2. **Firebase Firestore** (Alternative)
   - NoSQL gratuit (1 GB)
   - URL : https://firebase.google.com

3. **Cloudflare D1** (Alternative)
   - SQLite sur Edge
   - Gratuit (5 GB)
   - URL : https://developers.cloudflare.com/d1

### Stockage de Fichiers

1. **Cloudinary** (Recommandé)
   - Gestion d'images/vidéos
   - 25 GB gratuit
   - URL : https://cloudinary.com

2. **Supabase Storage** (Alternative)
   - 1 GB gratuit (inclus avec Supabase)
   - URL : https://supabase.com/storage

3. **Cloudflare R2** (Alternative)
   - 10 GB gratuit
   - Compatible S3
   - URL : https://developers.cloudflare.com/r2

### Envoi d'Emails

1. **Resend** (Recommandé)
   - 3 000 emails/mois gratuit
   - API simple
   - URL : https://resend.com

2. **EmailJS** (Alternative)
   - 200 emails/mois gratuit
   - URL : https://www.emailjs.com

3. **Formspree** (Alternative)
   - 50 soumissions/mois gratuit
   - URL : https://formspree.io

---

## 📝 Plan de Migration Recommandé

### Étape 1 : Choisir l'Hébergement

- ✅ **Vercel** (recommandé) ou **Cloudflare Pages**

### Étape 2 : Configurer les Services Complémentaires

- ✅ **Supabase** (base de données + auth + stockage)
- ✅ **Cloudinary** (médias/images)
- ✅ **Resend** (emails)

### Étape 3 : Migrer le Code

- ✅ Convertir le backend en Functions/Workers
- ✅ Remplacer les appels `/api/*` par des appels directs
- ✅ Configurer l'authentification Supabase
- ✅ Migrer les données vers Supabase

### Étape 4 : Déployer

- ✅ Connecter le repo GitHub
- ✅ Configurer les variables d'environnement
- ✅ Déployer automatiquement

---

## 🚀 Déploiement Rapide (Vercel)

### 1. Préparer le Projet

```bash
cd Site\ Web/apps/frontend

# Créer vercel.json (optionnel, pour configuration)
cat > vercel.json << EOF
{
  "buildCommand": "pnpm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
EOF
```

### 2. Déployer sur Vercel

```bash
# Option A : Via CLI
npm i -g vercel
vercel

# Option B : Via GitHub (recommandé)
# 1. Pousser le code sur GitHub
# 2. Aller sur https://vercel.com
# 3. "Import Project" → Sélectionner le repo
# 4. Vercel détecte automatiquement Vite
# 5. Déploiement automatique !
```

### 3. Configurer les Variables d'Environnement

Dans le dashboard Vercel :

- `SUPABASE_URL` : URL de votre projet Supabase
- `SUPABASE_ANON_KEY` : Clé publique Supabase
- `RESEND_API_KEY` : Clé API Resend
- `CLOUDINARY_CLOUD_NAME` : Nom du cloud Cloudinary

---

## ⚠️ Services Payants (À Éviter pour le Gratuit)

### Hostinger

- ❌ **Payant uniquement** (à partir de ~$2.99/mois)
- ✅ Bon pour l'hébergement traditionnel (PHP, MySQL)
- ❌ Pas adapté pour React/Vite moderne

### Autres Services Payants

- **Heroku** : Payant (plus de plan gratuit)
- **AWS** : Payant (avec crédit gratuit limité)
- **Google Cloud** : Payant (avec crédit gratuit limité)
- **Azure** : Payant (avec crédit gratuit limité)

---

## ✅ Conclusion

**Recommandation finale** : **Vercel** + **Supabase** + **Cloudinary** + **Resend**

Cette combinaison offre :

- ✅ Hébergement **100% gratuit**
- ✅ Toutes les fonctionnalités backend remplacées
- ✅ Performance excellente
- ✅ Scalabilité automatique
- ✅ Déploiement automatique depuis GitHub

**Alternative** : **Cloudflare Pages** + **Cloudflare D1** + **Cloudflare R2** + **Resend**

Cette combinaison offre :

- ✅ Hébergement **100% gratuit**
- ✅ Bande passante **illimitée**
- ✅ Tous les services dans l'écosystème Cloudflare

---

**Note** : Tous ces services sont gratuits pour un usage personnel/moderé. Les limites gratuites sont généralement suffisantes pour un site comme DK BUILDING.
