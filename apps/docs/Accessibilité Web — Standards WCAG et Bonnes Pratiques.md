# Accessibilité Web — Standards WCAG et Bonnes Pratiques

> Guide de référence complet pour tous les projets — Conformité WCAG 2.1, ARIA, et standards d'accessibilité

**Version** : latest  
**Date** : Janvier 2025  
**Statut** : Guide universel pour tous les projets

---

## Table des Matières

1. [Introduction et Contexte](#1-introduction-et-contexte)
   - 1.1 [Qu'est-ce que l'Accessibilité Web ?](#11-quest-ce-que-laccessibilité-web-)
   - 1.2 [Importance et Obligations Légales](#12-importance-et-obligations-légales)
   - 1.3 [Niveaux WCAG 2.1](#13-niveaux-wcag-21)
   - 1.4 [Publics Concernés](#14-publics-concernés)

2. [WCAG 2.1 — Principes Fondamentaux](#2-wcag-21--principes-fondamentaux)
   - 2.1 [Perceptible](#21-perceptible)
   - 2.2 [Utilisable](#22-utilisable)
   - 2.3 [Compréhensible](#23-compréhensible)
   - 2.4 [Robuste](#24-robuste)

3. [Règles par Catégorie](#3-règles-par-catégorie)
   - 3.1 [Structure HTML Sémantique](#31-structure-html-sémantique)
   - 3.2 [Navigation et Clavier](#32-navigation-et-clavier)
   - 3.3 [Images et Médias](#33-images-et-médias)
   - 3.4 [Couleurs et Contraste](#34-couleurs-et-contraste)
   - 3.5 [Formulaires](#35-formulaires)
   - 3.6 [ARIA (Accessible Rich Internet Applications)](#36-aria-accessible-rich-internet-applications)
   - 3.7 [Typographie et Lisibilité](#37-typographie-et-lisibilité)
   - 3.8 [Animations et Mouvements](#38-animations-et-mouvements)
   - 3.9 [Liens et Boutons](#39-liens-et-boutons)
   - 3.10 [Tableaux](#310-tableaux)
   - 3.11 [Contenu Multimédia](#311-contenu-multimédia)
   - 3.12 [Temps et Délais](#312-temps-et-délais)

4. [Standards Techniques](#4-standards-techniques)
   - 4.1 [HTML](#41-html)
   - 4.2 [CSS](#42-css)
   - 4.3 [JavaScript](#43-javascript)

5. [Tests et Validation](#5-tests-et-validation)
   - 5.1 [Outils Automatiques](#51-outils-automatiques)
   - 5.2 [Tests Manuels](#52-tests-manuels)
   - 5.3 [Checklist de Validation](#53-checklist-de-validation)

6. [Spécificités par Type de Projet](#6-spécificités-par-type-de-projet)
   - 6.1 [Applications Web](#61-applications-web)
   - 6.2 [Sites E-commerce](#62-sites-e-commerce)
   - 6.3 [Applications Mobiles](#63-applications-mobiles)
   - 6.4 [Documents PDF](#64-documents-pdf)

7. [Performance et Accessibilité](#7-performance-et-accessibilité)

8. [Conformité Légale](#8-conformité-légale)
   - 8.1 [RGAA (France)](#81-rgaa-france)
   - 8.2 [Section 508 (États-Unis)](#82-section-508-états-unis)
   - 8.3 [EN 301 549 (Europe)](#83-en-301-549-europe)
   - 8.4 [ADA (Americans with Disabilities Act)](#84-ada-americans-with-disabilities-act)

9. [Ressources et Références](#9-ressources-et-références)

10. [Checklist Rapide par Projet](#10-checklist-rapide-par-projet)
    - 10.1 [Checklist Avant Mise en Production](#101-checklist-avant-mise-en-production)
    - 10.2 [Points Critiques à Vérifier](#102-points-critiques-à-vérifier)
    - 10.3 [Tests Essentiels](#103-tests-essentiels)

11. [Classes CSS Utiles et Réutilisables](#11-classes-css-utiles-et-réutilisables)
    - 11.1 [Classes d'Accessibilité Essentielles](#111-classes-daccessibilité-essentielles)
    - 11.2 [Classes pour États ARIA](#112-classes-pour-états-aria)
    - 11.3 [Classes pour Animations Réduites](#113-classes-pour-animations-réduites)

12. [Erreurs Courantes à Éviter](#12-erreurs-courantes-à-éviter)
    - 12.1 [Erreurs HTML](#121-erreurs-html)
    - 12.2 [Erreurs CSS](#122-erreurs-css)
    - 12.3 [Erreurs JavaScript](#123-erreurs-javascript)
    - 12.4 [Erreurs ARIA](#124-erreurs-aria)

13. [Glossaire des Termes Techniques](#13-glossaire-des-termes-techniques)
    - 13.1 [Termes WCAG](#131-termes-wcag)
    - 13.2 [Termes ARIA](#132-termes-aria)
    - 13.3 [Termes Techniques](#133-termes-techniques)
    - 13.4 [Termes Légaux](#134-termes-légaux)

14. [Exemples de Code Réutilisables](#14-exemples-de-code-réutilisables)
    - 14.1 [Composant Modal Accessible](#141-composant-modal-accessible)
    - 14.2 [Composant Accordéon Accessible](#142-composant-accordéon-accessible)
    - 14.3 [Composant Carrousel Accessible](#143-composant-carrousel-accessible)
    - 14.4 [Composant Formulaire Accessible](#144-composant-formulaire-accessible)

---

## 1. Introduction et Contexte

### 1.1 Qu'est-ce que l'Accessibilité Web ?

L'accessibilité web consiste à concevoir et développer des sites web, applications et outils numériques utilisables par **tous les utilisateurs**, y compris ceux qui ont des limitations fonctionnelles :

- **Déficiences visuelles** : cécité, malvoyance, daltonisme
- **Déficiences auditives** : surdité, malentendance
- **Déficiences motrices** : difficultés à utiliser la souris, clavier adapté, contrôle vocal
- **Déficiences cognitives** : troubles de l'attention, dyslexie, troubles de la mémoire
- **Limitations temporaires** : bras cassé, environnement bruyant, écran mal éclairé
- **Limitations technologiques** : connexion lente, navigateur ancien, appareil mobile

### 1.2 Importance et Obligations Légales

#### En France (RGAA)

Le **Référentiel Général d'Amélioration de l'Accessibilité (RGAA)** est basé sur les standards WCAG 2.1 et est **obligatoire** pour :

- Services publics (État, collectivités territoriales, établissements publics)
- Organismes délégataires d'une mission de service public
- Entreprises privées avec chiffre d'affaires > 250M€ (depuis 2021)

**Niveau de conformité requis** : **Niveau AA** (WCAG 2.1)

**Sanctions** : Amende pouvant aller jusqu'à 25 000 € par an et par site non conforme

#### En Europe (EN 301 549)

Standard européen harmonisé pour l'accessibilité des technologies de l'information et de la communication.

#### Aux États-Unis

- **Section 508** : Obligations pour les agences fédérales
- **ADA (Americans with Disabilities Act)** : Obligations pour les entreprises privées

### 1.3 Niveaux WCAG 2.1

Les **Web Content Accessibility Guidelines (WCAG)** définissent trois niveaux de conformité :

#### Niveau A (Minimum)

Conformité de base. **Obligatoire** pour tous les sites.

- Alternatives textuelles pour images
- Contrôles clavier de base
- Structure sémantique HTML
- Contraste minimum 3:1 pour texte large

#### Niveau AA (Recommandé)

Niveau standard pour la plupart des sites. **Obligatoire** en France (RGAA).

- Contraste 4.5:1 pour texte normal, 3:1 pour texte large
- Navigation clavier complète
- Formulaires accessibles
- Sous-titres vidéo
- Pas de contenu clignotant

#### Niveau AAA (Optimal)

Niveau le plus élevé. Souvent difficile à atteindre pour tous les contenus.

- Contraste 7:1 pour texte normal
- Langue simplifiée
- Pas de délais temporels
- Signes de langue des signes

**Objectif pour tous les projets** : **Niveau AA minimum**

### 1.4 Publics Concernés

L'accessibilité bénéficie à **tous les utilisateurs** :

- **Utilisateurs avec handicaps** : Accès égal aux informations et services
- **Utilisateurs mobiles** : Interfaces tactiles et contraintes d'affichage
- **Utilisateurs âgés** : Adaptation aux changements liés à l'âge
- **Utilisateurs en situation temporaire** : Contexte d'utilisation difficile
- **SEO** : Meilleur référencement (structure sémantique, alternatives textuelles)
- **Performance** : Code optimisé et structuré
- **Maintenabilité** : Code plus propre et documenté

---

## 2. WCAG 2.1 — Principes Fondamentaux

Les WCAG 2.1 reposent sur **4 principes fondamentaux** (POUR) :

### 2.1 Perceptible

L'information et les composants de l'interface doivent être présentés de manière à ce que les utilisateurs puissent les percevoir.

**Critères principaux** :

- **1.1 Alternatives textuelles** : Fournir des alternatives textuelles pour tout contenu non textuel
- **1.2 Médias temporels** : Fournir des alternatives pour les médias temporels (sous-titres, transcripts)
- **1.3 Adaptable** : Créer du contenu qui peut être présenté de différentes manières sans perte d'information
- **1.4 Distinguable** : Faciliter la perception visuelle et auditive du contenu (contraste, taille, couleurs)

### 2.2 Utilisable

Les composants de l'interface et la navigation doivent être utilisables.

**Critères principaux** :

- **2.1 Accessible au clavier** : Rendre toutes les fonctionnalités accessibles au clavier
- **2.2 Délais suffisants** : Donner aux utilisateurs suffisamment de temps pour lire et utiliser le contenu
- **2.3 Crises et réactions physiques** : Ne pas concevoir de contenu susceptible de provoquer des crises
- **2.4 Navigable** : Fournir des moyens d'aider les utilisateurs à naviguer, trouver le contenu et déterminer où ils se trouvent
- **2.5 Modalités d'entrée** : Faciliter l'utilisation des fonctionnalités par les utilisateurs au-delà du clavier

### 2.3 Compréhensible

Les informations et le fonctionnement de l'interface doivent être compréhensibles.

**Critères principaux** :

- **3.1 Lisible** : Rendre le contenu textuel lisible et compréhensible
- **3.2 Prévisible** : Faire en sorte que les pages apparaissent et fonctionnent de manière prévisible
- **3.3 Assistance à la saisie** : Aider les utilisateurs à éviter et corriger les erreurs

### 2.4 Robuste

Le contenu doit être suffisamment robuste pour être interprété de manière fiable par une large variété d'agents utilisateurs, y compris les technologies d'assistance.

**Critères principaux** :

- **4.1 Compatible** : Optimiser la compatibilité avec les agents utilisateurs actuels et futurs, y compris les technologies d'assistance

---

## 3. Règles par Catégorie

### 3.1 Structure HTML Sémantique

#### Éléments HTML5 Appropriés

Utiliser les éléments sémantiques HTML5 pour structurer le contenu :

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <title>Titre de la page</title>
  </head>
  <body>
    <header>
      <!-- En-tête du site : logo, navigation principale -->
    </header>

    <nav aria-label="Navigation principale">
      <!-- Navigation principale -->
    </nav>

    <main>
      <!-- Contenu principal unique de la page -->
      <article>
        <!-- Article autonome (blog, actualité) -->
      </article>

      <section aria-labelledby="section-title">
        <h2 id="section-title">Titre de section</h2>
        <!-- Contenu de section -->
      </section>

      <aside>
        <!-- Contenu complémentaire (sidebar) -->
      </aside>
    </main>

    <footer>
      <!-- Pied de page -->
    </footer>
  </body>
</html>
```

#### Hiérarchie des Titres (h1-h6)

**Règles obligatoires** :

- Un seul `<h1>` par page (titre principal)
- Hiérarchie logique et séquentielle (pas de saut de niveau)
- Ne pas utiliser les titres pour le style (utiliser CSS)
- Structure cohérente sur toutes les pages

**Exemple correct** :

```html
<h1>Titre principal de la page</h1>
<h2>Section principale</h2>
<h3>Sous-section</h3>
<h3>Autre sous-section</h3>
<h2>Autre section principale</h2>
<h3>Sous-section</h3>
<h4>Détail</h4>
```

**Exemple incorrect** :

```html
<h1>Titre principal</h1>
<h3>Saut de niveau - INCORRECT</h3>
<!-- Manque h2 -->
```

#### Landmarks ARIA

Les landmarks ARIA permettent aux technologies d'assistance de naviguer rapidement :

```html
<header role="banner">
  <!-- En-tête du site -->
</header>

<nav role="navigation" aria-label="Navigation principale">
  <!-- Navigation -->
</nav>

<main role="main">
  <!-- Contenu principal -->
</main>

<aside role="complementary" aria-label="Informations complémentaires">
  <!-- Sidebar -->
</aside>

<footer role="contentinfo">
  <!-- Pied de page -->
</footer>
```

**Note** : Les éléments HTML5 sémantiques (`<header>`, `<nav>`, `<main>`, etc.) ont déjà des rôles ARIA implicites. Utiliser `role` uniquement si nécessaire pour compatibilité.

#### Checklist Structure HTML

- [ ] Doctype HTML5 présent
- [ ] Attribut `lang` défini sur `<html>`
- [ ] Charset UTF-8 déclaré
- [ ] Un seul `<h1>` par page
- [ ] Hiérarchie des titres logique (pas de saut)
- [ ] Éléments sémantiques utilisés (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`)
- [ ] Landmarks ARIA appropriés
- [ ] Structure cohérente sur toutes les pages

---

### 3.2 Navigation et Clavier

#### Navigation au Clavier Complète

**Toutes les fonctionnalités doivent être accessibles au clavier** :

- **Tab** : Navigation vers l'élément suivant
- **Shift + Tab** : Navigation vers l'élément précédent
- **Enter / Espace** : Activer un bouton ou un lien
- **Flèches** : Navigation dans les menus déroulants, listes, tableaux
- **Échap** : Fermer les modales, menus, popups
- **Home / End** : Début/fin de ligne ou liste

#### Ordre de Tabulation Logique

L'ordre de tabulation doit suivre l'ordre visuel et logique du contenu :

```html
<!-- Ordre logique : de gauche à droite, de haut en bas -->
<header>
  <a href="/">Logo</a>
  <!-- Tab 1 -->
  <nav>
    <a href="/about">À propos</a>
    <!-- Tab 2 -->
    <a href="/contact">Contact</a>
    <!-- Tab 3 -->
  </nav>
</header>
<main>
  <button>Action principale</button>
  <!-- Tab 4 -->
</main>
```

**À éviter** : Utiliser `tabindex` avec des valeurs positives (sauf cas exceptionnels justifiés).

#### Focus Visible et Contrasté

**Règles obligatoires** :

- Le focus doit être **toujours visible**
- Contraste minimum **3:1** entre le focus et le fond
- Indicateur de focus suffisamment épais (minimum 2px)

**Exemple CSS** :

```css
/* Focus visible par défaut */
*:focus {
  outline: 2px solid #005fcc;
  outline-offset: 2px;
}

/* Focus personnalisé pour les boutons */
button:focus,
a:focus {
  outline: 3px solid #005fcc;
  outline-offset: 3px;
  box-shadow: 0 0 0 3px rgba(0, 95, 204, 0.3);
}

/* Ne JAMAIS supprimer le focus */
*:focus {
  outline: none; /* ❌ INTERDIT */
}
```

#### Skip Links (Liens d'Évitement)

Permettre aux utilisateurs de clavier de sauter directement au contenu principal :

```html
<body>
  <!-- Skip links en premier dans le DOM -->
  <a href="#main-content" class="skip-link"> Aller au contenu principal </a>
  <a href="#navigation" class="skip-link"> Aller à la navigation </a>
  <a href="#contact" class="skip-link"> Aller au formulaire de contact </a>

  <header>...</header>

  <main id="main-content">
    <!-- Contenu principal -->
  </main>
</body>
```

**CSS pour skip links** :

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

#### Pièges au Clavier Interdits

**Interdiction absolue** :

- Piège au clavier (focus bloqué dans une zone)
- Focus perdu (disparition du focus sans alternative)
- Focus invisible (focus présent mais non visible)

**Exemple de piège à éviter** :

```javascript
// ❌ MAUVAIS : Focus piégé dans une modale
modal.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    e.preventDefault(); // ❌ Bloque la navigation
  }
});

// ✅ BON : Gestion du focus dans la modale
modal.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    const focusableElements = modal.querySelectorAll(
      'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      lastElement.focus();
      e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      firstElement.focus();
      e.preventDefault();
    }
  }

  if (e.key === "Escape") {
    closeModal();
  }
});
```

#### Raccourcis Clavier Documentés

Si des raccourcis clavier sont implémentés :

- Les documenter clairement
- Permettre de les désactiver ou les personnaliser
- Éviter les conflits avec les raccourcis du navigateur

---

### 3.3 Images et Médias

#### Attribut Alt Obligatoire

**Toutes les images doivent avoir un attribut `alt`** :

```html
<!-- ✅ Image informative : description complète -->
<img
  src="graphique-ventes.png"
  alt="Graphique montrant une augmentation de 25% des ventes en 2024"
/>

<!-- ✅ Image décorative : alt vide -->
<img src="decoration-fleur.png" alt="" />

<!-- ✅ Image avec texte : reproduire le texte -->
<img src="logo-entreprise.png" alt="DK BUILDING - Construction métallique" />

<!-- ❌ MAUVAIS : Pas d'attribut alt -->
<img src="photo.jpg" />
```

#### Images Complexes

Pour les images complexes (graphiques, diagrammes, infographies), fournir une description longue :

```html
<figure>
  <img
    src="organigramme-entreprise.png"
    alt="Organigramme de l'entreprise DK BUILDING"
    longdesc="#organigramme-description"
  />
  <figcaption>Structure organisationnelle de DK BUILDING</figcaption>
</figure>

<div id="organigramme-description" class="sr-only">
  <h3>Description détaillée de l'organigramme</h3>
  <p>L'organigramme présente la hiérarchie de l'entreprise...</p>
</div>
```

**Alternative moderne** : Utiliser `<figure>` et `<figcaption>` :

```html
<figure>
  <img
    src="graphique-complexe.png"
    alt="Graphique des ventes trimestrielles 2024"
  />
  <figcaption>
    Graphique montrant les ventes par trimestre : Q1 (150K€), Q2 (180K€), Q3
    (220K€), Q4 (250K€). Tendance à la hausse constante.
  </figcaption>
</figure>
```

#### Images de Fond CSS

Les images de fond CSS doivent avoir une alternative textuelle dans le contenu HTML :

```html
<!-- ✅ BON : Alternative textuelle présente -->
<div
  class="hero-banner"
  role="img"
  aria-label="Équipe de construction sur un chantier"
>
  <h1>Nos réalisations</h1>
</div>

<!-- Alternative : Image décorative avec contenu textuel -->
<div class="hero-banner">
  <h1>Nos réalisations</h1>
  <p>Découvrez nos projets de construction métallique</p>
</div>
```

#### Sous-titres Vidéo (SRT, VTT)

**Obligatoire pour toutes les vidéos avec dialogue** :

```html
<video controls>
  <source src="presentation.mp4" type="video/mp4" />
  <track
    kind="captions"
    src="presentation-fr.vtt"
    srclang="fr"
    label="Français"
    default
  />
  <track
    kind="captions"
    src="presentation-en.vtt"
    srclang="en"
    label="English"
  />
</video>
```

**Format VTT (WebVTT)** :

```vtt
WEBVTT

00:00:00.000 --> 00:00:03.500
Bienvenue dans cette présentation
de DK BUILDING.

00:00:03.500 --> 00:00:07.200
Nous sommes spécialisés dans
la construction métallique.
```

#### Transcripts Audio

Pour les contenus audio uniquement, fournir un transcript textuel :

```html
<audio controls>
  <source src="podcast.mp3" type="audio/mpeg" />
</audio>

<div class="transcript">
  <h3>Transcript de l'audio</h3>
  <p><strong>00:00</strong> - Introduction...</p>
  <p><strong>00:30</strong> - Premier sujet...</p>
</div>
```

#### Audio-description pour Vidéos

Pour les vidéos avec informations visuelles importantes non décrites dans le dialogue :

```html
<video controls>
  <source src="video.mp4" type="video/mp4" />
  <track kind="captions" src="sous-titres.vtt" srclang="fr" />
  <track kind="descriptions" src="audio-description.vtt" srclang="fr" />
</video>
```

#### Contrôles Média Accessibles

**Règles obligatoires** :

- Contrôles accessibles au clavier
- Labels ARIA pour les boutons de contrôle
- Indicateurs d'état (lecture, pause, volume) accessibles

```html
<video controls aria-label="Vidéo de présentation DK BUILDING">
  <source src="video.mp4" type="video/mp4" />
</video>
```

---

### 3.4 Couleurs et Contraste

#### Ratio de Contraste Minimum

**WCAG 2.1 Niveau AA (Obligatoire)** :

- **Texte normal** (moins de 18pt ou 14pt gras) : **4.5:1**
- **Texte large** (18pt+ ou 14pt+ gras) : **3:1**
- **Éléments non textuels** (icônes, boutons) : **3:1**

**WCAG 2.1 Niveau AAA (Optimal)** :

- **Texte normal** : **7:1**
- **Texte large** : **4.5:1**

#### Outils de Vérification

- **WebAIM Contrast Checker** : https://webaim.org/resources/contrastchecker/
- **Colour Contrast Analyser (CCA)** : Application desktop
- **axe DevTools** : Extension navigateur avec vérification automatique
- **Lighthouse** : Audit de contraste intégré

**Exemple de vérification** :

```css
/* ✅ BON : Contraste 4.5:1 (AA) */
.text-normal {
  color: #333333; /* Texte sombre */
  background: #ffffff; /* Fond clair */
  /* Ratio : 12.6:1 - Conforme AA et AAA */
}

/* ✅ BON : Contraste 4.5:1 (AA) */
.text-light {
  color: #ffffff; /* Texte clair */
  background: #005fcc; /* Fond bleu */
  /* Ratio : 7.0:1 - Conforme AA et AAA */
}

/* ❌ MAUVAIS : Contraste insuffisant */
.text-low-contrast {
  color: #999999; /* Texte gris clair */
  background: #ffffff; /* Fond blanc */
  /* Ratio : 2.8:1 - Non conforme (minimum 4.5:1) */
}
```

#### Information Non Véhiculée Uniquement par la Couleur

**Règle absolue** : Ne jamais utiliser uniquement la couleur pour transmettre une information.

**Exemples incorrects** :

```html
<!-- ❌ MAUVAIS : Erreur indiquée uniquement par la couleur rouge -->
<p style="color: red;">Ce champ est obligatoire</p>

<!-- ❌ MAUVAIS : Lien identifié uniquement par la couleur -->
<a href="#" style="color: blue;">Cliquez ici</a>
```

**Exemples corrects** :

```html
<!-- ✅ BON : Erreur avec icône + texte + couleur -->
<p class="error">
  <span aria-hidden="true">⚠️</span>
  <strong>Erreur :</strong> Ce champ est obligatoire
</p>

<!-- ✅ BON : Lien avec soulignement + couleur -->
<a href="#" class="link">
  En savoir plus
  <span class="sr-only">(lien externe)</span>
</a>

<!-- ✅ BON : État avec icône + texte -->
<button aria-label="Article ajouté au panier" class="added">
  <span aria-hidden="true">✓</span>
  Ajouté
</button>
```

**CSS pour liens accessibles** :

```css
/* Lien avec soulignement + couleur */
a {
  color: #005fcc;
  text-decoration: underline;
}

a:hover,
a:focus {
  text-decoration: none;
  background-color: #005fcc;
  color: #ffffff;
}

/* État actif/visite avec style distinct */
a:visited {
  color: #551a8b;
}

a:active {
  color: #cc0000;
}
```

#### Indicateurs Visuels Supplémentaires

Pour les états et actions, utiliser plusieurs indicateurs :

- **Couleur** + **Icône** + **Texte**
- **Couleur** + **Forme** + **Position**
- **Couleur** + **Style** (gras, italique) + **Icône**

**Exemple : Formulaire avec validation** :

```html
<!-- ✅ BON : Validation avec icône + couleur + texte -->
<div class="form-field">
  <label for="email">Email</label>
  <input type="email" id="email" aria-invalid="false" />
  <span class="field-status" aria-live="polite">
    <span aria-hidden="true">✓</span>
    Format valide
  </span>
</div>

<div class="form-field error">
  <label for="email-error">Email</label>
  <input type="email" id="email-error" aria-invalid="true" />
  <span class="field-status error" aria-live="assertive">
    <span aria-hidden="true">⚠</span>
    Format invalide
  </span>
</div>
```

#### Mode Sombre/Clair Accessible

Si un mode sombre est proposé :

- Maintenir les ratios de contraste dans les deux modes
- Permettre le basculement facile (bouton accessible)
- Respecter `prefers-color-scheme` si possible

```css
/* Mode clair par défaut */
:root {
  --bg-color: #ffffff;
  --text-color: #333333;
  --link-color: #005fcc;
}

/* Mode sombre */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #1a1a1a;
    --text-color: #e0e0e0;
    --link-color: #4a9eff;
  }
}

/* Vérifier les contrastes dans les deux modes */
```

---

### 3.5 Formulaires

#### Labels Associés à Tous les Champs

**Méthode 1 : Attribut `for` et `id`** (Recommandé)

```html
<label for="nom">Nom complet</label>
<input type="text" id="nom" name="nom" required />
```

**Méthode 2 : Label englobant**

```html
<label>
  Nom complet
  <input type="text" name="nom" required />
</label>
```

**Méthode 3 : ARIA (si label impossible)**

```html
<input type="text" name="nom" aria-label="Nom complet" required />
```

**Méthode 4 : ARIA avec référence**

```html
<span id="nom-label">Nom complet</span>
<input type="text" name="nom" aria-labelledby="nom-label" required />
```

#### Instructions Claires et Contextuelles

Fournir des instructions avant ou dans le champ :

```html
<label for="telephone">Téléphone</label>
<span class="field-hint" id="telephone-hint"> Format : 06 12 34 56 78 </span>
<input
  type="tel"
  id="telephone"
  name="telephone"
  aria-describedby="telephone-hint"
  pattern="[0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}"
/>
```

#### Messages d'Erreur Descriptifs

**Règles obligatoires** :

- Message d'erreur **associé au champ** (aria-describedby)
- Message **descriptif** (pas juste "Erreur")
- Message **visible** et **accessible**
- Message **en temps réel** si possible

```html
<div class="form-field">
  <label for="email">Email</label>
  <input
    type="email"
    id="email"
    name="email"
    aria-invalid="true"
    aria-describedby="email-error"
  />
  <span id="email-error" class="error-message" role="alert">
    L'adresse email doit contenir un @ et un domaine valide
  </span>
</div>
```

**CSS pour messages d'erreur** :

```css
.error-message {
  color: #d32f2f;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.error-message::before {
  content: "⚠";
  aria-hidden: true;
}

input[aria-invalid="true"] {
  border: 2px solid #d32f2f;
  outline: 2px solid #d32f2f;
  outline-offset: 2px;
}
```

#### Validation en Temps Réel Accessible

```javascript
// Exemple : Validation accessible en temps réel
const emailInput = document.getElementById("email");
const errorMessage = document.getElementById("email-error");

emailInput.addEventListener("blur", () => {
  const email = emailInput.value;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    emailInput.setAttribute("aria-invalid", "true");
    emailInput.setAttribute("aria-describedby", "email-error");
    errorMessage.textContent = "L'adresse email n'est pas valide";
    errorMessage.setAttribute("role", "alert");
  } else {
    emailInput.setAttribute("aria-invalid", "false");
    emailInput.removeAttribute("aria-describedby");
    errorMessage.textContent = "";
    errorMessage.removeAttribute("role");
  }
});
```

#### Groupes de Champs (fieldset/legend)

Pour regrouper des champs liés :

```html
<fieldset>
  <legend>Informations de contact</legend>

  <div class="form-field">
    <label for="email">Email</label>
    <input type="email" id="email" name="email" />
  </div>

  <div class="form-field">
    <label for="telephone">Téléphone</label>
    <input type="tel" id="telephone" name="telephone" />
  </div>
</fieldset>

<fieldset>
  <legend>Préférences de communication</legend>

  <div class="radio-group">
    <input type="radio" id="pref-email" name="preference" value="email" />
    <label for="pref-email">Email</label>
  </div>

  <div class="radio-group">
    <input type="radio" id="pref-phone" name="preference" value="phone" />
    <label for="pref-phone">Téléphone</label>
  </div>
</fieldset>
```

#### Champs Obligatoires Identifiés

**Méthode 1 : Astérisque + texte** (Recommandé)

```html
<label for="nom">
  Nom complet
  <span class="required" aria-label="champ obligatoire">*</span>
</label>
<input type="text" id="nom" name="nom" required aria-required="true" />
```

**Méthode 2 : Texte explicite**

```html
<label for="nom">Nom complet (obligatoire)</label>
<input type="text" id="nom" name="nom" required aria-required="true" />
```

**CSS pour champs obligatoires** :

```css
.required {
  color: #d32f2f;
  font-weight: bold;
}

input[required],
select[required],
textarea[required] {
  border-left: 3px solid #d32f2f;
}
```

#### Format de Saisie Attendu Indiqué

```html
<label for="date-naissance">Date de naissance</label>
<span class="field-hint" id="date-hint">Format : JJ/MM/AAAA</span>
<input
  type="date"
  id="date-naissance"
  name="date-naissance"
  aria-describedby="date-hint"
  placeholder="JJ/MM/AAAA"
/>
```

#### Autocomplétion (autocomplete)

Utiliser l'attribut `autocomplete` pour faciliter la saisie :

```html
<input type="text" name="nom" autocomplete="name" />
<input type="email" name="email" autocomplete="email" />
<input type="tel" name="telephone" autocomplete="tel" />
<input type="text" name="adresse" autocomplete="street-address" />
<input type="text" name="ville" autocomplete="address-level2" />
<input type="text" name="code-postal" autocomplete="postal-code" />
```

**Valeurs courantes** : `name`, `email`, `tel`, `address-line1`, `address-line2`, `address-level1`, `address-level2`, `postal-code`, `country`, `organization`, `bday`, `sex`, `url`, `username`, `current-password`, `new-password`

---

### 3.6 ARIA (Accessible Rich Internet Applications)

#### Roles ARIA Appropriés

Les rôles ARIA définissent le type d'élément pour les technologies d'assistance :

```html
<!-- Navigation -->
<nav role="navigation" aria-label="Navigation principale">
  <!-- Recherche -->
  <form role="search" aria-label="Recherche sur le site">
    <!-- Bannière -->
    <header role="banner">
      <!-- Contenu principal -->
      <main role="main">
        <!-- Complémentaire -->
        <aside role="complementary" aria-label="Informations complémentaires">
          <!-- Informations de contenu -->
          <footer role="contentinfo">
            <!-- Application (SPA) -->
            <div role="application" aria-label="Application de gestion">
              <!-- Dialog/Modal -->
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
              >
                <h2 id="modal-title">Titre de la modale</h2>
              </div>

              <!-- Alert -->
              <div role="alert" aria-live="assertive">
                Message d'alerte important
              </div>

              <!-- Status -->
              <div role="status" aria-live="polite">
                Opération terminée avec succès
              </div>
            </div>
          </footer>
        </aside>
      </main>
    </header>
  </form>
</nav>
```

**Note** : Les éléments HTML5 sémantiques ont déjà des rôles ARIA implicites. Ne pas redéfinir ces rôles sauf nécessité.

#### Attributs ARIA Essentiels

**aria-label** : Label textuel pour un élément

```html
<button aria-label="Fermer la modale">
  <span aria-hidden="true">×</span>
</button>
```

**aria-labelledby** : Référence vers un élément qui sert de label

```html
<h2 id="section-title">Nos services</h2>
<section aria-labelledby="section-title">
  <!-- Contenu -->
</section>
```

**aria-describedby** : Référence vers un élément qui décrit l'élément

```html
<input type="password" aria-describedby="password-hint" />
<span id="password-hint">
  Le mot de passe doit contenir au moins 8 caractères
</span>
```

**aria-hidden** : Masquer un élément aux technologies d'assistance

```html
<!-- Icône décorative -->
<span aria-hidden="true">🎨</span>

<!-- Élément visuel redondant -->
<div aria-hidden="true" class="decoration">
  <!-- Contenu décoratif -->
</div>
```

#### États ARIA

**aria-expanded** : État d'expansion (menus, accordéons)

```html
<button aria-expanded="false" aria-controls="menu-dropdown" id="menu-button">
  Menu
</button>
<ul id="menu-dropdown" hidden>
  <li><a href="/">Accueil</a></li>
</ul>

<script>
  const button = document.getElementById("menu-button");
  const menu = document.getElementById("menu-dropdown");

  button.addEventListener("click", () => {
    const isExpanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", !isExpanded);
    menu.hidden = isExpanded;
  });
</script>
```

**aria-disabled** : Élément désactivé

```html
<button aria-disabled="true" disabled>Action non disponible</button>
```

**aria-checked** : État de case à cocher/radio

```html
<input type="checkbox" id="consent" aria-checked="false" />
<label for="consent">J'accepte les conditions</label>
```

**aria-selected** : Élément sélectionné (tabs, listbox)

```html
<div role="tablist">
  <button role="tab" aria-selected="true" aria-controls="panel-1" id="tab-1">
    Onglet 1
  </button>
  <button role="tab" aria-selected="false" aria-controls="panel-2" id="tab-2">
    Onglet 2
  </button>
</div>
```

**aria-invalid** : Champ avec erreur de validation

```html
<input type="email" aria-invalid="true" aria-describedby="email-error" />
<span id="email-error" role="alert"> Format d'email invalide </span>
```

#### Live Regions (aria-live)

Pour annoncer les changements dynamiques :

**aria-live="polite"** : Annonce après la tâche en cours

```html
<div aria-live="polite" aria-atomic="true" class="sr-only">
  <span id="status-message"></span>
</div>

<script>
  document.getElementById("status-message").textContent =
    "3 articles ajoutés au panier";
</script>
```

**aria-live="assertive"** : Annonce immédiate (urgent)

```html
<div aria-live="assertive" aria-atomic="true" role="alert">
  <span id="error-message"></span>
</div>

<script>
  document.getElementById("error-message").textContent =
    "Erreur : connexion échouée";
</script>
```

**aria-atomic** : Annoncer tout le contenu (true) ou seulement les changements (false)

**aria-relevant** : Quels changements annoncer (additions, removals, text, all)

#### Landmarks ARIA

Pour structurer la page (équivalents des éléments HTML5) :

```html
<div role="banner">
  <!-- En-tête -->
</div>

<nav role="navigation" aria-label="Navigation principale">
  <!-- Navigation -->
</nav>

<main role="main">
  <!-- Contenu principal -->
</main>

<aside role="complementary" aria-label="Sidebar">
  <!-- Complémentaire -->
</aside>

<footer role="contentinfo">
  <!-- Pied de page -->
</footer>

<form role="search" aria-label="Recherche">
  <!-- Formulaire de recherche -->
</form>
```

#### Bonnes Pratiques ARIA

**✅ À FAIRE** :

- Utiliser les éléments HTML5 sémantiques en priorité
- Utiliser ARIA uniquement quand nécessaire
- Tester avec un lecteur d'écran
- Maintenir la cohérence (aria-expanded avec aria-controls)

**❌ À ÉVITER** :

- Redondance avec HTML sémantique (ex: `<button role="button">`)
- Utiliser ARIA pour corriger un HTML mal structuré
- Oublier de mettre à jour les états ARIA dynamiquement
- Utiliser `role="presentation"` sur des éléments interactifs

---

### 3.7 Typographie et Lisibilité

#### Taille de Police Minimale

**Recommandation** : **16px (1rem)** minimum pour le texte principal

```css
/* ✅ BON : Taille de base accessible */
body {
  font-size: 16px; /* 1rem */
  line-height: 1.5;
}

/* ✅ BON : Texte plus petit acceptable pour les notes */
.small-text {
  font-size: 14px; /* 0.875rem - acceptable si contraste suffisant */
}

/* ❌ MAUVAIS : Texte trop petit */
.tiny-text {
  font-size: 10px; /* Trop petit, difficile à lire */
}
```

#### Hauteur de Ligne (line-height)

**Minimum recommandé** : **1.5** pour le texte normal

```css
/* ✅ BON : Hauteur de ligne confortable */
p {
  line-height: 1.5; /* 150% */
}

/* Pour les titres, peut être plus serré */
h1,
h2,
h3 {
  line-height: 1.2; /* Acceptable pour les titres */
}

/* ❌ MAUVAIS : Hauteur de ligne trop serrée */
.compact {
  line-height: 1; /* Trop serré, difficile à lire */
}
```

#### Espacement des Paragraphes

Espacement suffisant entre les paragraphes pour faciliter la lecture :

```css
p {
  margin-bottom: 1em; /* Espacement confortable */
}

/* Éviter les paragraphes collés */
p + p {
  margin-top: 1em;
}
```

#### Largeur de Ligne Optimale

**Recommandation** : **50-75 caractères** par ligne pour une lecture optimale

```css
/* ✅ BON : Largeur de ligne optimale */
article {
  max-width: 65ch; /* ~65 caractères */
  margin: 0 auto;
}

/* Alternative avec rem */
.container {
  max-width: 40rem; /* ~640px à 16px de base */
}
```

#### Police Lisible

**Recommandations** :

- **Sans-serif** pour le texte à l'écran (meilleure lisibilité)
- **Serif** acceptable pour les titres ou le contenu éditorial long
- Éviter les polices décoratives pour le texte principal
- Tester la lisibilité avec différentes tailles

```css
/* ✅ BON : Police système sans-serif */
body {
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    "Helvetica Neue",
    Arial,
    sans-serif;
}

/* ✅ BON : Police serif pour contenu éditorial */
article {
  font-family: Georgia, "Times New Roman", serif;
}

/* ❌ MAUVAIS : Police décorative pour texte principal */
body {
  font-family: "Comic Sans MS", cursive; /* Non professionnel */
}
```

#### Texte Justifié Évité

Le texte justifié peut créer des espaces irréguliers difficiles à lire :

```css
/* ✅ BON : Alignement à gauche */
p {
  text-align: left;
}

/* ❌ MAUVAIS : Justification pour texte long */
p {
  text-align: justify; /* Peut créer des espaces irréguliers */
}
```

#### Texte en Majuscules Limité

Éviter les blocs de texte en majuscules (difficile à lire) :

```css
/* ✅ BON : Utiliser text-transform avec modération */
.acronym {
  text-transform: uppercase; /* Acceptable pour acronymes */
  font-size: 0.9em;
  letter-spacing: 0.1em;
}

/* ❌ MAUVAIS : Tout le texte en majuscules */
.title {
  text-transform: uppercase; /* Si trop long, difficile à lire */
}
```

**Alternative** : Utiliser `font-variant: small-caps` pour un effet similaire mais plus lisible.

---

### 3.8 Animations et Mouvements

#### Respect de prefers-reduced-motion

**Obligatoire** : Respecter la préférence utilisateur pour réduire les animations

```css
/* Animations par défaut */
.animated-element {
  transition: transform 0.3s ease;
  animation: slide-in 0.5s ease;
}

/* Désactiver les animations si l'utilisateur préfère */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* Alternative : animations instantanées */
  .animated-element {
    transition: none;
    animation: none;
  }
}
```

**JavaScript pour détecter la préférence** :

```javascript
// Détecter la préférence utilisateur
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);

if (prefersReducedMotion.matches) {
  // Désactiver les animations
  document.documentElement.classList.add("reduced-motion");
}
```

#### Animations Désactivables

Permettre aux utilisateurs de désactiver les animations :

```html
<button id="toggle-animations" aria-pressed="false">
  Désactiver les animations
</button>

<script>
  const toggleButton = document.getElementById("toggle-animations");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );

  toggleButton.addEventListener("click", () => {
    const isPressed = toggleButton.getAttribute("aria-pressed") === "true";
    document.documentElement.classList.toggle("no-animations", !isPressed);
    toggleButton.setAttribute("aria-pressed", !isPressed);
  });

  // Respecter la préférence système
  if (prefersReducedMotion.matches) {
    document.documentElement.classList.add("no-animations");
    toggleButton.setAttribute("aria-pressed", "true");
  }
</script>
```

#### Pas d'Animation Flashante (Risque Épilepsie)

**Interdiction absolue** : Pas de contenu qui clignote plus de 3 fois par seconde

```css
/* ❌ INTERDIT : Animation flashante */
@keyframes flash {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.flashing {
  animation: flash 0.1s infinite; /* ❌ 10 fois par seconde - DANGEREUX */
}

/* ✅ BON : Animation lente et douce */
@keyframes gentle-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.gentle {
  animation: gentle-pulse 2s infinite; /* ✅ Lent et sûr */
}
```

**Règle WCAG** : Pas de contenu qui clignote plus de 3 fois par seconde, ou qui dépasse les seuils de flash général et de flash rouge.

#### Pause/Play pour Animations Automatiques

Pour les animations automatiques (carrousels, diaporamas), fournir des contrôles :

```html
<div class="carousel" aria-label="Diaporama de produits">
  <div class="carousel-controls">
    <button aria-label="Pause" id="pause-btn">
      <span aria-hidden="true">⏸</span>
    </button>
    <button aria-label="Lecture" id="play-btn" hidden>
      <span aria-hidden="true">▶</span>
    </button>
  </div>

  <div class="carousel-content" aria-live="polite">
    <!-- Contenu du carrousel -->
  </div>
</div>

<script>
  const pauseBtn = document.getElementById("pause-btn");
  const playBtn = document.getElementById("play-btn");
  const carousel = document.querySelector(".carousel-content");

  let autoPlayInterval;

  function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
      // Changer de slide
    }, 3000);
  }

  function pauseAutoPlay() {
    clearInterval(autoPlayInterval);
  }

  pauseBtn.addEventListener("click", () => {
    pauseAutoPlay();
    pauseBtn.hidden = true;
    playBtn.hidden = false;
  });

  playBtn.addEventListener("click", () => {
    startAutoPlay();
    playBtn.hidden = true;
    pauseBtn.hidden = false;
  });

  // Pause automatique si l'utilisateur préfère réduire les animations
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    pauseAutoPlay();
  }
</script>
```

#### Alternatives Statiques

Fournir une version statique du contenu animé :

```html
<!-- Version animée -->
<div class="animated-chart" aria-hidden="false">
  <!-- Graphique animé -->
</div>

<!-- Version statique (alternative) -->
<div class="static-chart" aria-hidden="true">
  <!-- Graphique statique avec mêmes informations -->
</div>

<script>
  // Afficher la version statique si animations désactivées
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document
      .querySelector(".animated-chart")
      .setAttribute("aria-hidden", "true");
    document
      .querySelector(".static-chart")
      .setAttribute("aria-hidden", "false");
  }
</script>
```

---

### 3.9 Liens et Boutons

#### Textes de Liens Descriptifs

**Règle absolue** : Éviter les textes génériques comme "cliquez ici", "en savoir plus", "lire la suite"

```html
<!-- ❌ MAUVAIS : Texte générique -->
<p>Pour plus d'informations, <a href="/contact">cliquez ici</a>.</p>

<!-- ✅ BON : Texte descriptif -->
<p>Pour plus d'informations, <a href="/contact">contactez notre équipe</a>.</p>

<!-- ✅ BON : Contexte clair -->
<a href="/services">Découvrir nos services de construction métallique</a>

<!-- ✅ BON : Lien avec contexte supplémentaire -->
<p>
  Consultez notre <a href="/portfolio">portfolio de réalisations</a>
  pour voir nos projets.
</p>
```

#### Liens Identifiables Visuellement

Les liens doivent être identifiables sans dépendre uniquement de la couleur :

```css
/* ✅ BON : Lien avec soulignement + couleur */
a {
  color: #005fcc;
  text-decoration: underline;
}

a:hover,
a:focus {
  text-decoration: none;
  background-color: #005fcc;
  color: #ffffff;
  outline: 2px solid #005fcc;
  outline-offset: 2px;
}

/* Pour les liens dans le texte */
p a {
  text-decoration: underline;
  text-decoration-thickness: 2px;
}

/* Pour les liens dans les boutons (pas de soulignement) */
.button-link {
  text-decoration: none;
  /* Mais doit être clairement identifiable comme lien */
}
```

#### Boutons vs Liens (Sémantique Correcte)

**Règle** : Utiliser `<button>` pour les actions, `<a>` pour la navigation

```html
<!-- ✅ BON : Lien pour navigation -->
<a href="/contact">Nous contacter</a>

<!-- ✅ BON : Bouton pour action -->
<button type="button" onclick="submitForm()">Envoyer le formulaire</button>

<!-- ✅ BON : Lien stylisé comme bouton (navigation) -->
<a href="/contact" class="button"> Nous contacter </a>

<!-- ❌ MAUVAIS : Bouton pour navigation -->
<button onclick="window.location.href='/contact'">Nous contacter</button>

<!-- ❌ MAUVAIS : Lien pour action JavaScript -->
<a href="#" onclick="submitForm(); return false;"> Envoyer </a>
```

#### États Hover/Focus/Active Visibles

Tous les états interactifs doivent être visibles :

```css
/* États pour les liens */
a:link {
  color: #005fcc;
  text-decoration: underline;
}

a:visited {
  color: #551a8b;
}

a:hover {
  background-color: #005fcc;
  color: #ffffff;
  text-decoration: none;
}

a:focus {
  outline: 3px solid #005fcc;
  outline-offset: 3px;
  background-color: #e6f2ff;
}

a:active {
  color: #cc0000;
  outline: 3px solid #cc0000;
}

/* États pour les boutons */
button {
  background-color: #005fcc;
  color: #ffffff;
  border: 2px solid #005fcc;
  padding: 0.75rem 1.5rem;
}

button:hover {
  background-color: #004499;
  border-color: #004499;
}

button:focus {
  outline: 3px solid #005fcc;
  outline-offset: 3px;
  box-shadow: 0 0 0 3px rgba(0, 95, 204, 0.3);
}

button:active {
  background-color: #003366;
  transform: translateY(1px);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

#### Zones Cliquables Suffisantes

**Minimum WCAG** : **44x44 pixels** pour les zones cliquables tactiles

```css
/* ✅ BON : Zone cliquable suffisante */
button,
a.button {
  min-height: 44px;
  min-width: 44px;
  padding: 0.75rem 1.5rem;
}

/* Pour les icônes cliquables */
.icon-button {
  width: 44px;
  height: 44px;
  padding: 0.5rem;
}

/* Espacement entre les éléments cliquables */
.clickable-elements {
  gap: 8px; /* Minimum 8px entre éléments */
}
```

**Exception** : Les liens dans le texte peuvent être plus petits, mais doivent avoir une zone de clic étendue (padding) :

```css
/* Lien dans le texte avec zone de clic étendue */
p a {
  padding: 0.25rem 0.5rem;
  margin: -0.25rem -0.5rem; /* Zone de clic étendue */
  min-height: 44px; /* Si possible */
  display: inline-block;
}
```

---

### 3.10 Tableaux

#### En-têtes de Colonnes/Lignes (th)

**Obligatoire** : Utiliser `<th>` pour les en-têtes de colonnes et de lignes

```html
<!-- ✅ BON : Tableau avec en-têtes -->
<table>
  <caption>
    Tarifs des services de construction
  </caption>
  <thead>
    <tr>
      <th scope="col">Service</th>
      <th scope="col">Prix unitaire</th>
      <th scope="col">Unité</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Charpente métallique</th>
      <td>150 €</td>
      <td>m²</td>
    </tr>
    <tr>
      <th scope="row">Bardage</th>
      <td>80 €</td>
      <td>m²</td>
    </tr>
  </tbody>
</table>
```

#### Scope et Headers pour Tableaux Complexes

Pour les tableaux complexes avec plusieurs niveaux d'en-têtes :

```html
<!-- Tableau complexe avec headers -->
<table>
  <caption>
    Planning des chantiers 2024
  </caption>
  <thead>
    <tr>
      <th id="mois" scope="col">Mois</th>
      <th id="chantier1" scope="col" colspan="2">Chantier A</th>
      <th id="chantier2" scope="col" colspan="2">Chantier B</th>
    </tr>
    <tr>
      <th></th>
      <th id="a-debut" headers="chantier1" scope="col">Début</th>
      <th id="a-fin" headers="chantier1" scope="col">Fin</th>
      <th id="b-debut" headers="chantier2" scope="col">Début</th>
      <th id="b-fin" headers="chantier2" scope="col">Fin</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th id="janvier" scope="row">Janvier</th>
      <td headers="janvier a-debut">05/01</td>
      <td headers="janvier a-fin">20/01</td>
      <td headers="janvier b-debut">15/01</td>
      <td headers="janvier b-fin">30/01</td>
    </tr>
  </tbody>
</table>
```

#### Captions pour Contexte

Utiliser `<caption>` pour fournir un titre et un contexte au tableau :

```html
<table>
  <caption>
    Comparaison des matériaux de bardage : prix, durabilité et entretien
  </caption>
  <!-- Contenu du tableau -->
</table>
```

#### Résumés (summary) pour Tableaux Complexes

**Note** : L'attribut `summary` est déprécié en HTML5. Utiliser `<caption>` détaillé ou description avant/après le tableau :

```html
<div class="table-description">
  <p>
    Ce tableau compare les caractéristiques des différents matériaux de bardage.
    Utilisez les flèches pour naviguer entre les cellules.
  </p>
</div>

<table>
  <caption>
    Caractéristiques des matériaux de bardage
  </caption>
  <!-- Contenu du tableau -->
</table>
```

#### Tableaux de Données Uniquement

**Règle absolue** : Ne jamais utiliser les tableaux pour la mise en page

```html
<!-- ❌ MAUVAIS : Tableau pour mise en page -->
<table>
  <tr>
    <td>Colonne gauche</td>
    <td>Colonne droite</td>
  </tr>
</table>

<!-- ✅ BON : CSS Grid ou Flexbox pour mise en page -->
<div class="layout-grid">
  <aside>Colonne gauche</aside>
  <main>Colonne droite</main>
</div>

<style>
  .layout-grid {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 2rem;
  }
</style>
```

---

### 3.11 Contenu Multimédia

#### Sous-titres Synchronisés

**Obligatoire** : Sous-titres pour toutes les vidéos avec dialogue

Voir section **3.3 Images et Médias** pour les détails sur les formats SRT/VTT.

#### Transcripts Textuels

Pour les contenus audio uniquement ou vidéos sans dialogue :

```html
<audio controls aria-label="Podcast sur la construction métallique">
  <source src="podcast.mp3" type="audio/mpeg" />
</audio>

<div class="transcript">
  <h3>Transcript de l'audio</h3>
  <details>
    <summary>Afficher le transcript</summary>
    <div class="transcript-content">
      <p>
        <strong>00:00</strong> - Introduction : Bienvenue dans ce podcast...
      </p>
      <p>
        <strong>02:30</strong> - Premier sujet : Les avantages de la
        construction métallique...
      </p>
      <p>
        <strong>05:45</strong> - Deuxième sujet : Les différents types de
        bardage...
      </p>
    </div>
  </details>
</div>
```

#### Audio-description

Pour les vidéos avec informations visuelles importantes non décrites dans le dialogue :

Voir section **3.3 Images et Médias** pour les détails.

#### Contrôles Accessibles au Clavier

Tous les contrôles média doivent être accessibles au clavier :

```html
<video
  controls
  aria-label="Vidéo de présentation"
  aria-describedby="video-description"
>
  <source src="video.mp4" type="video/mp4" />
  <track kind="captions" src="sous-titres.vtt" srclang="fr" default />
</video>

<p id="video-description">
  Cette vidéo présente les services de DK BUILDING en 2 minutes.
</p>
```

**Contrôles personnalisés accessibles** :

```html
<div class="custom-video-player" role="application" aria-label="Lecteur vidéo">
  <video id="video" src="video.mp4"></video>

  <div class="controls" role="toolbar" aria-label="Contrôles vidéo">
    <button aria-label="Lecture" id="play-btn">
      <span aria-hidden="true">▶</span>
    </button>
    <button aria-label="Pause" id="pause-btn" hidden>
      <span aria-hidden="true">⏸</span>
    </button>
    <button aria-label="Sous-titres" id="captions-btn">
      <span aria-hidden="true">CC</span>
    </button>
    <input
      type="range"
      aria-label="Volume"
      min="0"
      max="100"
      value="100"
      id="volume-slider"
    />
  </div>
</div>

<script>
  // Gestion clavier pour les contrôles
  const playBtn = document.getElementById("play-btn");
  playBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      playVideo();
    }
  });
</script>
```

#### Alternatives Textuelles

Pour les médias non accessibles, fournir une alternative textuelle complète :

```html
<video controls>
  <source src="presentation.mp4" type="video/mp4" />
  <track kind="captions" src="sous-titres.vtt" srclang="fr" />
</video>

<div class="media-alternative">
  <h3>Alternative textuelle</h3>
  <p>
    Si vous ne pouvez pas visionner la vidéo, voici une description complète :
  </p>
  <div class="transcript">
    <p><strong>00:00-00:30</strong> - Introduction avec logo DK BUILDING...</p>
    <p>
      <strong>00:30-01:00</strong> - Présentation des services de charpente
      métallique...
    </p>
    <!-- Description complète de la vidéo -->
  </div>
</div>
```

---

### 3.12 Temps et Délais

#### Pas de Limite de Temps Stricte (ou Extensible)

**Règle** : Ne pas imposer de limite de temps stricte, ou permettre de l'étendre

```html
<!-- ❌ MAUVAIS : Timeout strict -->
<script>
  setTimeout(() => {
    window.location.href = "/timeout";
  }, 300000); // 5 minutes - déconnexion automatique
</script>

<!-- ✅ BON : Avertissement avec extension possible -->
<div id="session-warning" role="alert" aria-live="assertive" hidden>
  <p>Votre session expirera dans <span id="time-remaining">2 minutes</span>.</p>
  <button onclick="extendSession()">Prolonger la session</button>
</div>

<script>
  let timeRemaining = 120; // 2 minutes
  const warningShown = false;

  setInterval(() => {
    timeRemaining--;

    if (timeRemaining <= 60 && !warningShown) {
      showWarning();
      warningShown = true;
    }

    if (timeRemaining <= 0) {
      logout();
    }
  }, 1000);

  function extendSession() {
    timeRemaining = 120;
    hideWarning();
  }

  function showWarning() {
    document.getElementById("session-warning").hidden = false;
    updateTimeRemaining();
  }

  function updateTimeRemaining() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    document.getElementById("time-remaining").textContent =
      `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
</script>
```

#### Contenu Auto-actualisé avec Pause/Play

Pour le contenu qui se met à jour automatiquement (actualités, notifications) :

```html
<div class="live-updates" aria-live="polite">
  <div class="update-controls">
    <button aria-label="Pause les mises à jour" id="pause-updates">
      <span aria-hidden="true">⏸</span> Pause
    </button>
    <button aria-label="Reprendre les mises à jour" id="resume-updates" hidden>
      <span aria-hidden="true">▶</span> Reprendre
    </button>
  </div>

  <div id="updates-content">
    <!-- Contenu mis à jour automatiquement -->
  </div>
</div>

<script>
  let updateInterval;
  const pauseBtn = document.getElementById("pause-updates");
  const resumeBtn = document.getElementById("resume-updates");

  function startUpdates() {
    updateInterval = setInterval(() => {
      // Mettre à jour le contenu
      updateContent();
    }, 30000); // Toutes les 30 secondes
  }

  function pauseUpdates() {
    clearInterval(updateInterval);
    pauseBtn.hidden = true;
    resumeBtn.hidden = false;
  }

  function resumeUpdates() {
    startUpdates();
    resumeBtn.hidden = true;
    pauseBtn.hidden = false;
  }

  pauseBtn.addEventListener("click", pauseUpdates);
  resumeBtn.addEventListener("click", resumeUpdates);

  // Démarrer les mises à jour
  startUpdates();
</script>
```

#### Timeouts avec Avertissement

Si un timeout est nécessaire, avertir l'utilisateur et permettre l'extension :

Voir exemple dans la section précédente.

#### Sessions Extensibles

Permettre aux utilisateurs d'étendre leur session :

```html
<div
  id="session-extend"
  role="dialog"
  aria-modal="true"
  aria-labelledby="extend-title"
  hidden
>
  <h2 id="extend-title">Prolonger votre session ?</h2>
  <p>Votre session expirera dans 1 minute.</p>
  <div class="dialog-actions">
    <button onclick="extendSession()">Prolonger de 30 minutes</button>
    <button onclick="closeDialog()">Fermer</button>
  </div>
</div>
```

---

## 4. Standards Techniques

### 4.1 HTML

#### Doctype HTML5

**Obligatoire** : Utiliser le doctype HTML5 moderne

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Titre de la page</title>
  </head>
  <body>
    <!-- Contenu -->
  </body>
</html>
```

#### Langue Déclarée (lang)

**Obligatoire** : Déclarer la langue principale de la page

```html
<!-- ✅ BON : Langue déclarée -->
<html lang="fr">
  <!-- ✅ BON : Changement de langue dans le contenu -->
  <p>Texte en français.</p>
  <p lang="en">This is English text.</p>
  <p lang="es">Este es texto en español.</p>

  <!-- ✅ BON : Langue pour régions spécifiques -->
  <html lang="fr-FR">
    <!-- Français de France -->
    <html lang="fr-CA">
      <!-- Français du Canada -->
    </html>
  </html>
</html>
```

#### Charset UTF-8

**Obligatoire** : Déclarer le charset UTF-8 en premier dans le `<head>`

```html
<head>
  <meta charset="UTF-8" />
  <!-- Autres balises meta -->
</head>
```

#### Validation HTML (W3C Validator)

**Recommandé** : Valider le HTML avec le validateur W3C

- **Validateur W3C** : https://validator.w3.org/
- **Extension navigateur** : HTML Validator
- **CI/CD** : Intégrer la validation dans le pipeline

**Erreurs courantes à éviter** :

- Balises non fermées
- Attributs dupliqués
- Éléments imbriqués incorrectement
- Attributs invalides

---

### 4.2 CSS

#### Unités Relatives (rem, em, %)

**Recommandation** : Utiliser des unités relatives plutôt qu'absolues pour permettre le zoom

```css
/* ✅ BON : Unités relatives */
body {
  font-size: 16px; /* Base */
}

h1 {
  font-size: 2rem; /* 32px si base = 16px */
  margin-bottom: 1.5em; /* 1.5 × 32px = 48px */
}

.container {
  width: 90%; /* Relatif au parent */
  max-width: 1200px; /* Limite absolue acceptable */
}

/* ❌ MAUVAIS : Unités absolues partout */
h1 {
  font-size: 32px; /* Ne s'adapte pas au zoom utilisateur */
  margin-bottom: 48px;
}
```

**Conversion px → rem** (base 16px) :

- 12px = 0.75rem
- 14px = 0.875rem
- 16px = 1rem
- 18px = 1.125rem
- 20px = 1.25rem
- 24px = 1.5rem
- 32px = 2rem

#### Media Queries pour Zoom jusqu'à 200%

**Obligatoire** : Le contenu doit rester utilisable avec un zoom jusqu'à 200%

```css
/* ✅ BON : Layout adaptatif */
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

/* À 200% de zoom, les colonnes s'empilent automatiquement */
@media (max-width: 500px) {
  .container {
    grid-template-columns: 1fr;
  }
}

/* Test de zoom */
/* Zoom à 200% = largeur effective divisée par 2 */
/* Si layout casse à 500px, il doit fonctionner à 1000px avec zoom 200% */
```

#### Focus Styles Visibles

**Obligatoire** : Styles de focus visibles et contrastés

```css
/* ✅ BON : Focus visible par défaut */
*:focus {
  outline: 3px solid #005fcc;
  outline-offset: 3px;
}

/* ✅ BON : Focus personnalisé pour éléments interactifs */
button:focus,
a:focus,
input:focus,
select:focus,
textarea:focus {
  outline: 3px solid #005fcc;
  outline-offset: 3px;
  box-shadow: 0 0 0 3px rgba(0, 95, 204, 0.3);
}

/* ✅ BON : Focus pour mode sombre */
@media (prefers-color-scheme: dark) {
  *:focus {
    outline-color: #4a9eff;
  }
}

/* ❌ INTERDIT : Supprimer le focus */
*:focus {
  outline: none; /* ❌ JAMAIS */
}

/* ✅ Alternative : Focus visible même si outline supprimé */
button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 95, 204, 0.5); /* ✅ Alternative visible */
}
```

#### Print Stylesheets

**Recommandé** : Styles optimisés pour l'impression

```css
@media print {
  /* Masquer les éléments non essentiels */
  nav,
  .sidebar,
  .no-print {
    display: none;
  }

  /* Optimiser les couleurs pour l'impression */
  * {
    background: white !important;
    color: black !important;
  }

  /* Liens visibles */
  a[href]::after {
    content: " (" attr(href) ")";
    font-size: 0.8em;
    color: #666;
  }

  /* Éviter les coupures dans les éléments */
  h1,
  h2,
  h3 {
    page-break-after: avoid;
  }

  p {
    orphans: 3;
    widows: 3;
  }
}
```

---

### 4.3 JavaScript

#### Dégradation Gracieuse (Progressive Enhancement)

**Principe** : Le contenu doit être accessible même si JavaScript est désactivé

```html
<!-- ✅ BON : Contenu accessible sans JS -->
<noscript>
  <p>
    JavaScript est désactivé.
    <a href="/contact-simple">Utilisez notre formulaire de contact simple</a>.
  </p>
</noscript>

<!-- ✅ BON : Formulaire fonctionnel sans JS -->
<form action="/submit" method="POST">
  <label for="email">Email</label>
  <input type="email" id="email" name="email" required />
  <button type="submit">Envoyer</button>
</form>

<!-- Amélioration progressive avec JS -->
<script>
  // Amélioration : validation en temps réel
  document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    // Validation AJAX
  });
</script>
```

#### Pas de Dépendance JavaScript pour Fonctionnalités Critiques

**Règle** : Les fonctionnalités essentielles doivent fonctionner sans JavaScript

```html
<!-- ❌ MAUVAIS : Navigation dépendante de JS -->
<div id="menu" onclick="toggleMenu()">Menu</div>

<!-- ✅ BON : Navigation fonctionnelle sans JS -->
<nav>
  <ul>
    <li><a href="/">Accueil</a></li>
    <li><a href="/services">Services</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
</nav>

<!-- Amélioration : Menu hamburger avec JS -->
<script>
  // Amélioration progressive : menu hamburger mobile
  if (window.innerWidth < 768) {
    // Ajouter fonctionnalité menu hamburger
  }
</script>
```

#### Gestion d'Erreurs Accessible

**Obligatoire** : Les erreurs doivent être annoncées de manière accessible

```javascript
// ✅ BON : Erreur annoncée avec ARIA
function handleError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.setAttribute("role", "alert");
  errorDiv.setAttribute("aria-live", "assertive");
  errorDiv.className = "error-message";
  errorDiv.textContent = message;

  // Insérer au début du formulaire pour être visible
  const form = document.querySelector("form");
  form.insertBefore(errorDiv, form.firstChild);

  // Focus sur le message d'erreur
  errorDiv.focus();

  // Annoncer aux lecteurs d'écran
  errorDiv.setAttribute("tabindex", "-1");
}

// ✅ BON : Validation avec messages accessibles
function validateForm() {
  const email = document.getElementById("email");
  const emailError = document.getElementById("email-error");

  if (!isValidEmail(email.value)) {
    email.setAttribute("aria-invalid", "true");
    email.setAttribute("aria-describedby", "email-error");
    emailError.textContent = "Format d'email invalide";
    emailError.setAttribute("role", "alert");
    email.focus();
    return false;
  }

  email.setAttribute("aria-invalid", "false");
  email.removeAttribute("aria-describedby");
  emailError.textContent = "";
  return true;
}
```

#### Notifications Accessibles

**Obligatoire** : Les notifications doivent être annoncées aux technologies d'assistance

```javascript
// ✅ BON : Notification accessible
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.setAttribute("role", type === "error" ? "alert" : "status");
  notification.setAttribute(
    "aria-live",
    type === "error" ? "assertive" : "polite",
  );
  notification.setAttribute("aria-atomic", "true");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Focus optionnel pour les erreurs critiques
  if (type === "error") {
    notification.setAttribute("tabindex", "-1");
    notification.focus();
  }

  // Retirer après 5 secondes
  setTimeout(() => {
    notification.remove();
  }, 5000);
}

// Utilisation
showNotification("Article ajouté au panier", "success");
showNotification("Erreur de connexion", "error");
```

#### Gestion du Focus Dynamique

**Obligatoire** : Gérer le focus lors des changements dynamiques (modales, navigation SPA)

```javascript
// ✅ BON : Gestion du focus dans une modale
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  const previousFocus = document.activeElement;

  // Afficher la modale
  modal.hidden = false;
  modal.setAttribute("aria-modal", "true");

  // Focus sur le premier élément focusable
  const firstFocusable = modal.querySelector(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );
  if (firstFocusable) {
    firstFocusable.focus();
  }

  // Stocker pour restaurer à la fermeture
  modal.dataset.previousFocus = previousFocus.id || previousFocus.className;

  // Piéger le focus dans la modale
  trapFocus(modal);
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.hidden = true;
  modal.setAttribute("aria-modal", "false");

  // Restaurer le focus
  const previousFocusId = modal.dataset.previousFocus;
  if (previousFocusId) {
    const previousFocus =
      document.getElementById(previousFocusId) ||
      document.querySelector(`.${previousFocusId}`);
    if (previousFocus) {
      previousFocus.focus();
    }
  }
}

// Piéger le focus dans la modale
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  container.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }

    if (e.key === "Escape") {
      closeModal(container.id);
    }
  });
}
```

#### Navigation SPA Accessible

Pour les Single Page Applications (React, Vue, Angular) :

```javascript
// ✅ BON : Annoncer les changements de page
function navigateToPage(url) {
  // Charger le nouveau contenu
  loadPageContent(url);

  // Annoncer le changement
  const announcement = document.createElement("div");
  announcement.setAttribute("role", "status");
  announcement.setAttribute("aria-live", "polite");
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = `Page chargée : ${getPageTitle(url)}`;

  document.body.appendChild(announcement);

  // Focus sur le contenu principal
  const main = document.querySelector("main");
  if (main) {
    main.setAttribute("tabindex", "-1");
    main.focus();
  }

  // Retirer l'annonce après annonce
  setTimeout(() => {
    announcement.remove();
  }, 1000);

  // Mettre à jour l'URL et le titre
  window.history.pushState({}, getPageTitle(url), url);
  document.title = getPageTitle(url);
}
```

---

## 5. Tests et Validation

### 5.1 Outils Automatiques

#### WAVE (Web Accessibility Evaluation Tool)

**Description** : Extension navigateur et outil en ligne pour évaluer l'accessibilité

- **URL** : https://wave.webaim.org/
- **Extension Chrome/Firefox** : WAVE Evaluation Tool
- **Fonctionnalités** :
  - Détection d'erreurs et avertissements
  - Vérification des contrastes
  - Identification des éléments ARIA
  - Structure de la page

**Utilisation** :

1. Installer l'extension WAVE
2. Naviguer vers la page à tester
3. Cliquer sur l'icône WAVE
4. Examiner les erreurs (rouge) et avertissements (jaune)
5. Corriger les problèmes identifiés

#### axe DevTools

**Description** : Extension navigateur basée sur les règles axe-core

- **URL** : https://www.deque.com/axe/devtools/
- **Extension Chrome/Firefox** : axe DevTools
- **Fonctionnalités** :
  - Analyse complète WCAG 2.1
  - Détection de problèmes d'accessibilité
  - Suggestions de corrections
  - Tests de contraste

**Utilisation** :

1. Installer l'extension axe DevTools
2. Ouvrir les DevTools (F12)
3. Aller dans l'onglet "axe DevTools"
4. Cliquer sur "Analyze"
5. Examiner les résultats par catégorie

#### Lighthouse (Accessibility Audit)

**Description** : Outil intégré à Chrome DevTools pour audit d'accessibilité

- **Accès** : Chrome DevTools > Lighthouse > Accessibility
- **Fonctionnalités** :
  - Score d'accessibilité (0-100)
  - Liste des problèmes détectés
  - Suggestions d'amélioration
  - Tests WCAG 2.1

**Utilisation** :

1. Ouvrir Chrome DevTools (F12)
2. Aller dans l'onglet "Lighthouse"
3. Sélectionner "Accessibility"
4. Cliquer sur "Generate report"
5. Examiner le score et les recommandations

#### Pa11y

**Description** : Outil en ligne de commande pour tests d'accessibilité automatisés

- **Installation** : `npm install -g pa11y`
- **Utilisation** :

  ```bash
  # Test simple
  pa11y https://example.com

  # Test avec rapport HTML
  pa11y https://example.com --reporter html > report.html

  # Test avec standards WCAG
  pa11y https://example.com --standard WCAG2AA
  ```

**Intégration CI/CD** :

```yaml
# Exemple GitHub Actions
name: Accessibility Tests
on: [push, pull_request]
jobs:
  accessibility:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install Pa11y
        run: npm install -g pa11y
      - name: Run accessibility tests
        run: pa11y https://example.com --standard WCAG2AA
```

#### HTML_CodeSniffer

**Description** : Extension navigateur pour validation HTML et accessibilité

- **URL** : https://squizlabs.github.io/HTML_CodeSniffer/
- **Extension Chrome/Firefox** : HTML_CodeSniffer
- **Fonctionnalités** :
  - Validation WCAG 2.1 (A, AA, AAA)
  - Détection de problèmes HTML
  - Suggestions de corrections

#### asqatasun

**Description** : Plateforme open-source pour audit d'accessibilité automatisé

- **URL** : https://asqatasun.org/
- **Fonctionnalités** :
  - Audit complet RGAA/WCAG
  - Rapports détaillés
  - Suivi de l'évolution
  - API pour intégration

---

### 5.2 Tests Manuels

#### Navigation au Clavier Uniquement

**Test essentiel** : Tester toute l'application uniquement avec le clavier

**Procédure** :

1. Désactiver la souris (ou ne pas l'utiliser)
2. Naviguer avec Tab, Shift+Tab, Enter, Espace, Flèches
3. Vérifier :
   - Tous les éléments interactifs sont accessibles
   - L'ordre de tabulation est logique
   - Le focus est toujours visible
   - Pas de piège au clavier
   - Toutes les fonctionnalités sont utilisables

**Checklist** :

- [ ] Navigation possible sur toutes les pages
- [ ] Ordre de tabulation logique
- [ ] Focus visible sur tous les éléments
- [ ] Menus déroulants accessibles au clavier
- [ ] Formulaires complètement utilisables
- [ ] Modales accessibles (focus piégé, fermeture avec Échap)
- [ ] Carrousels/diaporamas contrôlables au clavier

#### Tests avec Lecteurs d'Écran

**Lecteurs d'écran principaux** :

- **NVDA** (Windows, gratuit) : https://www.nvaccess.org/
- **JAWS** (Windows, payant) : https://www.freedomscientific.com/
- **VoiceOver** (macOS/iOS, intégré) : Activation avec Cmd+F5
- **TalkBack** (Android, intégré) : Activation dans Paramètres > Accessibilité
- **Narrator** (Windows, intégré) : Activation avec Win+Ctrl+Entrée

**Procédure de test** :

1. Activer le lecteur d'écran
2. Naviguer sur le site
3. Vérifier :
   - Structure de la page annoncée correctement
   - Liens et boutons identifiés
   - Formulaires navigables et compréhensibles
   - Images avec alternatives textuelles
   - Tableaux avec en-têtes annoncés
   - Changements dynamiques annoncés

**Checklist** :

- [ ] Titre de la page annoncé
- [ ] Structure de navigation claire
- [ ] Liens avec texte descriptif
- [ ] Boutons avec labels compréhensibles
- [ ] Formulaires avec labels associés
- [ ] Messages d'erreur annoncés
- [ ] Images avec alternatives textuelles
- [ ] Tableaux avec en-têtes annoncés
- [ ] Changements de contenu annoncés (aria-live)

#### Tests de Zoom (jusqu'à 200%)

**Procédure** :

1. Zoomer la page à 200% (Ctrl/Cmd +)
2. Vérifier :
   - Contenu toujours lisible
   - Layout ne casse pas
   - Navigation toujours fonctionnelle
   - Pas de contenu coupé ou masqué
   - Scroll horizontal évité si possible

**Checklist** :

- [ ] Texte lisible à 200%
- [ ] Layout adaptatif (responsive)
- [ ] Navigation fonctionnelle
- [ ] Formulaires utilisables
- [ ] Pas de contenu masqué
- [ ] Scroll horizontal minimal

#### Tests de Contraste

**Outils** :

- **WebAIM Contrast Checker** : https://webaim.org/resources/contrastchecker/
- **Colour Contrast Analyser (CCA)** : Application desktop
- **axe DevTools** : Détection automatique

**Procédure** :

1. Identifier toutes les combinaisons de couleurs texte/fond
2. Vérifier le ratio de contraste :
   - Texte normal : minimum 4.5:1 (AA)
   - Texte large : minimum 3:1 (AA)
   - Éléments non textuels : minimum 3:1 (AA)
3. Tester en mode clair et sombre si applicable

**Checklist** :

- [ ] Tous les textes respectent 4.5:1 (AA)
- [ ] Textes larges respectent 3:1 (AA)
- [ ] Boutons et icônes respectent 3:1 (AA)
- [ ] Focus visible avec contraste suffisant
- [ ] États hover/focus avec contraste suffisant

#### Tests avec Différents Navigateurs

**Navigateurs à tester** :

- Chrome (dernière version)
- Firefox (dernière version)
- Safari (macOS/iOS)
- Edge (dernière version)

**Procédure** :

1. Tester sur chaque navigateur
2. Vérifier :
   - Fonctionnalités identiques
   - Styles cohérents
   - Accessibilité maintenue
   - Pas de régression

---

### 5.3 Checklist de Validation

#### Checklist WCAG 2.1 Niveau A (Minimum)

**1.1 Alternatives textuelles** :

- [ ] Toutes les images ont un attribut `alt`
- [ ] Images décoratives ont `alt=""`
- [ ] Images informatives ont un `alt` descriptif
- [ ] Images complexes ont une description longue

**1.2 Médias temporels** :

- [ ] Vidéos avec dialogue ont des sous-titres
- [ ] Contenus audio ont des transcripts
- [ ] Vidéos ont des audio-descriptions si nécessaire

**1.3 Adaptable** :

- [ ] Structure HTML sémantique
- [ ] Hiérarchie des titres logique
- [ ] Pas d'information véhiculée uniquement par la présentation

**1.4 Distinguable** :

- [ ] Contraste minimum 3:1 pour texte large
- [ ] Information non véhiculée uniquement par la couleur
- [ ] Pas de contenu clignotant (> 3 fois/seconde)

**2.1 Accessible au clavier** :

- [ ] Toutes les fonctionnalités accessibles au clavier
- [ ] Pas de piège au clavier
- [ ] Raccourcis clavier documentés

**2.4 Navigable** :

- [ ] Plusieurs moyens de navigation
- [ ] Titres de pages descriptifs
- [ ] Ordre de focus logique

**3.1 Lisible** :

- [ ] Langue de la page déclarée (`lang`)
- [ ] Changements de langue identifiés

**3.2 Prévisible** :

- [ ] Changements de contexte sur focus explicites
- [ ] Changements de contexte sur saisie explicites

**4.1 Compatible** :

- [ ] HTML valide
- [ ] Noms, rôles, valeurs accessibles

#### Checklist WCAG 2.1 Niveau AA (Recommandé)

**Tous les critères Niveau A +** :

**1.4 Distinguable** :

- [ ] Contraste 4.5:1 pour texte normal
- [ ] Contraste 3:1 pour texte large
- [ ] Texte redimensionnable jusqu'à 200% sans perte de fonctionnalité

**2.4 Navigable** :

- [ ] Plusieurs moyens de localiser une page
- [ ] En-têtes et labels descriptifs
- [ ] Focus visible

**2.5 Modalités d'entrée** :

- [ ] Zones cibles au moins 44x44px
- [ ] Pas de gestes complexes requis

**3.2 Prévisible** :

- [ ] Changements de contexte sur focus explicites
- [ ] Changements de contexte sur saisie explicites

**3.3 Assistance à la saisie** :

- [ ] Identification des erreurs
- [ ] Labels ou instructions
- [ ] Suggestions d'erreurs
- [ ] Prévention d'erreurs

**4.1 Compatible** :

- [ ] Statut des composants annoncé

#### Checklist WCAG 2.1 Niveau AAA (Optimal)

**Tous les critères Niveau AA +** :

**1.4 Distinguable** :

- [ ] Contraste 7:1 pour texte normal
- [ ] Contraste 4.5:1 pour texte large
- [ ] Pas d'images de texte (sauf logo)

**2.4 Navigable** :

- [ ] Pas de délais
- [ ] Interruptions pouvant être reportées
- [ ] Ré-authentification sans perte de données

**3.1 Lisible** :

- [ ] Langue des passages identifiée
- [ ] Mots inhabituels expliqués
- [ ] Abréviations expliquées

**3.2 Prévisible** :

- [ ] Changements de contexte uniquement sur demande

**3.3 Assistance à la saisie** :

- [ ] Aide contextuelle
- [ ] Prévention d'erreurs
- [ ] Suggestions d'erreurs

#### Checklist RGAA (Référentiel Général d'Amélioration de l'Accessibilité)

**Basé sur WCAG 2.1 Niveau AA** avec spécificités françaises :

- [ ] Déclaration d'accessibilité présente
- [ ] Schéma d'organisation des pages cohérent
- [ ] Navigation cohérente
- [ ] Plan du site présent
- [ ] Moteur de recherche présent
- [ ] Liens d'évitement présents
- [ ] Langue de chaque page déclarée
- [ ] Structure de document valide
- [ ] Attributs d'identification présents
- [ ] Alternatives textuelles pour images
- [ ] Contraste suffisant
- [ ] Information non véhiculée uniquement par la couleur
- [ ] Contenu clignotant évité
- [ ] Texte redimensionnable
- [ ] Navigation au clavier complète
- [ ] Délais extensibles
- [ ] Contenu auto-actualisé contrôlable
- [ ] Titres de pages descriptifs
- [ ] Structure de titres logique
- [ ] Labels de formulaires présents
- [ ] Messages d'erreur associés aux champs
- [ ] Langue des passages identifiée

---

## 6. Spécificités par Type de Projet

### 6.1 Applications Web

#### SPA (Single Page Applications)

**Problèmes spécifiques** :

- Changements de contenu non annoncés
- Perte de focus lors de la navigation
- URL non mises à jour
- Titre de page non mis à jour

**Solutions** :

```javascript
// Annoncer les changements de page
function navigateToPage(url) {
  // Charger le contenu
  loadPageContent(url);

  // Annoncer le changement
  announcePageChange(getPageTitle(url));

  // Focus sur le contenu principal
  focusMainContent();

  // Mettre à jour l'URL et le titre
  updateURLAndTitle(url);
}

function announcePageChange(title) {
  const announcement = document.createElement("div");
  announcement.setAttribute("role", "status");
  announcement.setAttribute("aria-live", "polite");
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = `Page chargée : ${title}`;

  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
}

function focusMainContent() {
  const main = document.querySelector("main");
  if (main) {
    main.setAttribute("tabindex", "-1");
    main.focus();
  }
}
```

#### Applications React/Vue/Angular

**Bonnes pratiques** :

- Utiliser des composants accessibles
- Gérer le focus lors des changements d'état
- Utiliser les hooks/utilitaires d'accessibilité
- Tester avec les lecteurs d'écran

**Exemple React** :

```jsx
import { useEffect, useRef } from "react";

function AccessibleModal({ isOpen, onClose, children }) {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Sauvegarder le focus précédent
      previousFocusRef.current = document.activeElement;

      // Focus sur la modale
      const firstFocusable = modalRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      firstFocusable?.focus();
    } else {
      // Restaurer le focus
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <h2 id="modal-title">Titre de la modale</h2>
      {children}
      <button onClick={onClose}>Fermer</button>
    </div>
  );
}
```

#### Routing Accessible

**Règles** :

- Mettre à jour le titre de page
- Mettre à jour l'URL
- Annoncer les changements
- Gérer le focus

---

### 6.2 Sites E-commerce

#### Processus de Commande Accessible

**Checklist** :

- [ ] Navigation clavier complète
- [ ] Formulaires accessibles (adresse, paiement)
- [ ] Panier accessible et modifiable
- [ ] Confirmation de commande claire
- [ ] Messages d'erreur descriptifs

**Exemple : Panier accessible** :

```html
<div role="region" aria-labelledby="cart-title">
  <h2 id="cart-title">Votre panier</h2>

  <table role="table" aria-label="Articles dans le panier">
    <thead>
      <tr>
        <th scope="col">Article</th>
        <th scope="col">Quantité</th>
        <th scope="col">Prix</th>
        <th scope="col">Total</th>
        <th scope="col">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <img src="product.jpg" alt="Nom du produit" />
          <span>Nom du produit</span>
        </td>
        <td>
          <label for="qty-1" class="sr-only">Quantité</label>
          <input type="number" id="qty-1" min="1" value="1" />
        </td>
        <td>50,00 €</td>
        <td>50,00 €</td>
        <td>
          <button aria-label="Retirer du panier">Supprimer</button>
        </td>
      </tr>
    </tbody>
  </table>

  <div role="status" aria-live="polite" id="cart-update">
    <!-- Messages de mise à jour -->
  </div>
</div>
```

#### Formulaires de Paiement Accessibles

**Règles** :

- Labels clairs pour tous les champs
- Instructions de format (numéro de carte, CVV)
- Validation en temps réel accessible
- Messages d'erreur descriptifs
- Sécurité visible (HTTPS, badges)

---

### 6.3 Applications Mobiles

#### Touch Targets (44x44px Minimum)

**Règles** :

- Zones cliquables minimum 44x44px
- Espacement suffisant entre les éléments
- Pas d'éléments trop proches

```css
/* ✅ BON : Touch targets suffisants */
button,
a.button,
.icon-button {
  min-width: 44px;
  min-height: 44px;
  padding: 0.75rem;
}

/* Espacement entre éléments */
.touch-elements {
  gap: 8px; /* Minimum 8px */
}
```

#### Gestes Alternatifs

**Règle** : Fournir des alternatives aux gestes complexes

- Swipe → Boutons de navigation
- Pinch-to-zoom → Boutons zoom +/-
- Rotation → Bouton de rotation

#### Orientation d'Écran Flexible

**Règle** : Le contenu doit fonctionner en portrait et paysage

```css
@media (orientation: portrait) {
  .layout {
    flex-direction: column;
  }
}

@media (orientation: landscape) {
  .layout {
    flex-direction: row;
  }
}
```

#### VoiceOver/TalkBack Compatible

**Tests obligatoires** :

- Navigation complète avec lecteur d'écran
- Labels accessibles
- États annoncés
- Actions accessibles

---

### 6.4 Documents PDF

#### Structure Sémantique

**Règles** :

- Utiliser les balises de structure (titres, paragraphes, listes)
- Ordre de lecture logique
- Tableaux avec en-têtes
- Images avec alternatives textuelles

#### Balisage de Titres

**Règle** : Utiliser les styles de titre (Titre 1, Titre 2, etc.) pour créer une hiérarchie

#### Textes Alternatifs Images

**Règle** : Ajouter des alternatives textuelles à toutes les images

#### Ordre de Lecture Logique

**Règle** : Vérifier l'ordre de lecture avec les outils d'accessibilité PDF

**Outils** :

- Adobe Acrobat Pro : Outils d'accessibilité
- PAC (PDF Accessibility Checker)
- axe PDF

---

## 7. Performance et Accessibilité

### 7.1 Temps de Chargement Acceptable

**Règles** :

- Contenu critique visible rapidement (< 3 secondes)
- Indicateurs de chargement accessibles
- Pas de timeout strict

### 7.2 Contenu Critique Visible Rapidement

**Techniques** :

- Critical CSS inline
- Lazy loading pour images non critiques
- Progressive enhancement

### 7.3 Lazy Loading avec Alternatives

**Règle** : Si le contenu est chargé en lazy, fournir une alternative accessible

```html
<!-- ✅ BON : Lazy loading avec alternative -->
<img
  src="placeholder.jpg"
  data-src="image.jpg"
  alt="Description de l'image"
  loading="lazy"
/>

<noscript>
  <img src="image.jpg" alt="Description de l'image" />
</noscript>
```

### 7.4 Indicateurs de Chargement Accessibles

**Règle** : Les indicateurs de chargement doivent être annoncés

```html
<div role="status" aria-live="polite" aria-busy="true" id="loading">
  <span class="sr-only">Chargement en cours</span>
  <span aria-hidden="true">⏳</span>
</div>

<script>
  // Mettre à jour le statut
  document.getElementById("loading").setAttribute("aria-busy", "false");
  document.getElementById("loading").textContent = "Chargement terminé";
</script>
```

---

## 8. Conformité Légale

### 8.1 RGAA (France)

**Référentiel Général d'Amélioration de l'Accessibilité**

**Obligatoire pour** :

- Services publics (État, collectivités, établissements publics)
- Organismes délégataires d'une mission de service public
- Entreprises privées avec CA > 250M€ (depuis 2021)

**Niveau requis** : **WCAG 2.1 Niveau AA**

**Sanctions** : Amende jusqu'à 25 000 € par an et par site

**Déclaration d'accessibilité** : Obligatoire sur chaque site

**Référence** : https://www.numerique.gouv.fr/publications/rgaa-accessibilite/

### 8.2 Section 508 (États-Unis)

**Obligatoire pour** : Agences fédérales américaines

**Standards** : Basé sur WCAG 2.1 Niveau AA

**Référence** : https://www.section508.gov/

### 8.3 EN 301 549 (Europe)

**Standard européen harmonisé** pour l'accessibilité des TIC

**Référence** : https://www.etsi.org/deliver/etsi_en/301500_301599/301549/

### 8.4 ADA (Americans with Disabilities Act)

**Obligatoire pour** : Entreprises privées aux États-Unis

**Application** : Sites web considérés comme "places of public accommodation"

**Référence** : https://www.ada.gov/

---

## 9. Ressources et Références

### 9.1 Standards Officiels

- **WCAG 2.1** : https://www.w3.org/WAI/WCAG21/quickref/
- **RGAA 4.1** : https://www.numerique.gouv.fr/publications/rgaa-accessibilite/
- **ARIA 1.1** : https://www.w3.org/TR/wai-aria-1.1/
- **HTML5 Accessibility** : https://www.html5accessibility.com/

### 9.2 Outils de Test

- **WAVE** : https://wave.webaim.org/
- **axe DevTools** : https://www.deque.com/axe/devtools/
- **Lighthouse** : Intégré à Chrome DevTools
- **Pa11y** : https://pa11y.org/
- **asqatasun** : https://asqatasun.org/
- **WebAIM Contrast Checker** : https://webaim.org/resources/contrastchecker/

### 9.3 Guides et Tutoriels

- **WebAIM** : https://webaim.org/
- **A11y Project** : https://www.a11yproject.com/
- **MDN Accessibility** : https://developer.mozilla.org/fr/docs/Web/Accessibility
- **W3C WAI** : https://www.w3.org/WAI/

### 9.4 Communautés et Formations

- **A11y Slack** : Communauté Slack sur l'accessibilité
- **A11y Meetups** : Rencontres locales
- **Formations RGAA** : https://www.numerique.gouv.fr/

### 9.5 Lecteurs d'Écran

- **NVDA** (Windows, gratuit) : https://www.nvaccess.org/
- **JAWS** (Windows, payant) : https://www.freedomscientific.com/
- **VoiceOver** (macOS/iOS, intégré)
- **TalkBack** (Android, intégré)
- **Narrator** (Windows, intégré)

---

## 10. Checklist Rapide par Projet

### 10.1 Checklist Avant Mise en Production

**Structure et Navigation** :

- [ ] Doctype HTML5 présent
- [ ] Langue déclarée (`lang="fr"`)
- [ ] Charset UTF-8 déclaré
- [ ] Un seul `<h1>` par page
- [ ] Hiérarchie des titres logique
- [ ] Navigation clavier complète
- [ ] Focus visible sur tous les éléments
- [ ] Skip links présents

**Images et Médias** :

- [ ] Toutes les images ont un `alt`
- [ ] Images décoratives ont `alt=""`
- [ ] Vidéos ont des sous-titres
- [ ] Contenus audio ont des transcripts

**Couleurs et Contraste** :

- [ ] Contraste 4.5:1 pour texte normal (AA)
- [ ] Contraste 3:1 pour texte large (AA)
- [ ] Information non véhiculée uniquement par la couleur
- [ ] Focus visible avec contraste suffisant

**Formulaires** :

- [ ] Tous les champs ont des labels
- [ ] Messages d'erreur descriptifs
- [ ] Champs obligatoires identifiés
- [ ] Validation accessible

**ARIA** :

- [ ] Rôles ARIA appropriés
- [ ] États ARIA mis à jour dynamiquement
- [ ] Live regions pour changements dynamiques
- [ ] Landmarks ARIA présents

**Tests** :

- [ ] Navigation clavier testée
- [ ] Lecteur d'écran testé (au moins un)
- [ ] Zoom 200% testé
- [ ] Contraste vérifié
- [ ] Validation HTML effectuée
- [ ] Outil automatique utilisé (WAVE, axe, Lighthouse)

**Performance** :

- [ ] Temps de chargement acceptable
- [ ] Indicateurs de chargement accessibles
- [ ] Lazy loading avec alternatives

**Conformité** :

- [ ] Déclaration d'accessibilité présente (si applicable)
- [ ] Niveau WCAG 2.1 AA atteint
- [ ] Conformité légale vérifiée (RGAA, Section 508, etc.)

### 10.2 Points Critiques à Vérifier

**Priorité 1 (Bloquants)** :

- Navigation clavier complète
- Alternatives textuelles pour images
- Contraste suffisant
- Labels de formulaires
- Focus visible

**Priorité 2 (Importants)** :

- Sous-titres vidéo
- Messages d'erreur accessibles
- États ARIA
- Structure sémantique

**Priorité 3 (Améliorations)** :

- Niveau AAA (si applicable)
- Audio-description
- Transcripts détaillés

### 10.3 Tests Essentiels

**Minimum à effectuer** :

1. **Navigation clavier** : Tester toute l'application au clavier
2. **Lecteur d'écran** : Tester avec au moins un lecteur d'écran (NVDA ou VoiceOver)
3. **Zoom 200%** : Vérifier que le contenu reste utilisable
4. **Outil automatique** : Utiliser WAVE, axe, ou Lighthouse
5. **Validation HTML** : Valider avec le validateur W3C

**Tests complémentaires recommandés** :

- Tests avec plusieurs navigateurs
- Tests sur mobile (VoiceOver/TalkBack)
- Tests avec différents niveaux de zoom
- Tests de contraste détaillés
- Tests avec différents lecteurs d'écran

---

## 11. Classes CSS Utiles et Réutilisables

### 11.1 Classes d'Accessibilité Essentielles

**Classe `.sr-only` (Screen Reader Only)** :

```css
/* Masquer visuellement mais garder accessible aux lecteurs d'écran */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Utilisation */
<button>
  <span aria-hidden="true">×</span>
  <span class="sr-only">Fermer la modale</span>
</button>
```

**Classe `.skip-link` (Liens d'Évitement)** :

```css
/* Liens pour sauter au contenu principal */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px 16px;
  text-decoration: none;
  z-index: 100;
  border-radius: 0 0 4px 0;
}

.skip-link:focus {
  top: 0;
  outline: 3px solid #fff;
  outline-offset: -3px;
}
```

**Classe `.focus-visible` (Focus Amélioré)** :

```css
/* Focus visible uniquement au clavier (pas à la souris) */
.focus-visible:focus-visible {
  outline: 3px solid #005fcc;
  outline-offset: 3px;
  box-shadow: 0 0 0 3px rgba(0, 95, 204, 0.3);
}

/* Fallback pour navigateurs sans support */
.focus-visible:focus {
  outline: 3px solid #005fcc;
  outline-offset: 3px;
}
```

**Classe `.error-message` (Messages d'Erreur)** :

```css
.error-message {
  color: #d32f2f;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.error-message::before {
  content: "⚠";
  font-size: 1rem;
  aria-hidden: true;
}

.error-message[role="alert"] {
  font-weight: 600;
}
```

**Classe `.required` (Champs Obligatoires)** :

```css
.required {
  color: #d32f2f;
  font-weight: bold;
  margin-left: 0.25rem;
}

.required::after {
  content: "*";
}
```

**Classe `.field-hint` (Instructions de Champ)** :

```css
.field-hint {
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.25rem;
  display: block;
}
```

### 11.2 Classes pour États ARIA

```css
/* Élément avec erreur */
[aria-invalid="true"] {
  border: 2px solid #d32f2f;
  outline: 2px solid #d32f2f;
  outline-offset: 2px;
}

/* Élément désactivé */
[aria-disabled="true"],
[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

/* Élément expansé */
[aria-expanded="true"]::after {
  content: "▼";
  margin-left: 0.5rem;
}

[aria-expanded="false"]::after {
  content: "▶";
  margin-left: 0.5rem;
}

/* Élément sélectionné */
[aria-selected="true"] {
  background-color: #e6f2ff;
  border: 2px solid #005fcc;
}
```

### 11.3 Classes pour Animations Réduites

```css
/* Respecter prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Classe utilitaire pour désactiver animations */
.no-animations * {
  animation: none !important;
  transition: none !important;
}
```

---

## 12. Erreurs Courantes à Éviter

### 12.1 Erreurs HTML

**❌ Supprimer le focus** :

```css
/* ❌ MAUVAIS */
*:focus {
  outline: none;
}
```

**✅ Solution** : Toujours garder un indicateur de focus visible

**❌ Utiliser des divs pour les boutons** :

```html
<!-- ❌ MAUVAIS -->
<div onclick="submit()">Envoyer</div>

<!-- ✅ BON -->
<button type="submit">Envoyer</button>
```

**❌ Oublier les labels de formulaires** :

```html
<!-- ❌ MAUVAIS -->
<input type="text" name="email" />

<!-- ✅ BON -->
<label for="email">Email</label>
<input type="email" id="email" name="email" />
```

**❌ Utiliser des tableaux pour la mise en page** :

```html
<!-- ❌ MAUVAIS -->
<table>
  <tr>
    <td>Colonne gauche</td>
    <td>Colonne droite</td>
  </tr>
</table>

<!-- ✅ BON -->
<div class="grid">
  <aside>Colonne gauche</aside>
  <main>Colonne droite</main>
</div>
```

### 12.2 Erreurs CSS

**❌ Unités absolues partout** :

```css
/* ❌ MAUVAIS */
h1 {
  font-size: 32px;
}
p {
  font-size: 16px;
}

/* ✅ BON */
h1 {
  font-size: 2rem;
}
p {
  font-size: 1rem;
}
```

**❌ Contraste insuffisant** :

```css
/* ❌ MAUVAIS : Contraste 2.5:1 */
.text {
  color: #999;
  background: #fff;
}

/* ✅ BON : Contraste 4.5:1 */
.text {
  color: #333;
  background: #fff;
}
```

**❌ Focus invisible** :

```css
/* ❌ MAUVAIS */
button:focus {
  outline: none;
}

/* ✅ BON */
button:focus {
  outline: 3px solid #005fcc;
  outline-offset: 3px;
}
```

### 12.3 Erreurs JavaScript

**❌ Piège au clavier** :

```javascript
// ❌ MAUVAIS
modal.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    e.preventDefault(); // Bloque la navigation
  }
});
```

**✅ Solution** : Implémenter un piège de focus correct (voir section 4.3)

**❌ Oublier de gérer le focus** :

```javascript
// ❌ MAUVAIS
function openModal() {
  modal.style.display = "block";
  // Pas de gestion du focus
}
```

**✅ Solution** : Toujours gérer le focus lors des changements dynamiques

**❌ Messages d'erreur non accessibles** :

```javascript
// ❌ MAUVAIS
function showError(message) {
  alert(message); // Pas accessible
}
```

**✅ Solution** : Utiliser des éléments avec `role="alert"` et `aria-live`

### 12.4 Erreurs ARIA

**❌ Redondance avec HTML sémantique** :

```html
<!-- ❌ MAUVAIS -->
<button role="button">Cliquer</button>

<!-- ✅ BON -->
<button>Cliquer</button>
```

**❌ Oublier de mettre à jour les états** :

```javascript
// ❌ MAUVAIS
button.addEventListener("click", () => {
  menu.classList.toggle("open");
  // Oubli de mettre à jour aria-expanded
});
```

**✅ Solution** : Toujours mettre à jour les attributs ARIA

**❌ Utiliser aria-hidden sur éléments interactifs** :

```html
<!-- ❌ MAUVAIS -->
<button aria-hidden="true">Action</button>

<!-- ✅ BON -->
<button>
  <span aria-hidden="true">×</span>
  <span class="sr-only">Fermer</span>
</button>
```

---

## 13. Glossaire des Termes Techniques

### 13.1 Termes WCAG

- **WCAG** : Web Content Accessibility Guidelines — Guidelines d'accessibilité du contenu web
- **POUR** : Perceptible, Utilisable, Compréhensible, Robuste — Les 4 principes WCAG
- **Niveau A** : Conformité minimale WCAG
- **Niveau AA** : Conformité standard WCAG (recommandé)
- **Niveau AAA** : Conformité maximale WCAG (optimal)

### 13.2 Termes ARIA

- **ARIA** : Accessible Rich Internet Applications — Spécification pour rendre les applications web accessibles
- **Role** : Attribut ARIA définissant le type d'élément
- **Live Region** : Zone de contenu qui annonce les changements dynamiques
- **Landmark** : Région sémantique de la page (banner, navigation, main, etc.)

### 13.3 Termes Techniques

- **Lecteur d'écran** : Logiciel qui lit le contenu à voix haute pour les utilisateurs malvoyants
- **Focus** : Indicateur visuel de l'élément actuellement sélectionné au clavier
- **Skip Link** : Lien permettant de sauter directement au contenu principal
- **Alternative textuelle** : Texte descriptif pour les images et médias
- **Contraste** : Différence de luminosité entre le texte et le fond
- **Ratio de contraste** : Mesure numérique du contraste (ex: 4.5:1)

### 13.4 Termes Légaux

- **RGAA** : Référentiel Général d'Amélioration de l'Accessibilité (France)
- **Section 508** : Loi américaine sur l'accessibilité des technologies
- **ADA** : Americans with Disabilities Act — Loi américaine sur les droits des personnes handicapées
- **EN 301 549** : Standard européen pour l'accessibilité des TIC

---

## 14. Exemples de Code Réutilisables

### 14.1 Composant Modal Accessible

```html
<div
  id="modal"
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
  hidden
>
  <div class="modal-overlay" aria-hidden="true"></div>
  <div class="modal-content">
    <h2 id="modal-title">Titre de la modale</h2>
    <p id="modal-description">Description de la modale</p>
    <div class="modal-body">
      <!-- Contenu -->
    </div>
    <button class="modal-close" aria-label="Fermer la modale">×</button>
  </div>
</div>
```

```javascript
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  const previousFocus = document.activeElement;

  modal.hidden = false;
  modal.setAttribute("aria-modal", "true");
  document.body.style.overflow = "hidden";

  const firstFocusable = modal.querySelector(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );
  firstFocusable?.focus();

  modal.dataset.previousFocus = previousFocus.id;
  trapFocus(modal);
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.hidden = true;
  modal.setAttribute("aria-modal", "false");
  document.body.style.overflow = "";

  const previousFocusId = modal.dataset.previousFocus;
  if (previousFocusId) {
    document.getElementById(previousFocusId)?.focus();
  }
}
```

### 14.2 Composant Accordéon Accessible

```html
<div class="accordion">
  <button
    class="accordion-trigger"
    aria-expanded="false"
    aria-controls="panel-1"
    id="trigger-1"
  >
    Titre de la section
    <span aria-hidden="true">▼</span>
  </button>
  <div
    id="panel-1"
    class="accordion-panel"
    role="region"
    aria-labelledby="trigger-1"
    hidden
  >
    <p>Contenu de la section</p>
  </div>
</div>
```

```javascript
document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const isExpanded = trigger.getAttribute("aria-expanded") === "true";
    const panel = document.getElementById(
      trigger.getAttribute("aria-controls"),
    );

    trigger.setAttribute("aria-expanded", !isExpanded);
    panel.hidden = isExpanded;
  });
});
```

### 14.3 Composant Carrousel Accessible

```html
<div class="carousel" role="region" aria-label="Diaporama de produits">
  <div class="carousel-controls">
    <button aria-label="Image précédente" id="prev-btn">‹</button>
    <button aria-label="Pause" id="pause-btn">⏸</button>
    <button aria-label="Lecture" id="play-btn" hidden>▶</button>
    <button aria-label="Image suivante" id="next-btn">›</button>
  </div>

  <div class="carousel-content" aria-live="polite">
    <div class="carousel-slide" aria-label="Image 1 sur 5">
      <img src="image1.jpg" alt="Description image 1" />
    </div>
  </div>

  <div class="carousel-indicators" role="tablist">
    <button role="tab" aria-selected="true" aria-controls="slide-1">1</button>
    <button role="tab" aria-selected="false" aria-controls="slide-2">2</button>
  </div>
</div>
```

### 14.4 Composant Formulaire Accessible

```html
<form novalidate>
  <div class="form-field">
    <label for="email">Email <span class="required">*</span></label>
    <span class="field-hint" id="email-hint">Format : exemple@domaine.com</span>
    <input
      type="email"
      id="email"
      name="email"
      aria-describedby="email-hint email-error"
      aria-invalid="false"
      aria-required="true"
      required
    />
    <span id="email-error" class="error-message" role="alert" hidden></span>
  </div>

  <button type="submit">Envoyer</button>
</form>
```

```javascript
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

document.getElementById("email").addEventListener("blur", (e) => {
  const email = e.target;
  const error = document.getElementById("email-error");

  if (!validateEmail(email.value)) {
    email.setAttribute("aria-invalid", "true");
    error.textContent = "Format d'email invalide";
    error.hidden = false;
  } else {
    email.setAttribute("aria-invalid", "false");
    error.hidden = true;
  }
});
```

---

## Conclusion

Ce guide de référence couvre l'ensemble des aspects d'accessibilité web que tous les projets doivent respecter, conformément aux standards WCAG 2.1, ARIA, et aux exigences légales (RGAA, Section 508, etc.).

**Objectif pour tous les projets** : **Niveau WCAG 2.1 AA minimum**

**Rappel important** : L'accessibilité n'est pas une option, c'est une obligation légale et une nécessité éthique pour permettre à tous les utilisateurs d'accéder aux services numériques.

**Pour aller plus loin** :

- Consulter les ressources officielles (W3C WAI, RGAA)
- Tester régulièrement avec des outils automatiques et manuels
- Former l'équipe aux bonnes pratiques d'accessibilité
- Intégrer l'accessibilité dès la conception (design inclusif)

---

**Document créé le** : Janvier 2025  
**Version** : latest  
**Statut** : Guide universel pour tous les projets

---

**✅ DOCUMENT COMPLET — Toutes les sections ont été ajoutées**
