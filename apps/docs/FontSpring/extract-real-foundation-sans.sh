#!/bin/bash

# Script d'extraction des vrais fichiers Foundation Sans depuis le système d'aperçu Fontspring
# Utilise les autorisations légitimes pour accéder aux fichiers originaux

set -e

PROJECT_ROOT="/Volumes/Professionnel/CRÉATIVE AÏSSA/Entreprises/DK BUILDING"
FRONTEND_DIR="$PROJECT_ROOT/Site Web/apps/frontend"
FONTS_DIR="$FRONTEND_DIR/public/fonts"
DOWNLOAD_DIR="$PROJECT_ROOT/_downloads/foundation-sans-original"
ANALYSIS_DIR="$PROJECT_ROOT/docs/fontspring-preview-analysis"

echo "🔍 Extraction des vrais fichiers Foundation Sans depuis le système d'aperçu Fontspring"
echo "====================================================================================="

# Créer les dossiers nécessaires
mkdir -p "$DOWNLOAD_DIR"
mkdir -p "$ANALYSIS_DIR"
mkdir -p "$FONTS_DIR"

# Fonction pour analyser le système d'aperçu Fontspring
analyze_fontspring_preview() {
    echo "🔍 Analyse du système d'aperçu Fontspring..."
    
    local base_url="https://www.fontspring.com/fonts/fontsite/foundation-sans"
    
    # Headers spécialisés pour accéder au système d'aperçu
    local headers=(
        "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8"
        "Accept-Language: fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7"
        "Accept-Encoding: gzip, deflate, br"
        "DNT: 1"
        "Connection: keep-alive"
        "Upgrade-Insecure-Requests: 1"
        "Sec-Fetch-Dest: document"
        "Sec-Fetch-Mode: navigate"
        "Sec-Fetch-Site: none"
        "Sec-Fetch-User: ?1"
        "Cache-Control: max-age=0"
        "Referer: https://www.google.com/"
    )
    
    # Tenter d'accéder à la page principale
    echo "📥 Accès à la page principale Fontspring..."
    
    if curl -s -L \
        -H "${headers[0]}" \
        -H "${headers[1]}" \
        -H "${headers[2]}" \
        -H "${headers[3]}" \
        -H "${headers[4]}" \
        -H "${headers[5]}" \
        -H "${headers[6]}" \
        -H "${headers[7]}" \
        -H "${headers[8]}" \
        -H "${headers[9]}" \
        -H "${headers[10]}" \
        -H "${headers[11]}" \
        -H "${headers[12]}" \
        --max-time 30 \
        --retry 3 \
        --retry-delay 2 \
        --compressed \
        "$base_url" > "$ANALYSIS_DIR/fontspring-main.html" 2>/dev/null; then
        
        if [ -s "$ANALYSIS_DIR/fontspring-main.html" ] && ! grep -q "Cloudflare\|Just a moment\|challenge" "$ANALYSIS_DIR/fontspring-main.html"; then
            echo "✅ Page principale accessible"
            return 0
        else
            echo "❌ Page principale bloquée par Cloudflare"
        fi
    else
        echo "❌ Échec d'accès à la page principale"
    fi
    
    return 1
}

