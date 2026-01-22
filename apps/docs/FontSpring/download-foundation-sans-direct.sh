#!/bin/bash

# Script de téléchargement direct des 24 variantes Foundation Sans
# Utilise des méthodes directes et des patterns connus

set -e

PROJECT_ROOT="/Volumes/Professionnel/CRÉATIVE AÏSSA/Entreprises/DK BUILDING"
FRONTEND_DIR="$PROJECT_ROOT/Site Web/apps/frontend"
FONTS_DIR="$FRONTEND_DIR/public/fonts"
DOWNLOAD_DIR="$PROJECT_ROOT/_downloads/foundation-sans-direct"

echo "🚀 Téléchargement direct des 24 variantes Foundation Sans"
echo "========================================================="

# Créer les dossiers nécessaires
mkdir -p "$DOWNLOAD_DIR"
mkdir -p "$FONTS_DIR"

# Fonction pour télécharger une URL avec retry
download_with_retry() {
    local url="$1"
    local filename="$2"
    local max_attempts=3
    
    for attempt in $(seq 1 $max_attempts); do
        echo "📥 Tentative $attempt/$max_attempts: $filename"
        
        if curl -s -L \
            -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" \
            -H "Accept: */*" \
            -H "Referer: https://www.fontspring.com/" \
            --max-time 60 \
            --retry 2 \
            --retry-delay 1 \
            -o "$DOWNLOAD_DIR/$filename" \
            "$url" 2>/dev/null; then
            
            if [ -s "$DOWNLOAD_DIR/$filename" ]; then
                echo "✅ Téléchargé: $filename ($(stat -f%z "$DOWNLOAD_DIR/$filename" 2>/dev/null || echo "unknown") bytes)"
                return 0
            else
                echo "❌ Fichier vide: $filename"
                rm -f "$DOWNLOAD_DIR/$filename"
            fi
        else
            echo "❌ Échec du téléchargement: $url"
        fi
        
        if [ $attempt -lt $max_attempts ]; then
            sleep 2
        fi
    done
    
    return 1
}

# Fonction pour tester une URL
test_url() {
    local url="$1"
    if curl -s -I --max-time 10 "$url" | grep -q "200 OK\|Content-Type.*font"; then
        return 0
    else
        return 1
    fi
}

# URLs de téléchargement direct basées sur les patterns Fontspring
download_foundation_sans_variants() {
    echo "🔍 Recherche des URLs de téléchargement direct..."
    
    # Base URLs probables
    local base_urls=(
        "https://www.fontspring.com/fonts/fontsite/foundation-sans"
        "https://cdn.fontspring.com/fonts/fontsite/foundation-sans"
        "https://static.fontspring.com/fonts/fontsite/foundation-sans"
    )
    
    # Variantes Foundation Sans avec leurs poids CSS
    declare -A variants=(
        ["UltraLight"]="100"
        ["UltraLightItalic"]="100"
        ["Light"]="300"
        ["LightItalic"]="300"
        ["Roman"]="400"
        ["Italic"]="400"
        ["Bold"]="700"
        ["BoldItalic"]="700"
        ["Black"]="900"
        ["BlackItalic"]="900"
        ["BlackEx"]="950"
        ["Outline"]="400"
        ["LightCondensed"]="300"
        ["LightCondensedItalic"]="300"
        ["Condensed"]="400"
        ["CondensedItalic"]="400"
        ["BoldCondensed"]="700"
        ["BoldCondensedItalic"]="700"
        ["BlackCondensed"]="900"
        ["BlackCondensedItalic"]="900"
        ["LightExtended"]="300"
        ["Extended"]="400"
        ["BoldExtended"]="700"
        ["BlackExtended"]="900"
        ["OutlineExtended"]="400"
    )
    
    # Formats de fichiers
    local formats=("woff2" "otf")
    
    local success_count=0
    local total_attempts=0
    
    # Générer et tester les URLs
    for base_url in "${base_urls[@]}"; do
        for variant in "${!variants[@]}"; do
            for format in "${formats[@]}"; do
                # Patterns d'URLs possibles
                local url_patterns=(
                    "${base_url}/${variant}.${format}"
                    "${base_url}/FoundationSans-${variant}.${format}"
                    "${base_url}/foundation-sans-${variant}.${format}"
                    "${base_url}/Foundation-Sans-${variant}.${format}"
                    "${base_url}/fonts/${variant}.${format}"
                    "${base_url}/fonts/FoundationSans-${variant}.${format}"
                    "${base_url}/downloads/${variant}.${format}"
                    "${base_url}/files/${variant}.${format}"
                )
                
                for url in "${url_patterns[@]}"; do
                    total_attempts=$((total_attempts + 1))
                    
                    if test_url "$url"; then
                        echo "✅ URL fonctionnelle trouvée: $url"
                        
                        local filename="FoundationSans-${variant}.${format}"
                        
                        if download_with_retry "$url" "$filename"; then
                            success_count=$((success_count + 1))
                            break 2  # Sortir des boucles de patterns pour cette variante
                        fi
                    fi
                done
            done
        done
    done
    
    echo "📊 Résumé de la recherche:"
    echo "   URLs testées: $total_attempts"
    echo "   Fichiers téléchargés: $success_count"
    
    return $success_count
}

# Fonction pour utiliser des services de proxy web
use_proxy_services() {
    echo "🌐 Utilisation de services de proxy web..."
    
    local base_url="https://www.fontspring.com/fonts/fontsite/foundation-sans"
    
    # Services de proxy web
    local proxy_services=(
        "https://api.allorigins.win/raw?url="
        "https://cors-anywhere.herokuapp.com/"
        "https://thingproxy.freeboard.io/fetch/"
    )
    
    for service in "${proxy_services[@]}"; do
        echo "🌐 Tentative avec service de proxy: $service"
        
        local proxy_url="${service}${base_url}"
        
        if curl -s -L --max-time 30 "$proxy_url" > "$DOWNLOAD_DIR/proxy-page.html" 2>/dev/null; then
            if [ -s "$DOWNLOAD_DIR/proxy-page.html" ] && ! grep -q "Cloudflare\|Just a moment\|error" "$DOWNLOAD_DIR/proxy-page.html"; then
                echo "✅ Service de proxy réussi: $service"
                
                # Extraire les URLs de téléchargement de la page proxy
                grep -iE "(\.woff2?|\.otf|\.ttf)" "$DOWNLOAD_DIR/proxy-page.html" | \
                grep -iE "(foundation|font)" | \
                sed -E 's/.*["\x27]([^"\x27]*\.(woff2?|otf|ttf)[^"\x27]*)["\x27].*/\1/i' | \
                sort -u > "$DOWNLOAD_DIR/proxy-urls.txt"
                
                local url_count=$(wc -l < "$DOWNLOAD_DIR/proxy-urls.txt")
                echo "✅ $url_count URLs extraites du proxy"
                
                if [ "$url_count" -gt 0 ]; then
                    echo "📄 URLs extraites:"
                    cat "$DOWNLOAD_DIR/proxy-urls.txt"
                    return 0
                fi
            fi
        fi
        
        echo "❌ Service de proxy échoué: $service"
        sleep 1
    done
    
    return 1
}

