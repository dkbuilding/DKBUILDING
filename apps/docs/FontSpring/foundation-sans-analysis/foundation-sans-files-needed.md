# Foundation Sans - Fichiers nécessaires pour DK BUILDING

## Variantes déjà disponibles dans le projet

✅ **Déjà intégrées** (dans `/Site Web/apps/frontend/public/fonts/`) :

- Foundation Sans BlackEx (.otf, .woff2)
- Foundation Sans Bold (.otf, .woff2)
- Foundation Sans Light (.otf, .woff2)
- Foundation Sans Roman (.otf, .woff2)

## Variantes manquantes à télécharger

### Styles de base

- [ ] **Foundation Sans Ultra Light** (.otf, .woff2)
- [ ] **Foundation Sans Ultra Light Italic** (.otf, .woff2)
- [ ] **Foundation Sans Light Italic** (.otf, .woff2)
- [ ] **Foundation Sans Italic** (.otf, .woff2)
- [ ] **Foundation Sans Bold Italic** (.otf, .woff2)
- [ ] **Foundation Sans Black** (.otf, .woff2)
- [ ] **Foundation Sans Black Italic** (.otf, .woff2)
- [ ] **Foundation Sans Outline** (.otf, .woff2)

### Styles Condensed

- [ ] **Foundation Sans Light Condensed** (.otf, .woff2)
- [ ] **Foundation Sans Light Condensed Italic** (.otf, .woff2)
- [ ] **Foundation Sans Condensed** (.otf, .woff2)
- [ ] **Foundation Sans Condensed Italic** (.otf, .woff2)
- [ ] **Foundation Sans Bold Condensed** (.otf, .woff2)
- [ ] **Foundation Sans Bold Condensed Italic** (.otf, .woff2)
- [ ] **Foundation Sans Black Condensed** (.otf, .woff2)
- [ ] **Foundation Sans Black Condensed Italic** (.otf, .woff2)

### Styles Extended

- [ ] **Foundation Sans Light Extended** (.otf, .woff2)
- [ ] **Foundation Sans Extended** (.otf, .woff2)
- [ ] **Foundation Sans Bold Extended** (.otf, .woff2)
- [ ] **Foundation Sans Black Extended** (.otf, .woff2)
- [ ] **Foundation Sans Outline Extended** (.otf, .woff2)

## Instructions de téléchargement

1. **Accédez à votre compte Fontspring** avec les licences PDF fournies par Dicalou Khamidov
2. **Téléchargez chaque variante** en formats :
   - `.otf` (pour l'affichage local et backup)
   - `.woff2` (pour l'optimisation web)
3. **Organisez les fichiers** dans le dossier `/Site Web/apps/frontend/public/fonts/`

## Mapping des poids CSS

| Variante               | font-weight | font-style | font-stretch |
| ---------------------- | ----------- | ---------- | ------------ |
| Ultra Light            | 100         | normal     | normal       |
| Ultra Light Italic     | 100         | italic     | normal       |
| Light                  | 300         | normal     | normal       |
| Light Italic           | 300         | italic     | normal       |
| Roman                  | 400         | normal     | normal       |
| Italic                 | 400         | italic     | normal       |
| Bold                   | 700         | normal     | normal       |
| Bold Italic            | 700         | italic     | normal       |
| Black                  | 900         | normal     | normal       |
| Black Italic           | 900         | italic     | normal       |
| Outline                | 400         | normal     | normal       |
| Light Condensed        | 300         | normal     | condensed    |
| Light Condensed Italic | 300         | italic     | condensed    |
| Condensed              | 400         | normal     | condensed    |
| Condensed Italic       | 400         | italic     | condensed    |
| Bold Condensed         | 700         | normal     | condensed    |
| Bold Condensed Italic  | 700         | italic     | condensed    |
| Black Condensed        | 900         | normal     | condensed    |
| Black Condensed Italic | 900         | italic     | condensed    |
| Light Extended         | 300         | normal     | expanded     |
| Extended               | 400         | normal     | expanded     |
| Bold Extended          | 700         | normal     | expanded     |
| Black Extended         | 900         | normal     | expanded     |
| Outline Extended       | 400         | normal     | expanded     |

## Classes Tailwind à créer

Une fois les fichiers intégrés, les classes suivantes seront disponibles :

```css
/* Styles de base */
.font-foundation-ultra-light
.font-foundation-light
.font-foundation-roman
.font-foundation-bold
.font-foundation-black
.font-foundation-outline

/* Styles italic */
.font-foundation-ultra-light-italic
.font-foundation-light-italic
.font-foundation-italic
.font-foundation-bold-italic
.font-foundation-black-italic

/* Styles condensed */
.font-foundation-light-condensed
.font-foundation-condensed
.font-foundation-bold-condensed
.font-foundation-black-condensed

/* Styles extended */
.font-foundation-light-extended
.font-foundation-extended
.font-foundation-bold-extended
.font-foundation-black-extended
.font-foundation-outline-extended
```

## Prochaines étapes

1. ✅ Analyser les variantes disponibles sur Fontspring
2. ✅ Créer cette liste de fichiers nécessaires
3. ⏳ Attendre les fichiers de l'utilisateur
4. ⏳ Intégrer les fichiers dans le projet
5. ⏳ Mettre à jour la configuration CSS et Tailwind
6. ⏳ Tester et documenter l'utilisation