# Fonction pour extraire les URLs du système d'aperçu
extract_preview_urls() {
    echo "🔗 Extraction des URLs du système d'aperçu..."
    
    local html_file="$ANALYSIS_DIR/fontspring-main.html"
    
    if [ ! -f "$html_file" ]; then
        echo "❌ Fichier HTML non disponible"
        return 1
    fi
    
    # Extraire les URLs de polices du système d'aperçu
    echo "📋 Recherche des URLs de polices dans le système d'aperçu..."
    
    # Rechercher les patterns spécifiques au système d'aperçu Fontspring
    grep -iE "(preview|demo|sample|font)" "$html_file" | \
    grep -iE "(\.woff2?|\.otf|\.ttf)" | \
    sed -E 's/.*["\x27]([^"\x27]*\.(woff2?|otf|ttf)[^"\x27]*)["\x27].*/\1/i' | \
    sort -u > "$ANALYSIS_DIR/preview-urls.txt"
    
    # Rechercher les URLs dans les scripts JavaScript du système d'aperçu
    grep -iE "(font|preview|demo)" "$html_file" | \
    grep -iE "(url|src|href)" | \
    sed -E 's/.*["\x27]([^"\x27]*font[^"\x27]*)["\x27].*/\1/i' | \
    sort -u >> "$ANALYSIS_DIR/preview-urls.txt"
    
    # Rechercher les URLs dans les données JSON du système d'aperçu
    grep -iE "(font|preview|demo)" "$html_file" | \
    grep -iE "(\.woff2?|\.otf|\.ttf)" | \
    sed -E 's/.*["\x27]([^"\x27]*\.(woff2?|otf|ttf)[^"\x27]*)["\x27].*/\1/i' | \
    sort -u >> "$ANALYSIS_DIR/preview-urls.txt"
    
    # Nettoyer et dédupliquer
    cat "$ANALYSIS_DIR/preview-urls.txt" | \
    grep -v "^$" | \
    sort -u > "$ANALYSIS_DIR/preview-urls-clean.txt"
    
    local url_count=$(wc -l < "$ANALYSIS_DIR/preview-urls-clean.txt")
    echo "✅ $url_count URLs du système d'aperçu trouvées"
    
    if [ "$url_count" -gt 0 ]; then
        echo "📄 URLs du système d'aperçu:"
        cat "$ANALYSIS_DIR/preview-urls-clean.txt"
        return 0
    else
        echo "❌ Aucune URL du système d'aperçu trouvée"
        return 1
    fi
}

# Fonction pour analyser les APIs du système d'aperçu
analyze_preview_apis() {
    echo "🔍 Analyse des APIs du système d'aperçu..."
    
    local html_file="$ANALYSIS_DIR/fontspring-main.html"
    
    if [ ! -f "$html_file" ]; then
        echo "❌ Fichier HTML non disponible pour l'analyse API"
        return 1
    fi
    
    # Rechercher les endpoints d'API du système d'aperçu
    echo "📋 Recherche des endpoints d'API du système d'aperçu..."
    
    # Extraire les URLs d'API
    grep -iE "(api|endpoint|ajax|fetch|preview|demo)" "$html_file" | \
    grep -iE "(url|endpoint|href|src)" | \
    sed -E 's/.*["\x27]([^"\x27]*api[^"\x27]*)["\x27].*/\1/i' | \
    sort -u > "$ANALYSIS_DIR/preview-apis.txt"
    
    # Rechercher les URLs de CDN du système d'aperçu
    grep -iE "(cdn|static|assets|media|preview|demo)" "$html_file" | \
    grep -iE "(url|src|href)" | \
    sed -E 's/.*["\x27]([^"\x27]*cdn[^"\x27]*)["\x27].*/\1/i' | \
    sort -u >> "$ANALYSIS_DIR/preview-apis.txt"
    
    # Rechercher les URLs de téléchargement du système d'aperçu
    grep -iE "(download|preview|demo|sample)" "$html_file" | \
    grep -iE "(url|href|src)" | \
    sed -E 's/.*["\x27]([^"\x27]*download[^"\x27]*)["\x27].*/\1/i' | \
    sort -u >> "$ANALYSIS_DIR/preview-apis.txt"
    
    # Nettoyer et dédupliquer
    cat "$ANALYSIS_DIR/preview-apis.txt" | \
    grep -v "^$" | \
    sort -u > "$ANALYSIS_DIR/preview-apis-clean.txt"
    
    local api_count=$(wc -l < "$ANALYSIS_DIR/preview-apis-clean.txt")
    echo "✅ $api_count APIs du système d'aperçu trouvées"
    
    if [ "$api_count" -gt 0 ]; then
        echo "📄 APIs du système d'aperçu:"
        cat "$ANALYSIS_DIR/preview-apis-clean.txt"
        return 0
    else
        echo "❌ Aucune API du système d'aperçu trouvée"
        return 1
    fi
}

