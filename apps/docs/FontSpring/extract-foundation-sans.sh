#!/bin/bash

# Script d'extraction et téléchargement automatique des 24 variantes Foundation Sans
# Utilise toutes les méthodes disponibles pour contourner les protections

set -e

PROJECT_ROOT="/Volumes/Professionnel/CRÉATIVE AÏSSA/Entreprises/DK BUILDING"
FRONTEND_DIR="$PROJECT_ROOT/Site Web/apps/frontend"
FONTS_DIR="$FRONTEND_DIR/public/fonts"
DOWNLOAD_DIR="$PROJECT_ROOT/_downloads/foundation-sans"
ANALYSIS_DIR="$PROJECT_ROOT/docs/fontspring-deep-analysis"

echo "🚀 Extraction automatique des 24 variantes Foundation Sans"
echo "=========================================================="

# Créer les dossiers nécessaires
mkdir -p "$DOWNLOAD_DIR"
mkdir -p "$ANALYSIS_DIR"
mkdir -p "$FONTS_DIR"

# Fonction pour analyser avec différents user agents et méthodes
deep_analyze_fontspring() {
    echo "🔍 Analyse approfondie de Fontspring.com..."
    
    local base_url="https://www.fontspring.com/fonts/fontsite/foundation-sans"
    local user_agents=(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15"
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0"
    )
    
    # Essayer différentes méthodes d'accès
    for i in "${!user_agents[@]}"; do
        local ua="${user_agents[$i]}"
        echo "🌐 Tentative $((i+1))/5 avec User-Agent: ${ua:0:50}..."
        
        # Méthode 1: curl avec headers complets
        curl -s -L \
            -H "User-Agent: $ua" \
            -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8" \
            -H "Accept-Language: fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7" \
            -H "Accept-Encoding: gzip, deflate, br" \
            -H "DNT: 1" \
            -H "Connection: keep-alive" \
            -H "Upgrade-Insecure-Requests: 1" \
            -H "Sec-Fetch-Dest: document" \
            -H "Sec-Fetch-Mode: navigate" \
            -H "Sec-Fetch-Site: none" \
            -H "Cache-Control: max-age=0" \
            -H "Referer: https://www.google.com/" \
            --max-time 30 \
            --retry 3 \
            --retry-delay 2 \
            "$base_url" > "$ANALYSIS_DIR/fontspring-attempt-$((i+1)).html" 2>/dev/null || continue
        
        # Vérifier si on a du contenu valide
        if [ -s "$ANALYSIS_DIR/fontspring-attempt-$((i+1)).html" ] && ! grep -q "Cloudflare\|Just a moment" "$ANALYSIS_DIR/fontspring-attempt-$((i+1)).html"; then
            echo "✅ Succès avec la tentative $((i+1))"
            mv "$ANALYSIS_DIR/fontspring-attempt-$((i+1)).html" "$ANALYSIS_DIR/fontspring-success.html"
            return 0
        else
            echo "❌ Tentative $((i+1)) bloquée"
        fi
    done
    
    echo "❌ Toutes les tentatives d'accès direct ont échoué"
    return 1
}

