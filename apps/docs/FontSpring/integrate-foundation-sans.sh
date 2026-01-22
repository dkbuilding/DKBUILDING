#!/bin/bash

# Script d'intégration automatique des polices Foundation Sans
# Usage: ./integrate-foundation-sans.sh

set -e

PROJECT_ROOT="/Volumes/Professionnel/CRÉATIVE AÏSSA/Entreprises/DK BUILDING"
FRONTEND_DIR="$PROJECT_ROOT/Site Web/apps/frontend"
FONTS_DIR="$FRONTEND_DIR/public/fonts"
CSS_FILE="$FRONTEND_DIR/src/index.css"
TAILWIND_CONFIG="$FRONTEND_DIR/tailwind.config.js"
BACKUP_DIR="$PROJECT_ROOT/_backup"

echo "🚀 Intégration des polices Foundation Sans dans DK BUILDING"
echo "=========================================================="

# Vérifier que les fichiers de polices existent
echo "📁 Vérification des fichiers de polices..."
if [ ! -d "$FONTS_DIR" ]; then
    echo "❌ Le dossier fonts n'existe pas: $FONTS_DIR"
    exit 1
fi

# Lister les fichiers de polices disponibles
echo "📋 Fichiers de polices disponibles:"
ls -la "$FONTS_DIR" | grep -E "\.(woff2|otf)$" || echo "Aucun fichier de police trouvé"

# Créer un backup des fichiers actuels
echo "💾 Création d'un backup..."
BACKUP_TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_PATH="$BACKUP_DIR/foundation-sans-backup-$BACKUP_TIMESTAMP"
mkdir -p "$BACKUP_PATH"

if [ -f "$CSS_FILE" ]; then
    cp "$CSS_FILE" "$BACKUP_PATH/index.css.backup"
    echo "✅ Backup CSS créé: $BACKUP_PATH/index.css.backup"
fi

if [ -f "$TAILWIND_CONFIG" ]; then
    cp "$TAILWIND_CONFIG" "$BACKUP_PATH/tailwind.config.js.backup"
    echo "✅ Backup Tailwind créé: $BACKUP_PATH/tailwind.config.js.backup"
fi

# Fonction pour vérifier si une variante existe
check_font_variant() {
    local variant="$1"
    local woff2_file="$FONTS_DIR/Fontspring-DEMO-FoundationSans-$variant.woff2"
    local otf_file="$FONTS_DIR/Fontspring-DEMO-FoundationSans-$variant.otf"
    
    if [ -f "$woff2_file" ] && [ -f "$otf_file" ]; then
        echo "✅ $variant"
        return 0
    else
        echo "❌ $variant (fichiers manquants)"
        return 1
    fi
}

# Vérifier toutes les variantes
echo ""
echo "🔍 Vérification des variantes disponibles:"
echo "=========================================="

AVAILABLE_VARIANTS=()
MISSING_VARIANTS=()

# Styles de base
check_font_variant "UltraLight" && AVAILABLE_VARIANTS+=("UltraLight") || MISSING_VARIANTS+=("UltraLight")
check_font_variant "UltraLightItalic" && AVAILABLE_VARIANTS+=("UltraLightItalic") || MISSING_VARIANTS+=("UltraLightItalic")
check_font_variant "Light" && AVAILABLE_VARIANTS+=("Light") || MISSING_VARIANTS+=("Light")
check_font_variant "LightItalic" && AVAILABLE_VARIANTS+=("LightItalic") || MISSING_VARIANTS+=("LightItalic")
check_font_variant "Roman" && AVAILABLE_VARIANTS+=("Roman") || MISSING_VARIANTS+=("Roman")
check_font_variant "Italic" && AVAILABLE_VARIANTS+=("Italic") || MISSING_VARIANTS+=("Italic")
check_font_variant "Bold" && AVAILABLE_VARIANTS+=("Bold") || MISSING_VARIANTS+=("Bold")
check_font_variant "BoldItalic" && AVAILABLE_VARIANTS+=("BoldItalic") || MISSING_VARIANTS+=("BoldItalic")
check_font_variant "Black" && AVAILABLE_VARIANTS+=("Black") || MISSING_VARIANTS+=("Black")
check_font_variant "BlackItalic" && AVAILABLE_VARIANTS+=("BlackItalic") || MISSING_VARIANTS+=("BlackItalic")
check_font_variant "BlackEx" && AVAILABLE_VARIANTS+=("BlackEx") || MISSING_VARIANTS+=("BlackEx")
check_font_variant "Outline" && AVAILABLE_VARIANTS+=("Outline") || MISSING_VARIANTS+=("Outline")

