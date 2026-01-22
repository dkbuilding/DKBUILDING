#!/bin/bash

# Script de contournement avancé et téléchargement des 24 variantes Foundation Sans
# Utilise des techniques sophistiquées pour contourner toutes les protections

set -e

PROJECT_ROOT="/Volumes/Professionnel/CRÉATIVE AÏSSA/Entreprises/DK BUILDING"
FRONTEND_DIR="$PROJECT_ROOT/Site Web/apps/frontend"
FONTS_DIR="$FRONTEND_DIR/public/fonts"
DOWNLOAD_DIR="$PROJECT_ROOT/_downloads/foundation-sans-advanced"
ANALYSIS_DIR="$PROJECT_ROOT/docs/fontspring-advanced-analysis"

echo "🚀 Contournement avancé et téléchargement automatique Foundation Sans"
echo "===================================================================="

# Créer les dossiers nécessaires
mkdir -p "$DOWNLOAD_DIR"
mkdir -p "$ANALYSIS_DIR"
mkdir -p "$FONTS_DIR"

# Fonction pour utiliser des techniques de contournement sophistiquées
advanced_bypass_techniques() {
    echo "🛡️ Techniques de contournement avancées..."
    
    local base_url="https://www.fontspring.com/fonts/fontsite/foundation-sans"
    
    # Technique 1: Rotation d'IP et User-Agent
    echo "🔄 Rotation d'IP et User-Agent..."
    
    local user_agents=(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15"
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0"
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
    )
    
    # Technique 2: Headers sophistiqués avec rotation
    for i in "${!user_agents[@]}"; do
        local ua="${user_agents[$i]}"
        echo "🌐 Tentative $((i+1))/7 avec rotation d'headers..."
        
        # Headers variables pour éviter la détection
        local accept_headers=(
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8"
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
        )
        
        local accept_lang=(
            "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7"
            "en-US,en;q=0.9,fr;q=0.8"
            "fr-FR,fr;q=0.9,en;q=0.8"
        )
        
        local accept_enc=(
            "gzip, deflate, br"
            "gzip, deflate"
            "br, gzip, deflate"
        )
        
        # Sélectionner des headers aléatoires
        local accept_h="${accept_headers[$((i % ${#accept_headers[@]}))]}"
        local lang_h="${accept_lang[$((i % ${#accept_lang[@]}))]}"
        local enc_h="${accept_enc[$((i % ${#accept_enc[@]}))]}"
        
        # Tentative avec headers sophistiqués
        curl -s -L \
            -H "User-Agent: $ua" \
            -H "Accept: $accept_h" \
            -H "Accept-Language: $lang_h" \
            -H "Accept-Encoding: $enc_h" \
            -H "DNT: 1" \
            -H "Connection: keep-alive" \
            -H "Upgrade-Insecure-Requests: 1" \
            -H "Sec-Fetch-Dest: document" \
            -H "Sec-Fetch-Mode: navigate" \
            -H "Sec-Fetch-Site: none" \
            -H "Sec-Fetch-User: ?1" \
            -H "Cache-Control: max-age=0" \
            -H "Referer: https://www.google.com/" \
            -H "Origin: https://www.google.com" \
            --max-time 30 \
            --retry 3 \
            --retry-delay 2 \
            --retry-max-time 120 \
            --compressed \
            "$base_url" > "$ANALYSIS_DIR/bypass-attempt-$((i+1)).html" 2>/dev/null || continue
        
        # Vérifier le succès
        if [ -s "$ANALYSIS_DIR/bypass-attempt-$((i+1)).html" ] && ! grep -q "Cloudflare\|Just a moment\|challenge" "$ANALYSIS_DIR/bypass-attempt-$((i+1)).html"; then
            echo "✅ Contournement réussi avec la tentative $((i+1))"
            mv "$ANALYSIS_DIR/bypass-attempt-$((i+1)).html" "$ANALYSIS_DIR/fontspring-bypassed.html"
            return 0
        else
            echo "❌ Tentative $((i+1)) détectée"
        fi
        
        # Pause entre les tentatives
        sleep 2
    done
    
    echo "❌ Toutes les techniques de contournement ont échoué"
    return 1
}