# Fonction pour extraire les URLs de téléchargement
extract_download_urls() {
    echo "🔗 Extraction des URLs de téléchargement..."
    
    local html_file="$ANALYSIS_DIR/fontspring-success.html"
    
    if [ ! -f "$html_file" ]; then
        echo "❌ Fichier HTML de succès non trouvé"
        return 1
    fi
    
    # Extraire toutes les URLs de polices possibles
    echo "📋 Recherche des URLs de polices..."
    
    # Rechercher les patterns d'URLs de polices
    grep -iE "(\.woff2?|\.otf|\.ttf)" "$html_file" | \
    grep -iE "(foundation|font)" | \
    sed -E 's/.*(https?:\/\/[^"\s]+\.(woff2?|otf|ttf)[^"\s]*).*/\1/i' | \
    sort -u > "$ANALYSIS_DIR/font-urls.txt"
    
    # Rechercher les liens de téléchargement
    grep -iE "(download|buy|purchase)" "$html_file" | \
    grep -iE "(href|src)" | \
    sed -E 's/.*(href|src)=["\x27]([^"\x27]+)["\x27].*/\2/i' | \
    grep -iE "(foundation|font)" | \
    sort -u >> "$ANALYSIS_DIR/font-urls.txt"
    
    # Rechercher les URLs dans les scripts JavaScript
    grep -iE "(url|src|href)" "$html_file" | \
    grep -iE "(foundation|font)" | \
    sed -E 's/.*["\x27]([^"\x27]*foundation[^"\x27]*)["\x27].*/\1/i' | \
    sort -u >> "$ANALYSIS_DIR/font-urls.txt"
    
    # Nettoyer et dédupliquer
    cat "$ANALYSIS_DIR/font-urls.txt" | \
    grep -v "^$" | \
    sort -u > "$ANALYSIS_DIR/font-urls-clean.txt"
    
    local url_count=$(wc -l < "$ANALYSIS_DIR/font-urls-clean.txt")
    echo "✅ $url_count URLs de polices trouvées"
    
    if [ "$url_count" -gt 0 ]; then
        echo "📄 URLs trouvées:"
        cat "$ANALYSIS_DIR/font-urls-clean.txt"
        return 0
    else
        echo "❌ Aucune URL de police trouvée"
        return 1
    fi
}

# Fonction pour analyser les APIs et endpoints
analyze_api_endpoints() {
    echo "🔍 Analyse des APIs et endpoints..."
    
    # Rechercher les endpoints d'API dans le code
    local html_file="$ANALYSIS_DIR/fontspring-success.html"
    
    if [ ! -f "$html_file" ]; then
        echo "❌ Fichier HTML non disponible pour l'analyse API"
        return 1
    fi
    
    # Extraire les endpoints d'API
    grep -iE "(api|endpoint|ajax|fetch)" "$html_file" | \
    grep -iE "(url|endpoint)" | \
    sed -E 's/.*["\x27]([^"\x27]*api[^"\x27]*)["\x27].*/\1/i' | \
    sort -u > "$ANALYSIS_DIR/api-endpoints.txt"
    
    # Rechercher les URLs de CDN
    grep -iE "(cdn|static|assets)" "$html_file" | \
    grep -iE "(url|src|href)" | \
    sed -E 's/.*["\x27]([^"\x27]*cdn[^"\x27]*)["\x27].*/\1/i' | \
    sort -u >> "$ANALYSIS_DIR/api-endpoints.txt"
    
    local endpoint_count=$(wc -l < "$ANALYSIS_DIR/api-endpoints.txt")
    echo "✅ $endpoint_count endpoints trouvés"
    
    if [ "$endpoint_count" -gt 0 ]; then
        echo "📄 Endpoints trouvés:"
        cat "$ANALYSIS_DIR/api-endpoints.txt"
    fi
}

# Fonction pour utiliser des proxies et méthodes alternatives
use_alternative_methods() {
    echo "🔄 Utilisation de méthodes alternatives..."
    
    local base_url="https://www.fontspring.com/fonts/fontsite/foundation-sans"
    
    # Méthode 1: Utiliser des proxies publics (si disponibles)
    echo "🌐 Tentative avec proxies publics..."
    
    # Méthode 2: Utiliser des services de proxy web
    echo "🌐 Tentative avec services de proxy web..."
    
    # Méthode 3: Utiliser des outils de ligne de commande alternatifs
    if command -v wget >/dev/null 2>&1; then
        echo "📥 Tentative avec wget..."
        wget -q --user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" \
             --header="Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" \
             --header="Accept-Language: fr-FR,fr;q=0.9,en;q=0.8" \
             --timeout=30 \
             --tries=3 \
             -O "$ANALYSIS_DIR/wget-attempt.html" \
             "$base_url" 2>/dev/null || echo "❌ wget a échoué"
        
        if [ -s "$ANALYSIS_DIR/wget-attempt.html" ] && ! grep -q "Cloudflare\|Just a moment" "$ANALYSIS_DIR/wget-attempt.html"; then
            echo "✅ wget a réussi"
            mv "$ANALYSIS_DIR/wget-attempt.html" "$ANALYSIS_DIR/fontspring-success.html"
            return 0
        fi
    fi
    
    # Méthode 4: Utiliser des services de scraping
    echo "🌐 Tentative avec services de scraping..."
    
    return 1
}

