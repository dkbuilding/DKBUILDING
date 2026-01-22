# Police Foundation Sans - Guide d'utilisation

## Vue d'ensemble

La police **Foundation Sans** a été intégrée au projet DK BUILDING comme police principale. Cette police professionnelle et moderne est parfaitement adaptée aux besoins de l'entreprise de charpente, bardage et couverture.

## Fichiers de police disponibles

Les fichiers suivants ont été copiés dans `/public/fonts/` :

- `Fontspring-DEMO-FoundationSans-Roman.otf` - Poids normal (400)
- `Fontspring-DEMO-FoundationSans-Light.otf` - Poids léger (300)
- `Fontspring-DEMO-FoundationSans-Bold.otf` - Poids gras (700)
- `Fontspring-DEMO-FoundationSans-BlackEx.otf` - Poids extra-gras (900)

## Classes CSS disponibles

### Classes de base

- `.font-foundation` - Police Foundation Sans avec poids normal
- `.font-foundation-light` - Police Foundation Sans avec poids léger (300)
- `.font-foundation-bold` - Police Foundation Sans avec poids gras (700)
- `.font-foundation-black` - Police Foundation Sans avec poids extra-gras (900)

### Utilisation dans les composants

```jsx
// Titre principal avec Foundation Sans Black
<h1 className="font-foundation-black text-4xl">
  DK BUILDING
</h1>

// Sous-titre avec Foundation Sans Bold
<h2 className="font-foundation-bold text-2xl">
  CHARPENTE BARDAGE COUVERTURE
</h2>

// Texte normal avec Foundation Sans
<p className="font-foundation text-base">
  Votre texte ici...
</p>

// Texte léger avec Foundation Sans Light
<p className="font-foundation-light text-sm">
  Description ou texte secondaire
</p>
```

## Intégration dans Tailwind CSS

La police Foundation Sans est maintenant disponible dans toutes les classes Tailwind existantes. Vous pouvez l'utiliser avec :

```jsx
// Combinaison avec d'autres classes Tailwind
<div className="font-foundation-black text-6xl text-dk-yellow uppercase tracking-wide">
  DK BUILDING
</div>
```

## Performance

- Les polices utilisent `font-display: swap` pour un chargement optimisé
- Les fichiers sont servis localement depuis `/public/fonts/`
- Fallback vers Inter et system-ui en cas de problème de chargement

## Recommandations d'usage

1. **Titres principaux** : Utilisez `.font-foundation-black` pour les titres les plus importants
2. **Sous-titres** : Utilisez `.font-foundation-bold` pour les sous-titres
3. **Texte courant** : Utilisez `.font-foundation` pour le texte normal
4. **Texte secondaire** : Utilisez `.font-foundation-light` pour les descriptions

## Compatibilité

- ✅ Chrome/Edge (toutes versions récentes)
- ✅ Firefox (toutes versions récentes)
- ✅ Safari (toutes versions récentes)
- ✅ Mobile (iOS Safari, Chrome Mobile)

## Maintenance

Pour ajouter de nouvelles variantes de la police Foundation :

1. Copiez le fichier `.otf` dans `/public/fonts/`
2. Ajoutez la déclaration `@font-face` dans `/src/index.css`
3. Créez une classe CSS utilitaire si nécessaire
4. Documentez la nouvelle variante dans ce fichier