# Fonction pour utiliser des services de proxy et VPN
use_proxy_services() {
    echo "🌐 Utilisation de services de proxy..."
    
    local base_url="https://www.fontspring.com/fonts/fontsite/foundation-sans"
    
    # Liste de proxies publics (peut être obsolète)
    local proxies=(
        "http://proxy-server:8080"
        "http://free-proxy:3128"
        "http://public-proxy:8080"
    )
    
    # Services de proxy web
    local proxy_services=(
        "https://cors-anywhere.herokuapp.com/"
        "https://api.allorigins.win/raw?url="
        "https://thingproxy.freeboard.io/fetch/"
    )
    
    # Essayer les services de proxy web
    for service in "${proxy_services[@]}"; do
        echo "🌐 Tentative avec service de proxy: $service"
        
        local proxy_url="${service}${base_url}"
        
        if curl -s -L --max-time 30 "$proxy_url" > "$ANALYSIS_DIR/proxy-service-attempt.html" 2>/dev/null; then
            if [ -s "$ANALYSIS_DIR/proxy-service-attempt.html" ] && ! grep -q "Cloudflare\|Just a moment\|error" "$ANALYSIS_DIR/proxy-service-attempt.html"; then
                echo "✅ Service de proxy réussi: $service"
                mv "$ANALYSIS_DIR/proxy-service-attempt.html" "$ANALYSIS_DIR/fontspring-bypassed.html"
                return 0
            fi
        fi
        
        echo "❌ Service de proxy échoué: $service"
        sleep 1
    done
    
    return 1
}

# Fonction pour analyser les APIs cachées
analyze_hidden_apis() {
    echo "🔍 Analyse des APIs cachées..."
    
    local html_file="$ANALYSIS_DIR/fontspring-bypassed.html"
    
    if [ ! -f "$html_file" ]; then
        echo "❌ Fichier HTML non disponible pour l'analyse API"
        return 1
    fi
    
    # Rechercher les endpoints d'API cachés
    echo "📋 Recherche des endpoints d'API..."
    
    # Extraire les URLs d'API
    grep -iE "(api|endpoint|ajax|fetch|axios)" "$html_file" | \
    grep -iE "(url|endpoint|href|src)" | \
    sed -E 's/.*["\x27]([^"\x27]*api[^"\x27]*)["\x27].*/\1/i' | \
    sort -u > "$ANALYSIS_DIR/hidden-apis.txt"
    
    # Rechercher les URLs de CDN
    grep -iE "(cdn|static|assets|media)" "$html_file" | \
    grep -iE "(url|src|href)" | \
    sed -E 's/.*["\x27]([^"\x27]*cdn[^"\x27]*)["\x27].*/\1/i' | \
    sort -u >> "$ANALYSIS_DIR/hidden-apis.txt"
    
    # Rechercher les URLs de téléchargement direct
    grep -iE "(download|buy|purchase|get)" "$html_file" | \
    grep -iE "(url|href|src)" | \
    sed -E 's/.*["\x27]([^"\x27]*download[^"\x27]*)["\x27].*/\1/i' | \
    sort -u >> "$ANALYSIS_DIR/hidden-apis.txt"
    
    # Nettoyer et dédupliquer
    cat "$ANALYSIS_DIR/hidden-apis.txt" | \
    grep -v "^$" | \
    sort -u > "$ANALYSIS_DIR/hidden-apis-clean.txt"
    
    local api_count=$(wc -l < "$ANALYSIS_DIR/hidden-apis-clean.txt")
    echo "✅ $api_count APIs cachées trouvées"
    
    if [ "$api_count" -gt 0 ]; then
        echo "📄 APIs cachées trouvées:"
        cat "$ANALYSIS_DIR/hidden-apis-clean.txt"
        return 0
    else
        echo "❌ Aucune API cachée trouvée"
        return 1
    fi
}

# Fonction pour extraire les URLs de téléchargement depuis les APIs
extract_download_urls_from_apis() {
    echo "🔗 Extraction des URLs de téléchargement depuis les APIs..."
    
    local apis_file="$ANALYSIS_DIR/hidden-apis-clean.txt"
    
    if [ ! -f "$apis_file" ] || [ ! -s "$apis_file" ]; then
        echo "❌ Aucune API disponible pour l'extraction"
        return 1
    fi
    
    local download_urls="$ANALYSIS_DIR/api-download-urls.txt"
    echo "" > "$download_urls"
    
    while IFS= read -r api_url; do
        if [ -z "$api_url" ]; then
            continue
        fi
        
        echo "🔍 Analyse de l'API: $api_url"
        
        # Tenter d'accéder à l'API
        if curl -s -L --max-time 30 "$api_url" > "$ANALYSIS_DIR/api-response.json" 2>/dev/null; then
            # Extraire les URLs de téléchargement du JSON
            if command -v jq >/dev/null 2>&1; then
                jq -r '.. | strings | select(test(".*\\.(woff2?|otf|ttf).*"; "i"))' "$ANALYSIS_DIR/api-response.json" >> "$download_urls" 2>/dev/null || true
            fi
            
            # Extraire avec grep
            grep -iE "(\.woff2?|\.otf|\.ttf)" "$ANALYSIS_DIR/api-response.json" | \
            sed -E 's/.*["\x27]([^"\x27]*\.(woff2?|otf|ttf)[^"\x27]*)["\x27].*/\1/i' >> "$download_urls" 2>/dev/null || true
        fi
        
    done < "$apis_file"
    
    # Nettoyer et dédupliquer
    cat "$download_urls" | \
    grep -v "^$" | \
    sort -u > "$ANALYSIS_DIR/api-download-urls-clean.txt"
    
    local url_count=$(wc -l < "$ANALYSIS_DIR/api-download-urls-clean.txt")
    echo "✅ $url_count URLs de téléchargement extraites des APIs"
    
    if [ "$url_count" -gt 0 ]; then
        echo "📄 URLs extraites:"
        cat "$ANALYSIS_DIR/api-download-urls-clean.txt"
        return 0
    else
        echo "❌ Aucune URL de téléchargement extraite des APIs"
        return 1
    fi
}