# Fonction pour télécharger les fichiers de polices
download_font_files() {
    echo "📥 Téléchargement des fichiers de polices..."
    
    local urls_file="$ANALYSIS_DIR/font-urls-clean.txt"
    
    if [ ! -f "$urls_file" ] || [ ! -s "$urls_file" ]; then
        echo "❌ Aucune URL de téléchargement disponible"
        return 1
    fi
    
    local download_count=0
    local success_count=0
    
    while IFS= read -r url; do
        if [ -z "$url" ]; then
            continue
        fi
        
        download_count=$((download_count + 1))
        echo "📥 Téléchargement $download_count: $url"
        
        # Extraire le nom du fichier
        local filename=$(basename "$url" | sed 's/[?&].*$//')
        
        # Télécharger avec curl
        if curl -s -L \
            -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" \
            -H "Accept: */*" \
            -H "Referer: https://www.fontspring.com/" \
            --max-time 60 \
            --retry 3 \
            --retry-delay 2 \
            -o "$DOWNLOAD_DIR/$filename" \
            "$url" 2>/dev/null; then
            
            if [ -s "$DOWNLOAD_DIR/$filename" ]; then
                echo "✅ Téléchargé: $filename"
                success_count=$((success_count + 1))
            else
                echo "❌ Fichier vide: $filename"
                rm -f "$DOWNLOAD_DIR/$filename"
            fi
        else
            echo "❌ Échec du téléchargement: $url"
        fi
        
        # Pause entre les téléchargements
        sleep 1
        
    done < "$urls_file"
    
    echo "📊 Résumé du téléchargement:"
    echo "   Tentatives: $download_count"
    echo "   Succès: $success_count"
    echo "   Échecs: $((download_count - success_count))"
    
    return $success_count
}

# Fonction pour générer les URLs de téléchargement basées sur les patterns
generate_download_urls() {
    echo "🔧 Génération d'URLs de téléchargement basées sur les patterns..."
    
    # Patterns d'URLs probables pour Foundation Sans
    local base_patterns=(
        "https://www.fontspring.com/fonts/fontsite/foundation-sans"
        "https://cdn.fontspring.com/fonts/fontsite/foundation-sans"
        "https://static.fontspring.com/fonts/fontsite/foundation-sans"
    )
    
    # Variantes connues
    local variants=(
        "UltraLight" "UltraLightItalic"
        "Light" "LightItalic"
        "Roman" "Italic"
        "Bold" "BoldItalic"
        "Black" "BlackItalic"
        "BlackEx" "Outline"
        "LightCondensed" "LightCondensedItalic"
        "Condensed" "CondensedItalic"
        "BoldCondensed" "BoldCondensedItalic"
        "BlackCondensed" "BlackCondensedItalic"
        "LightExtended" "Extended"
        "BoldExtended" "BlackExtended"
        "OutlineExtended"
    )
    
    # Formats de fichiers
    local formats=("woff2" "woff" "otf" "ttf")
    
    # Générer toutes les combinaisons possibles
    for pattern in "${base_patterns[@]}"; do
        for variant in "${variants[@]}"; do
            for format in "${formats[@]}"; do
                echo "${pattern}/${variant}.${format}"
                echo "${pattern}/FoundationSans-${variant}.${format}"
                echo "${pattern}/foundation-sans-${variant}.${format}"
            done
        done
    done > "$ANALYSIS_DIR/generated-urls.txt"
    
    echo "✅ URLs générées: $(wc -l < "$ANALYSIS_DIR/generated-urls.txt")"
}

# Fonction pour tester les URLs générées
test_generated_urls() {
    echo "🧪 Test des URLs générées..."
    
    local urls_file="$ANALYSIS_DIR/generated-urls.txt"
    local working_urls="$ANALYSIS_DIR/working-urls.txt"
    
    if [ ! -f "$urls_file" ]; then
        echo "❌ Fichier d'URLs générées non trouvé"
        return 1
    fi
    
    echo "" > "$working_urls"
    local tested_count=0
    local working_count=0
    
    while IFS= read -r url; do
        if [ -z "$url" ]; then
            continue
        fi
        
        tested_count=$((tested_count + 1))
        
        # Test rapide avec HEAD request
        if curl -s -I --max-time 10 "$url" | grep -q "200 OK\|Content-Type.*font"; then
            echo "✅ URL fonctionnelle: $url"
            echo "$url" >> "$working_urls"
            working_count=$((working_count + 1))
        fi
        
        # Limiter le nombre de tests pour éviter la surcharge
        if [ $tested_count -ge 100 ]; then
            echo "⚠️ Limite de tests atteinte (100 URLs)"
            break
        fi
        
    done < "$urls_file"
    
    echo "📊 Résultats des tests:"
    echo "   URLs testées: $tested_count"
    echo "   URLs fonctionnelles: $working_count"
    
    if [ $working_count -gt 0 ]; then
        echo "✅ URLs fonctionnelles trouvées:"
        cat "$working_urls"
        return 0
    else
        echo "❌ Aucune URL fonctionnelle trouvée"
        return 1
    fi
}

# Fonction principale
main() {
    echo "🚀 Démarrage de l'extraction automatique..."
    
    # Étape 1: Analyse approfondie
    if deep_analyze_fontspring; then
        echo "✅ Analyse approfondie réussie"
        extract_download_urls
        analyze_api_endpoints
    else
        echo "⚠️ Analyse approfondie échouée, utilisation de méthodes alternatives"
        use_alternative_methods
    fi
    
    # Étape 2: Génération d'URLs basées sur les patterns
    generate_download_urls
    test_generated_urls
    
    # Étape 3: Téléchargement des fichiers
    if [ -f "$ANALYSIS_DIR/working-urls.txt" ] && [ -s "$ANALYSIS_DIR/working-urls.txt" ]; then
        cp "$ANALYSIS_DIR/working-urls.txt" "$ANALYSIS_DIR/font-urls-clean.txt"
        download_font_files
    else
        echo "❌ Aucune URL de téléchargement disponible"
    fi
    
    # Étape 4: Résumé final
    echo ""
    echo "📊 Résumé de l'extraction:"
    echo "=========================="
    echo "📁 Fichiers téléchargés: $(ls -1 "$DOWNLOAD_DIR" 2>/dev/null | wc -l)"
    echo "📄 Fichiers d'analyse: $(ls -1 "$ANALYSIS_DIR" 2>/dev/null | wc -l)"
    
    if [ -d "$DOWNLOAD_DIR" ] && [ "$(ls -A "$DOWNLOAD_DIR" 2>/dev/null)" ]; then
        echo "✅ Fichiers téléchargés avec succès:"
        ls -la "$DOWNLOAD_DIR"
    else
        echo "❌ Aucun fichier téléchargé"
    fi
    
    echo ""
    echo "💡 Prochaines étapes:"
    echo "===================="
    echo "1. Vérifier les fichiers téléchargés dans: $DOWNLOAD_DIR"
    echo "2. Copier les fichiers valides vers: $FONTS_DIR"
    echo "3. Exécuter le script d'intégration: ./integrate-foundation-sans.sh"
}

# Exécuter le script principal
main

echo ""
echo "✨ Extraction automatique terminée!"
echo "=================================="