# Styles Condensed
check_font_variant "LightCondensed" && AVAILABLE_VARIANTS+=("LightCondensed") || MISSING_VARIANTS+=("LightCondensed")
check_font_variant "LightCondensedItalic" && AVAILABLE_VARIANTS+=("LightCondensedItalic") || MISSING_VARIANTS+=("LightCondensedItalic")
check_font_variant "Condensed" && AVAILABLE_VARIANTS+=("Condensed") || MISSING_VARIANTS+=("Condensed")
check_font_variant "CondensedItalic" && AVAILABLE_VARIANTS+=("CondensedItalic") || MISSING_VARIANTS+=("CondensedItalic")
check_font_variant "BoldCondensed" && AVAILABLE_VARIANTS+=("BoldCondensed") || MISSING_VARIANTS+=("BoldCondensed")
check_font_variant "BoldCondensedItalic" && AVAILABLE_VARIANTS+=("BoldCondensedItalic") || MISSING_VARIANTS+=("BoldCondensedItalic")
check_font_variant "BlackCondensed" && AVAILABLE_VARIANTS+=("BlackCondensed") || MISSING_VARIANTS+=("BlackCondensed")
check_font_variant "BlackCondensedItalic" && AVAILABLE_VARIANTS+=("BlackCondensedItalic") || MISSING_VARIANTS+=("BlackCondensedItalic")

# Styles Extended
check_font_variant "LightExtended" && AVAILABLE_VARIANTS+=("LightExtended") || MISSING_VARIANTS+=("LightExtended")
check_font_variant "Extended" && AVAILABLE_VARIANTS+=("Extended") || MISSING_VARIANTS+=("Extended")
check_font_variant "BoldExtended" && AVAILABLE_VARIANTS+=("BoldExtended") || MISSING_VARIANTS+=("BoldExtended")
check_font_variant "BlackExtended" && AVAILABLE_VARIANTS+=("BlackExtended") || MISSING_VARIANTS+=("BlackExtended")
check_font_variant "OutlineExtended" && AVAILABLE_VARIANTS+=("OutlineExtended") || MISSING_VARIANTS+=("OutlineExtended")

echo ""
echo "📊 Résumé:"
echo "=========="
echo "✅ Variantes disponibles: ${#AVAILABLE_VARIANTS[@]}"
echo "❌ Variantes manquantes: ${#MISSING_VARIANTS[@]}"

if [ ${#MISSING_VARIANTS[@]} -gt 0 ]; then
    echo ""
    echo "📋 Variantes manquantes:"
    for variant in "${MISSING_VARIANTS[@]}"; do
        echo "   - $variant"
    done
    echo ""
    echo "💡 Consultez le fichier: $PROJECT_ROOT/docs/foundation-sans-files-needed.md"
fi

# Générer le CSS pour les variantes disponibles
if [ ${#AVAILABLE_VARIANTS[@]} -gt 0 ]; then
    echo ""
    echo "🎨 Génération du CSS pour les variantes disponibles..."
    
    # Créer un fichier CSS temporaire avec toutes les déclarations
    TEMP_CSS="/tmp/foundation-sans-temp.css"
    
    cat > "$TEMP_CSS" << 'EOF'
/* Foundation Sans - Variantes disponibles */
EOF
    
    # Ajouter les déclarations @font-face pour chaque variante disponible
    for variant in "${AVAILABLE_VARIANTS[@]}"; do
        case "$variant" in
            "UltraLight")
                cat >> "$TEMP_CSS" << EOF

@font-face {
  font-family: 'Foundation Sans';
  src: url('/fonts/Fontspring-DEMO-FoundationSans-UltraLight.woff2') format('woff2'),
       url('/fonts/Fontspring-DEMO-FoundationSans-UltraLight.otf') format('opentype');
  font-weight: 100;
  font-style: normal;
  font-display: swap;
}
EOF
                ;;
            "UltraLightItalic")
                cat >> "$TEMP_CSS" << EOF

@font-face {
  font-family: 'Foundation Sans';
  src: url('/fonts/Fontspring-DEMO-FoundationSans-UltraLightItalic.woff2') format('woff2'),
       url('/fonts/Fontspring-DEMO-FoundationSans-UltraLightItalic.otf') format('opentype');
  font-weight: 100;
  font-style: italic;
  font-display: swap;
}
EOF
                ;;
            "Light")
                cat >> "$TEMP_CSS" << EOF

@font-face {
  font-family: 'Foundation Sans';
  src: url('/fonts/Fontspring-DEMO-FoundationSans-Light.woff2') format('woff2'),
       url('/fonts/Fontspring-DEMO-FoundationSans-Light.otf') format('opentype');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}
EOF
                ;;
            "LightItalic")
                cat >> "$TEMP_CSS" << EOF