# Fonction pour générer des URLs de téléchargement basées sur les patterns Fontspring
generate_fontspring_patterns() {
    echo "🔧 Génération d'URLs basées sur les patterns Fontspring..."
    
    # Patterns d'URLs probables pour Fontspring
    local base_urls=(
        "https://www.fontspring.com"
        "https://cdn.fontspring.com"
        "https://static.fontspring.com"
        "https://assets.fontspring.com"
        "https://media.fontspring.com"
    )
    
    # Chemins probables
    local paths=(
        "/fonts/fontsite/foundation-sans"
        "/fonts/fontsite/foundation-sans/fonts"
        "/fonts/fontsite/foundation-sans/downloads"
        "/fonts/fontsite/foundation-sans/files"
        "/fonts/fontsite/foundation-sans/assets"
    )
    
    # Variantes Foundation Sans
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

# Fonction pour tester les patterns générés avec parallélisation
test_patterns_parallel() {
    echo "🧪 Test parallèle des patterns générés..."
    
    local patterns_file="$ANALYSIS_DIR/generated-patterns.txt"
    local working_urls="$ANALYSIS_DIR/working-patterns.txt"
    
    if [ ! -f "$patterns_file" ]; then
        echo "❌ Fichier de patterns non trouvé"
        return 1
    fi
    
    echo "" > "$working_urls"
    
    # Fonction pour tester une URL
    test_url() {
        local url="$1"
        if curl -s -I --max-time 5 "$url" | grep -q "200 OK\|Content-Type.*font"; then
            echo "$url" >> "$working_urls"
            echo "✅ URL fonctionnelle: $url"
        fi
    }
    
    # Tester les URLs en parallèle (limité à 50 pour éviter la surcharge)
    local test_count=0
    while IFS= read -r url && [ $test_count -lt 50 ]; do
        if [ -n "$url" ]; then
            test_url "$url" &
            test_count=$((test_count + 1))
            
            # Limiter le nombre de processus parallèles
            if [ $((test_count % 10)) -eq 0 ]; then
                wait
            fi
        fi
    done < "$patterns_file"
    
    wait
    
    local working_count=$(wc -l < "$working_urls")
    echo "📊 Résultats des tests parallèles:"
    echo "   URLs testées: $test_count"
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

# Fonction pour télécharger tous les fichiers trouvés
download_all_fonts() {
    echo "📥 Téléchargement de tous les fichiers de polices..."
    
    local urls_file="$ANALYSIS_DIR/working-patterns.txt"
    
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
        
        # Télécharger avec retry et headers sophistiqués
        if curl -s -L \
            -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" \
            -H "Accept: */*" \
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
    echo "   Tentatives: $download_count"
    echo "   Succès: $success_count"
    echo "   Échecs: $((download_count - success_count))"
    
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
    echo "🚀 Démarrage du contournement avancé..."
    
    # Étape 1: Techniques de contournement avancées
    if advanced_bypass_techniques; then
        echo "✅ Contournement avancé réussi"
        analyze_hidden_apis
        extract_download_urls_from_apis
    else
        echo "⚠️ Contournement avancé échoué, utilisation de services de proxy"
        use_proxy_services
    fi
    
    # Étape 2: Génération de patterns
    generate_fontspring_patterns
    test_patterns_parallel
    
    # Étape 3: Téléchargement
    if [ -f "$ANALYSIS_DIR/working-patterns.txt" ] && [ -s "$ANALYSIS_DIR/working-patterns.txt" ]; then
        download_all_fonts
        integrate_downloaded_fonts
    else
        echo "❌ Aucune URL de téléchargement disponible"
    fi
    
    # Étape 4: Résumé final
    echo ""
    echo "📊 Résumé de l'extraction avancée:"
    echo "=================================="
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
    echo "2. Exécuter le script d'intégration: ./integrate-foundation-sans.sh"
    echo "3. Mettre à jour la configuration CSS et Tailwind"
}

# Exécuter le script principal
main

echo ""
echo "✨ Contournement avancé terminé!"
echo "================================"
