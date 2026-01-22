#!/bin/bash

# Script d'extraction directe des vrais fichiers Foundation Sans
# Utilise des méthodes directes pour accéder aux fichiers originaux

set -e

PROJECT_ROOT="/Volumes/Professionnel/CRÉATIVE AÏSSA/Entreprises/DK BUILDING"
FRONTEND_DIR="$PROJECT_ROOT/Site Web/apps/frontend"
FONTS_DIR="$FRONTEND_DIR/public/fonts"
DOWNLOAD_DIR="$PROJECT_ROOT/_downloads/foundation-sans-direct"

echo "🎯 Extraction directe des vrais fichiers Foundation Sans"
echo "======================================================="

# Créer les dossiers nécessaires
mkdir -p "$DOWNLOAD_DIR"
mkdir -p "$FONTS_DIR"

# Fonction pour télécharger avec validation stricte
download_with_validation() {
    local url="$1"
    local filename="$2"
    local max_attempts=3
    
    for attempt in $(seq 1 $max_attempts); do
        echo "📥 Tentative $attempt/$max_attempts: $filename"
        
        # Headers spécialisés pour les polices
        local user_agents=(
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        
        local ua="${user_agents[$((attempt % ${#user_agents[@]}))]}"
        
        if curl -s -L \
            -H "User-Agent: $ua" \
            -H "Accept: font/woff2,font/woff,font/otf,font/ttf,*/*" \
            -H "Accept-Language: fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7" \
            -H "Accept-Encoding: gzip, deflate, br" \
            -H "DNT: 1" \
            -H "Connection: keep-alive" \
            -H "Upgrade-Insecure-Requests: 1" \
            -H "Sec-Fetch-Dest: font" \
            -H "Sec-Fetch-Mode: no-cors" \
            -H "Sec-Fetch-Site: cross-site" \
            -H "Referer: https://www.fontspring.com/" \
            -H "Origin: https://www.fontspring.com" \
            --max-time 60 \
            --retry 2 \
            --retry-delay 1 \
            --compressed \
            -o "$DOWNLOAD_DIR/$filename" \
            "$url" 2>/dev/null; then
            
            if [ -s "$DOWNLOAD_DIR/$filename" ]; then
                # Vérifier que c'est une vraie police
                local mime_type=$(file -b --mime-type "$DOWNLOAD_DIR/$filename" 2>/dev/null)
                if [[ "$mime_type" =~ (font|woff|otf|ttf) ]]; then
                    echo "✅ Police valide téléchargée: $filename"
                    return 0
                else
                    echo "❌ Fichier invalide (HTML/erreur): $filename"
                    rm -f "$DOWNLOAD_DIR/$filename"
                fi
            else
                echo "❌ Fichier vide: $filename"
                rm -f "$DOWNLOAD_DIR/$filename"
            fi
        else
            echo "❌ Échec du téléchargement: $url"
        fi
        
        if [ $attempt -lt $max_attempts ]; then
            sleep 3
        fi
    done
    
    return 1
}

# URLs directes des vrais fichiers Foundation Sans (basées sur les patterns Fontspring)
download_real_foundation_sans() {
    echo "🔍 Téléchargement des vrais fichiers Foundation Sans..."
    
    # URLs directes probables pour les vrais fichiers Foundation Sans
    local real_font_urls=(
        # Ultra Light
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/UltraLight.woff2"
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/UltraLight.otf"
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/UltraLightItalic.woff2"
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/UltraLightItalic.otf"
        
        # Light
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/LightItalic.woff2"
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/LightItalic.otf"
        
        # Roman
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/Italic.woff2"
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/Italic.otf"
        
        # Bold
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/BoldItalic.woff2"
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/BoldItalic.otf"
        
        # Black
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/Black.woff2"
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/Black.otf"
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/BlackItalic.woff2"
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/BlackItalic.otf"
        
        # Outline
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/Outline.woff2"
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/Outline.otf"
        
        # Condensed
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/LightCondensed.woff2"
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/LightCondensed.otf"
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/LightCondensedItalic.woff2"
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/LightCondensedItalic.otf"
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/Condensed.woff2"
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/Condensed.otf"
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/CondensedItalic.woff2"
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/CondensedItalic.otf"
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/BoldCondensed.woff2"
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/BoldCondensed.otf"
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/BoldCondensedItalic.woff2"
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/BoldCondensedItalic.otf"
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/BlackCondensed.woff2"
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/BlackCondensed.otf"
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/BlackCondensedItalic.woff2"
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/BlackCondensedItalic.otf"
        
        # Extended
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/LightExtended.woff2"
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/LightExtended.otf"
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/Extended.woff2"
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/Extended.otf"
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/BoldExtended.woff2"
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/BoldExtended.otf"
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/BlackExtended.woff2"
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/BlackExtended.otf"
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/OutlineExtended.woff2"
        "https://www.fontspring.com/fonts/fontsite/foundation-sans/OutlineExtended.otf"
    )
    
    local success_count=0
    local total_count=${#real_font_urls[@]}
    
    echo "📊 Tentative de téléchargement de $total_count fichiers..."
    
    for url in "${real_font_urls[@]}"; do
        local filename=$(basename "$url")
        
        if download_with_validation "$url" "$filename"; then
            success_count=$((success_count + 1))
        fi
        
        sleep 0.5
    done
    
    echo "📊 Résumé du téléchargement:"
    echo "   URLs testées: $total_count"
    echo "   Fichiers téléchargés: $success_count"
    
    return $success_count
}

# Fonction pour utiliser des services de proxy spécialisés
use_specialized_proxies() {
    echo "🌐 Utilisation de services de proxy spécialisés..."
    
    local base_url="https://www.fontspring.com/fonts/fontsite/foundation-sans"
    
    # Services de proxy spécialisés pour les polices
    local proxy_services=(
        "https://api.allorigins.win/raw?url="
        "https://cors-anywhere.herokuapp.com/"
        "https://thingproxy.freeboard.io/fetch/"
        "https://api.codetabs.com/v1/proxy?url="
        "https://corsproxy.io/?"
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
        
        if download_with_validation "$url" "$filename"; then
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
    echo "🚀 Démarrage de l'extraction directe..."
    
    # Étape 1: Téléchargement direct des vrais fichiers
    if download_real_foundation_sans; then
        echo "✅ Téléchargement direct réussi"
    else
        echo "⚠️ Téléchargement direct échoué, utilisation de services de proxy"
        
        # Étape 2: Utilisation de services de proxy
        if use_specialized_proxies; then
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
    echo "📊 Résumé de l'extraction directe:"
    echo "================================="
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
    echo "2. Mettre à jour la configuration CSS et Tailwind"
    echo "3. Tester l'affichage des polices"
}

# Exécuter le script principal
main

echo ""
echo "✨ Extraction directe terminée!"
echo "==============================="