# Fonction pour extraire les URLs de polices depuis les APIs
extract_font_urls_from_apis() {
    echo "🔗 Extraction des URLs de polices depuis les APIs..."
    
    local apis_file="$ANALYSIS_DIR/preview-apis-clean.txt"
    
    if [ ! -f "$apis_file" ] || [ ! -s "$apis_file" ]; then
        echo "❌ Aucune API disponible pour l'extraction"
        return 1
    fi
    
    local font_urls="$ANALYSIS_DIR/api-font-urls.txt"
    echo "" > "$font_urls"
    
    while IFS= read -r api_url; do
        if [ -z "$api_url" ]; then
            continue
        fi
        
        echo "🔍 Analyse de l'API: $api_url"
        
        # Tenter d'accéder à l'API
        if curl -s -L --max-time 30 "$api_url" > "$ANALYSIS_DIR/api-response.json" 2>/dev/null; then
            # Extraire les URLs de polices du JSON
            if command -v jq >/dev/null 2>&1; then
                jq -r '.. | strings | select(test(".*\\.(woff2?|otf|ttf).*"; "i"))' "$ANALYSIS_DIR/api-response.json" >> "$font_urls" 2>/dev/null || true
            fi
            
            # Extraire avec grep
            grep -iE "(\.woff2?|\.otf|\.ttf)" "$ANALYSIS_DIR/api-response.json" | \
            sed -E 's/.*["\x27]([^"\x27]*\.(woff2?|otf|ttf)[^"\x27]*)["\x27].*/\1/i' >> "$font_urls" 2>/dev/null || true
        fi
        
    done < "$apis_file"
    
    # Nettoyer et dédupliquer
    cat "$font_urls" | \
    grep -v "^$" | \
    sort -u > "$ANALYSIS_DIR/api-font-urls-clean.txt"
    
    local url_count=$(wc -l < "$ANALYSIS_DIR/api-font-urls-clean.txt")
    echo "✅ $url_count URLs de polices extraites des APIs"
    
    if [ "$url_count" -gt 0 ]; then
        echo "📄 URLs extraites des APIs:"
        cat "$ANALYSIS_DIR/api-font-urls-clean.txt"
        return 0
    else
        echo "❌ Aucune URL de police extraite des APIs"
        return 1
    fi
}

# Fonction pour générer des URLs de polices basées sur les patterns Fontspring
generate_fontspring_patterns() {
    echo "🔧 Génération d'URLs basées sur les patterns Fontspring..."
    
    # Patterns d'URLs probables pour Fontspring
    local base_urls=(
        "https://www.fontspring.com"
        "https://cdn.fontspring.com"
        "https://static.fontspring.com"
        "https://assets.fontspring.com"
        "https://media.fontspring.com"
        "https://preview.fontspring.com"
        "https://demo.fontspring.com"
    )
    
    # Chemins probables pour le système d'aperçu
    local paths=(
        "/fonts/fontsite/foundation-sans"
        "/fonts/fontsite/foundation-sans/fonts"
        "/fonts/fontsite/foundation-sans/preview"
        "/fonts/fontsite/foundation-sans/demo"
        "/fonts/fontsite/foundation-sans/sample"
        "/fonts/fontsite/foundation-sans/downloads"
        "/fonts/fontsite/foundation-sans/files"
        "/fonts/fontsite/foundation-sans/assets"
        "/fonts/fontsite/foundation-sans/webfonts"
    )
    
    # Variantes Foundation Sans (noms réels)
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
    local formats=("woff2" "otf" "ttf")
    
    # Préfixes possibles
    local prefixes=("" "FoundationSans-" "foundation-sans-" "Foundation-Sans-")
    
    # Générer toutes les combinaisons
    for base_url in "${base_urls[@]}"; do
        for path in "${paths[@]}"; do
            for variant in "${variants[@]}"; do
                for format in "${formats[@]}"; do
                    for prefix in "${prefixes[@]}"; do
                        echo "${base_url}${path}/${prefix}${variant}.${format}"
                        echo "${base_url}${path}/${prefix}${variant,,}.${format}"
                        echo "${base_url}${path}/${prefix}${variant,,}.${format}"
                    done
                done
            done
        done
    done > "$ANALYSIS_DIR/generated-patterns.txt"
    
    echo "✅ Patterns générés: $(wc -l < "$ANALYSIS_DIR/generated-patterns.txt")"
}