@font-face {
  font-family: 'Foundation Sans';
  src: url('/fonts/Fontspring-DEMO-FoundationSans-LightItalic.woff2') format('woff2'),
       url('/fonts/Fontspring-DEMO-FoundationSans-LightItalic.otf') format('opentype');
  font-weight: 300;
  font-style: italic;
  font-display: swap;
}
EOF
                ;;
            "Roman")
                cat >> "$TEMP_CSS" << EOF

@font-face {
  font-family: 'Foundation Sans';
  src: url('/fonts/Fontspring-DEMO-FoundationSans-Roman.woff2') format('woff2'),
       url('/fonts/Fontspring-DEMO-FoundationSans-Roman.otf') format('opentype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
EOF
                ;;
            "Italic")
                cat >> "$TEMP_CSS" << EOF

@font-face {
  font-family: 'Foundation Sans';
  src: url('/fonts/Fontspring-DEMO-FoundationSans-Italic.woff2') format('woff2'),
       url('/fonts/Fontspring-DEMO-FoundationSans-Italic.otf') format('opentype');
  font-weight: 400;
  font-style: italic;
  font-display: swap;
}
EOF
                ;;
            "Bold")
                cat >> "$TEMP_CSS" << EOF

@font-face {
  font-family: 'Foundation Sans';
  src: url('/fonts/Fontspring-DEMO-FoundationSans-Bold.woff2') format('woff2'),
       url('/fonts/Fontspring-DEMO-FoundationSans-Bold.otf') format('opentype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
EOF
                ;;
            "BoldItalic")
                cat >> "$TEMP_CSS" << EOF

@font-face {
  font-family: 'Foundation Sans';
  src: url('/fonts/Fontspring-DEMO-FoundationSans-BoldItalic.woff2') format('woff2'),
       url('/fonts/Fontspring-DEMO-FoundationSans-BoldItalic.otf') format('opentype');
  font-weight: 700;
  font-style: italic;
  font-display: swap;
}
EOF
                ;;
            "Black")
                cat >> "$TEMP_CSS" << EOF

@font-face {
  font-family: 'Foundation Sans';
  src: url('/fonts/Fontspring-DEMO-FoundationSans-Black.woff2') format('woff2'),
       url('/fonts/Fontspring-DEMO-FoundationSans-Black.otf') format('opentype');
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}
EOF
                ;;
            "BlackItalic")
                cat >> "$TEMP_CSS" << EOF

@font-face {
  font-family: 'Foundation Sans';
  src: url('/fonts/Fontspring-DEMO-FoundationSans-BlackItalic.woff2') format('woff2'),
       url('/fonts/Fontspring-DEMO-FoundationSans-BlackItalic.otf') format('opentype');
  font-weight: 900;
  font-style: italic;
  font-display: swap;
}
EOF
                ;;
            "BlackEx")
                cat >> "$TEMP_CSS" << EOF

@font-face {
  font-family: 'Foundation Sans';
  src: url('/fonts/Fontspring-DEMO-FoundationSans-BlackEx.woff2') format('woff2'),
       url('/fonts/Fontspring-DEMO-FoundationSans-BlackEx.otf') format('opentype');
  font-weight: 950;
  font-style: normal;
  font-display: swap;
}
EOF
                ;;
        esac
    done
    
    echo "✅ CSS généré pour ${#AVAILABLE_VARIANTS[@]} variantes"
    echo "📄 Fichier temporaire créé: $TEMP_CSS"
    echo ""
    echo "💡 Pour intégrer le CSS:"
    echo "   1. Copiez le contenu de $TEMP_CSS"
    echo "   2. Ajoutez-le dans $CSS_FILE après les déclarations existantes"
    echo "   3. Ou utilisez le template complet: $PROJECT_ROOT/docs/foundation-sans-css-template.css"
fi

echo ""
echo "🎯 Prochaines étapes:"
echo "==================="
echo "1. 📥 Téléchargez les variantes manquantes depuis Fontspring"
echo "2. 📁 Placez les fichiers dans: $FONTS_DIR"
echo "3. 🎨 Intégrez le CSS dans: $CSS_FILE"
echo "4. ⚙️  Mettez à jour: $TAILWIND_CONFIG"
echo "5. 📚 Consultez la documentation: $FRONTEND_DIR/docs/fonts-foundation-complete.md"

echo ""
echo "✨ Intégration terminée!"
echo "======================="
