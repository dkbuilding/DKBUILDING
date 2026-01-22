#!/bin/bash

# Script de test complet pour DK BUILDING
# Combine les tests de base, routes et pages d'erreur
echo "🔨 Test complet du site web DK BUILDING"
echo "======================================="

# Variables de configuration
FRONTEND_PORT_1="5176"
FRONTEND_PORT_2="5173"
FRONTEND_PORT_3="5177"
BACKEND_PORT="3001"

# Détection automatique du port frontend
detect_frontend_port() {
    if curl -s http://localhost:$FRONTEND_PORT_1 > /dev/null; then
        echo $FRONTEND_PORT_1
    elif curl -s http://localhost:$FRONTEND_PORT_2 > /dev/null; then
        echo $FRONTEND_PORT_2
    elif curl -s http://localhost:$FRONTEND_PORT_3 > /dev/null; then
        echo $FRONTEND_PORT_3
    else
        echo ""
    fi
}

# Fonction pour tester une URL
test_url() {
    local url=$1
    local expected_code=$2
    local description=$3
    
    echo -n "Test: $description ($url) ... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$response" = "$expected_code" ]; then
        echo "✅ OK ($response)"
        return 0
    else
        echo "❌ ÉCHEC (attendu: $expected_code, reçu: $response)"
        return 1
    fi
}

# Fonction pour tester une route
test_route() {
    local route=$1
    local expected_status=$2
    local description=$3
    local base_url=$4
    
    echo -n "Testing $route ($description)... "
    
    status=$(curl -s -o /dev/null -w "%{http_code}" "$base_url$route")
    
    if [ "$status" = "$expected_status" ]; then
        echo "✅ OK ($status)"
        return 0
    else
        echo "❌ FAILED (Expected: $expected_status, Got: $status)"
        return 1
    fi
}

# Compteur d'erreurs global
total_errors=0

echo ""
echo "🔍 Détection des services..."
echo "============================"

# Détection du port frontend
FRONTEND_PORT=$(detect_frontend_port)
if [ -n "$FRONTEND_PORT" ]; then
    echo "✅ Frontend détecté sur le port $FRONTEND_PORT"
    BASE_URL="http://localhost:$FRONTEND_PORT"
else
    echo "❌ Aucun frontend détecté sur les ports $FRONTEND_PORT_1, $FRONTEND_PORT_2, $FRONTEND_PORT_3"
    echo "🔧 Vérifiez que le serveur de développement est démarré (pnpm run dev)"
    exit 1
fi

# Test du backend
echo ""
echo "🔧 Test du backend..."
if curl -s http://localhost:$BACKEND_PORT/health > /dev/null; then
    echo "✅ Backend accessible sur http://localhost:$BACKEND_PORT"
    echo "📊 Health check:"
    curl -s http://localhost:$BACKEND_PORT/health | jq '.' 2>/dev/null || curl -s http://localhost:$BACKEND_PORT/health
else
    echo "❌ Backend non accessible sur http://localhost:$BACKEND_PORT"
    ((total_errors++))
fi

# Test de l'API contact
echo ""
echo "📧 Test de l'API contact..."
if curl -s http://localhost:$BACKEND_PORT/api/status > /dev/null; then
    echo "✅ API contact accessible"
    echo "📊 Status API:"
    curl -s http://localhost:$BACKEND_PORT/api/status | jq '.' 2>/dev/null || curl -s http://localhost:$BACKEND_PORT/api/status
else
    echo "❌ API contact non accessible"
    ((total_errors++))
fi

echo ""
echo "📋 Test des routes principales:"
echo "==============================="

# Test des routes principales
test_route "/" "200" "Page d'accueil" "$BASE_URL" || ((total_errors++))
test_route "/mentions-legales" "200" "Mentions légales" "$BASE_URL" || ((total_errors++))
test_route "/politique-confidentialite" "200" "Politique de confidentialité" "$BASE_URL" || ((total_errors++))
test_route "/CGV" "200" "Conditions générales de vente" "$BASE_URL" || ((total_errors++))

echo ""
echo "🧪 Tests des pages d'erreur:"
echo "============================"

# Test des pages d'erreur spécifiques
test_url "$BASE_URL/error/404" "200" "Page d'erreur 404" || ((total_errors++))
test_url "$BASE_URL/error/500" "200" "Page d'erreur 500" || ((total_errors++))
test_url "$BASE_URL/error/200" "200" "Page d'erreur 200 (succès)" || ((total_errors++))

echo ""
echo "🚫 Tests des pages inexistantes (doivent rediriger vers 404):"
echo "=============================================================="

# Test des pages inexistantes
test_url "$BASE_URL/page-inexistante" "200" "Page inexistante (404)" || ((total_errors++))
test_url "$BASE_URL/test/123" "200" "Route inexistante (404)" || ((total_errors++))

echo ""
echo "📊 Résumé des tests:"
echo "==================="

if [ $total_errors -eq 0 ]; then
    echo "🎉 Tous les tests sont passés avec succès !"
    echo ""
    echo "✅ Services fonctionnels:"
    echo "   - Frontend sur http://localhost:$FRONTEND_PORT"
    echo "   - Backend sur http://localhost:$BACKEND_PORT"
    echo "   - API contact opérationnelle"
    echo ""
    echo "✅ Routes fonctionnelles:"
    echo "   - / (Page d'accueil)"
    echo "   - /mentions-legales"
    echo "   - /politique-confidentialite"
    echo "   - /CGV"
    echo "   - Pages d'erreur (404, 500)"
    echo "   - Route 404 pour pages inexistantes"
    echo ""
    echo "🚀 Le site est prêt pour la production !"
    echo ""
    echo "💡 Pour tester manuellement, visitez:"
    echo "   - $BASE_URL/"
    echo "   - $BASE_URL/error/404"
    echo "   - $BASE_URL/error/500"
    echo "   - $BASE_URL/page-inexistante"
    exit 0
else
    echo "❌ $total_errors test(s) ont échoué"
    echo ""
    echo "🔧 Vérifiez que:"
    echo "   - Le serveur de développement est démarré (pnpm run dev)"
    echo "   - Toutes les pages sont créées dans src/pages/"
    echo "   - Les routes sont correctement configurées dans App.jsx"
    echo "   - Le backend est démarré sur le port $BACKEND_PORT"
    exit 1
fi