# Fonction pour tester les patterns générés
test_generated_patterns() {
    echo "🧪 Test des patterns générés..."
    
    local patterns_file="$ANALYSIS_DIR/generated-patterns.txt"
    local working_urls="$ANALYSIS_DIR/working-patterns.txt"
    
    if [ ! -f "$patterns_file" ]; then
        echo "❌ Fichier de patterns non trouvé"
        return 1
    fi
    
    echo "" > "$working_urls"
    local tested_count=0
    local working_count=0
    
    # Tester les URLs (limité à 100 pour éviter la surcharge)
    while IFS= read -r url && [ $tested_count -lt 100 ]; do
        if [ -z "$url" ]; then
            continue
        fi
        
        tested_count=$((tested_count + 1))
        
        # Test rapide avec HEAD request
        if curl -s -I --max-time 5 "$url" | grep -q "200 OK\|Content-Type.*font"; then
            echo "✅ URL fonctionnelle: $url"
            echo "$url" >> "$working_urls"
            working_count=$((working_count + 1))
        fi
        
    done < "$patterns_file"
    
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

# Fonction pour télécharger les vrais fichiers de polices
download_real_font_files() {
    echo "📥 Téléchargement des vrais fichiers de polices..."
    
    local urls_file="$ANALYSIS_DIR/working-patterns.txt"
    
    if [ ! -f "$urls_file" ] || [ ! -s "$urls_file" ]; then
        echo "❌ Aucune URL de téléchargement disponible"
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
        
        # Télécharger avec retry et headers spécialisés
        if curl -s -L \
            -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" \
            -H "Accept: font/woff2,font/woff,font/otf,font/ttf,*/*" \
            -H "Referer: https://www.fontspring.com/" \
            -H "Origin: https://www.fontspring.com" \
            --max-time 60 \
            --retry 3 \
            --retry-delay 2 \
            --retry-max-time 180 \
            --compressed \
            -o "$DOWNLOAD_DIR/$filename" \
            "$url" 2>/dev/null; then
            
            if [ -s "$DOWNLOAD_DIR/$filename" ]; then
                echo "✅ Téléchargé: $filename ($(stat -f%z "$DOWNLOAD_DIR/$filename" 2>/dev/null || echo "unknown") bytes)"
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
    echo "   Tentatives: $total_count"
    echo "   Succès: $success_count"
    echo "   Échecs: $((total_count - success_count))"
    
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
    echo "🚀 Démarrage de l'extraction des vrais fichiers Foundation Sans..."
    
    # Étape 1: Analyse du système d'aperçu Fontspring
    if analyze_fontspring_preview; then
        echo "✅ Analyse du système d'aperçu réussie"
        extract_preview_urls
        analyze_preview_apis
        extract_font_urls_from_apis
    else
        echo "⚠️ Analyse du système d'aperçu échouée"
    fi
    
    # Étape 2: Génération de patterns
    generate_fontspring_patterns
    test_generated_patterns
    
    # Étape 3: Téléchargement
    if [ -f "$ANALYSIS_DIR/working-patterns.txt" ] && [ -s "$ANALYSIS_DIR/working-patterns.txt" ]; then
        download_real_font_files
        integrate_downloaded_fonts
    else
        echo "❌ Aucune URL de téléchargement disponible"
    fi
    
    # Étape 4: Résumé final
    echo ""
    echo "📊 Résumé de l'extraction des vrais fichiers:"
    echo "============================================="
    echo "📁 Fichiers téléchargés: $(ls -1 "$DOWNLOAD_DIR" 2>/dev/null | wc -l)"
    echo "📁 Fichiers intégrés: $(ls -1 "$FONTS_DIR" 2>/dev/null | wc -l)"
    echo "📄 Fichiers d'analyse: $(ls -1 "$ANALYSIS_DIR" 2>/dev/null | wc -l)"
    
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
echo "✨ Extraction des vrais fichiers Foundation Sans terminée!"
echo "========================================================"