# Fonction pour télécharger depuis les URLs extraites
download_from_extracted_urls() {
    echo "📥 Téléchargement depuis les URLs extraites..."
    
    local urls_file="$DOWNLOAD_DIR/proxy-urls.txt"
    
    if [ ! -f "$urls_file" ] || [ ! -s "$urls_file" ]; then
        echo "❌ Aucune URL extraite disponible"
        return 1
    fi
    
    local success_count=0
    local total_count=0
    
    while IFS= read -r url; do
        if [ -z "$url" ]; then
            continue
        fi
        
        total_count=$((total_count + 1))
        
        # Extraire le nom du fichier
        local filename=$(basename "$url" | sed 's/[?&].*$//')
        
        if download_with_retry "$url" "$filename"; then
            success_count=$((success_count + 1))
        fi
        
        sleep 1
        
    done < "$urls_file"
    
    echo "📊 Résumé du téléchargement depuis les URLs extraites:"
    echo "   URLs traitées: $total_count"
    echo "   Succès: $success_count"
    
    return $success_count
}

# Fonction pour intégrer les fichiers téléchargés
integrate_downloaded_fonts() {
    echo "🔧 Intégration des fichiers téléchargés..."
    
    if [ ! -d "$DOWNLOAD_DIR" ] || [ -z "$(ls -A "$DOWNLOAD_DIR" 2>/dev/null)" ]; then
        echo "❌ Aucun fichier téléchargé à intégrer"
        return 1
    fi
    
    local integrated_count=0
    
    # Copier tous les fichiers valides vers le dossier des polices
    for file in "$DOWNLOAD_DIR"/*; do
        if [ -f "$file" ]; then
            local filename=$(basename "$file")
            local extension="${filename##*.}"
            
            # Vérifier que c'est un fichier de police valide
            if [[ "$extension" =~ ^(woff2|woff|otf|ttf)$ ]]; then
                cp "$file" "$FONTS_DIR/"
                echo "✅ Intégré: $filename"
                integrated_count=$((integrated_count + 1))
            else
                echo "⚠️ Fichier ignoré (format non supporté): $filename"
            fi
        fi
    done
    
    echo "📊 Résumé de l'intégration:"
    echo "   Fichiers intégrés: $integrated_count"
    
    return $integrated_count
}

# Fonction principale
main() {
    echo "🚀 Démarrage du téléchargement direct..."
    
    # Étape 1: Téléchargement direct avec patterns
    if download_foundation_sans_variants; then
        echo "✅ Téléchargement direct réussi"
    else
        echo "⚠️ Téléchargement direct échoué, utilisation de services de proxy"
        
        # Étape 2: Utilisation de services de proxy
        if use_proxy_services; then
            echo "✅ Service de proxy réussi"
            download_from_extracted_urls
        else
            echo "❌ Tous les services de proxy ont échoué"
        fi
    fi
    
    # Étape 3: Intégration des fichiers
    integrate_downloaded_fonts
    
    # Étape 4: Résumé final
    echo ""
    echo "📊 Résumé du téléchargement direct:"
    echo "==================================="
    echo "📁 Fichiers téléchargés: $(ls -1 "$DOWNLOAD_DIR" 2>/dev/null | wc -l)"
    echo "📁 Fichiers intégrés: $(ls -1 "$FONTS_DIR" 2>/dev/null | wc -l)"
    
    if [ -d "$FONTS_DIR" ] && [ "$(ls -A "$FONTS_DIR" 2>/dev/null)" ]; then
        echo "✅ Fichiers intégrés avec succès:"
        ls -la "$FONTS_DIR" | grep -E "\.(woff2|woff|otf|ttf)$"
    else
        echo "❌ Aucun fichier intégré"
    fi
    
    echo ""
    echo "💡 Prochaines étapes:"
    echo "===================="
    echo "1. Vérifier les fichiers intégrés dans: $FONTS_DIR"
    echo "2. Exécuter le script d'intégration: ./integrate-foundation-sans.sh"
    echo "3. Mettre à jour la configuration CSS et Tailwind"
}

# Exécuter le script principal
main

echo ""
echo "✨ Téléchargement direct terminé!"
echo "================================="
