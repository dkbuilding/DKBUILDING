#!/bin/bash

# Script de démarrage pour DK BUILDING
# Lance le frontend, le backend et expose le frontend via Cloudflare Tunnel

clear

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ASCII ART
echo ""
echo -e "${YELLOW} ____  _  __  ____  _   _ ___ _     ____ ___ _   _  ____ ${NC}"
echo -e "${YELLOW}|  _ \| |/ / | __ )| | | |_ _| |   |  _ \_ _| \ | |/ ___|${NC}"
echo -e "${YELLOW}| | | | ' /  |  _ \| | | || || |   | | | | ||  \| | |  _ ${NC}"
echo -e "${YELLOW}| |_| | . \  | |_) | |_| || || |___| |_| | || |\  | |_| |${NC}"
echo -e "${YELLOW}|____/|_|\_\ |____/ \___/|___|_____|____/___|_| \_|\____|${NC}"
echo ""

# Titre
echo ""
echo -e "🏗️  Démarrage de ${YELLOW}DK BUILDING${NC}"
echo "================================"
echo ""

# Fonction pour afficher les logs avec couleur
log() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    error "Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier que pnpm est installé (priorité) ou npm (fallback)
if command -v pnpm &> /dev/null; then
    PACKAGE_MANAGER="pnpm"
    success "pnpm détecté - utilisation de pnpm"
elif command -v npm &> /dev/null; then
    PACKAGE_MANAGER="npm"
    warning "pnpm n'est pas installé - utilisation de npm (fallback)"
else
    error "Ni pnpm ni npm ne sont installés. Veuillez installer pnpm ou npm."
    exit 1
fi

# Chemin vers le projet (utilise pwd pour être dynamique)
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_DIR="$PROJECT_ROOT/apps/frontend"
BACKEND_DIR="$PROJECT_ROOT/apps/backend"

# Charger les variables d'environnement
# Backend
if [ -f "$BACKEND_DIR/.env" ]; then
    source "$BACKEND_DIR/.env"
fi

# Frontend
if [ -f "$FRONTEND_DIR/.env" ]; then
    source "$FRONTEND_DIR/.env"
fi

# Variables de port avec valeurs par défaut
BACKEND_PORT=${BACKEND_PORT:-3001}
FRONTEND_PORT=${FRONTEND_PORT:-5173}

# Variable pour le tunnel (optionnel)
ENABLE_TUNNEL=${ENABLE_TUNNEL:-true}
TUNNEL_HOSTNAME=${TUNNEL_HOSTNAME:-""}

# Vérifier que les dossiers existent
if [ ! -d "$FRONTEND_DIR" ]; then
    error "Le dossier frontend n'existe pas: $FRONTEND_DIR"
    exit 1
fi

if [ ! -d "$BACKEND_DIR" ]; then
    error "Le dossier backend n'existe pas: $BACKEND_DIR"
    exit 1
fi

log "Installation des dépendances..."

# Fonction pour vérifier la sécurité des dépendances
check_security() {
    local DIR=$1
    local NAME=$2
    
    log "Vérification de la sécurité des dépendances $NAME..."
    cd "$DIR"
    
    # Afficher les informations de financement (npm uniquement)
    if [ "$PACKAGE_MANAGER" = "npm" ]; then
        log "Affichage des informations de financement ($NAME)..."
        npm fund 2>/dev/null || warning "Impossible d'afficher les informations de financement"
    fi
    
    # Vérifier les vulnérabilités
    log "Vérification des vulnérabilités ($NAME)..."
    if [ "$PACKAGE_MANAGER" = "pnpm" ]; then
        if pnpm audit --audit-level=moderate 2>/dev/null; then
            success "Aucune vulnérabilité critique détectée ($NAME)"
        else
            warning "Vulnérabilités détectées dans $NAME. Tentative de correction automatique..."
            if pnpm audit --fix 2>/dev/null; then
                success "Vulnérabilités corrigées automatiquement ($NAME)"
            else
                warning "Certaines vulnérabilités n'ont pas pu être corrigées automatiquement ($NAME)"
                warning "Vérifiez manuellement avec: cd $DIR && pnpm audit"
            fi
        fi
    else
        if npm audit --audit-level=moderate 2>/dev/null; then
            success "Aucune vulnérabilité critique détectée ($NAME)"
        else
            warning "Vulnérabilités détectées dans $NAME. Tentative de correction automatique..."
            if npm audit fix --force 2>/dev/null; then
                success "Vulnérabilités corrigées automatiquement ($NAME)"
            else
                warning "Certaines vulnérabilités n'ont pas pu être corrigées automatiquement ($NAME)"
                warning "Vérifiez manuellement avec: cd $DIR && npm audit"
            fi
        fi
    fi
}

# Installer les dépendances frontend
log "Installation des dépendances frontend avec $PACKAGE_MANAGER..."
cd "$FRONTEND_DIR"
if $PACKAGE_MANAGER install; then
    success "Dépendances frontend installées"
else
    error "Échec de l'installation des dépendances frontend"
    exit 1
fi

# Vérifier la sécurité frontend
check_security "$FRONTEND_DIR" "frontend"

# Installer les dépendances backend
log "Installation des dépendances backend avec $PACKAGE_MANAGER..."
cd "$BACKEND_DIR"
if $PACKAGE_MANAGER install; then
    success "Dépendances backend installées"
else
    error "Échec de l'installation des dépendances backend"
    exit 1
fi

# Vérifier la sécurité backend
check_security "$BACKEND_DIR" "backend"

# Vérifier si le fichier .env existe dans le backend
if [ ! -f "$BACKEND_DIR/.env" ]; then
    warning "Fichier .env manquant dans le backend"
    log "Copie du fichier d'exemple..."
    cp "$BACKEND_DIR/env.example" "$BACKEND_DIR/.env"
    warning "Veuillez configurer les variables d'environnement dans $BACKEND_DIR/.env"
fi

log "Démarrage des serveurs..."

# Variables pour les PIDs
FRONTEND_PID=""
BACKEND_PID=""
TUNNEL_PID=""
TUNNEL_URL=""

# Fonction pour installer cloudflared selon le système d'exploitation
install_cloudflared() {
    log "📦 Installation de cloudflared..."
    
    local OS="$(uname -s)"
    
    if [[ "$OS" == "Darwin" ]]; then
        # macOS - utiliser Homebrew
        log "🍺 Installation via Homebrew..."
        if command -v brew &> /dev/null; then
            if brew install cloudflared; then
                success "cloudflared installé avec succès via Homebrew"
                return 0
            else
                error "Échec de l'installation via Homebrew"
                return 1
            fi
        else
            error "Homebrew n'est pas installé"
            warning "Installez Homebrew d'abord : /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
            return 1
        fi
    elif [[ "$OS" == "Linux" ]]; then
        # Linux - essayer plusieurs méthodes
        log "🐧 Installation pour Linux..."
        
        # Essayer avec apt (Debian/Ubuntu)
        if command -v apt-get &> /dev/null; then
            log "Tentative d'installation via apt-get..."
            if sudo apt-get update && sudo apt-get install -y cloudflared; then
                success "cloudflared installé avec succès via apt-get"
                return 0
            fi
        fi
        
        # Essayer avec yum (RHEL/CentOS)
        if command -v yum &> /dev/null; then
            log "Tentative d'installation via yum..."
            if sudo yum install -y cloudflared; then
                success "cloudflared installé avec succès via yum"
                return 0
            fi
        fi
        
        # Essayer avec dnf (Fedora)
        if command -v dnf &> /dev/null; then
            log "Tentative d'installation via dnf..."
            if sudo dnf install -y cloudflared; then
                success "cloudflared installé avec succès via dnf"
                return 0
            fi
        fi
        
        error "Aucun gestionnaire de paquets compatible trouvé"
        warning "Installation manuelle requise :"
        warning "   Téléchargez depuis https://github.com/cloudflare/cloudflared/releases"
        return 1
    elif [[ "$OS" == *"MINGW"* ]] || [[ "$OS" == *"MSYS"* ]] || [[ "$OS" == *"CYGWIN"* ]]; then
        # Windows - utiliser winget
        log "🪟 Installation via winget..."
        if command -v winget &> /dev/null; then
            if winget install --id Cloudflare.cloudflared --accept-source-agreements --accept-package-agreements; then
                success "cloudflared installé avec succès via winget"
                return 0
            else
                error "Échec de l'installation via winget"
                return 1
            fi
        else
            error "winget n'est pas disponible"
            warning "Installez manuellement depuis https://github.com/cloudflare/cloudflared/releases"
            return 1
        fi
    else
        error "Système d'exploitation non supporté: $OS"
        warning "Installation manuelle requise depuis https://github.com/cloudflare/cloudflared/releases"
        return 1
    fi
}

# Fonction pour créer le tunnel Cloudflare
create_tunnel() {
    if [ "$ENABLE_TUNNEL" != "true" ]; then
        log "Tunnel désactivé (ENABLE_TUNNEL=false)"
        return 0
    fi
    
    log "Création du tunnel Cloudflare pour le frontend..."
    
    # Vérifier que cloudflared est installé
    if ! command -v cloudflared &> /dev/null; then
        warning "cloudflared n'est pas installé"
        log "🔄 Tentative d'installation automatique..."
        
        if install_cloudflared; then
            # Vérifier à nouveau après installation
            sleep 2
            if command -v cloudflared &> /dev/null; then
                success "cloudflared est maintenant disponible !"
            else
                error "cloudflared n'est toujours pas disponible après installation"
                warning "Installation manuelle requise :"
                warning "   macOS: brew install cloudflared"
                warning "   Linux: Téléchargez depuis https://github.com/cloudflare/cloudflared/releases"
                warning "   Windows: winget install --id Cloudflare.cloudflared"
                return 1
            fi
        else
            error "Échec de l'installation automatique"
            warning "Installation manuelle requise :"
            warning "   macOS: brew install cloudflared"
            warning "   Linux: Téléchargez depuis https://github.com/cloudflare/cloudflared/releases"
            warning "   Windows: winget install --id Cloudflare.cloudflared"
            return 1
        fi
    fi
    
    # Attendre que le frontend soit prêt
    sleep 5
    
    # Utiliser le script Node.js pour créer le tunnel de manière plus fiable
    local TUNNEL_SCRIPT="$FRONTEND_DIR/scripts/tunnel.js"
    
    # Vérifier si le script existe
    if [ -f "$TUNNEL_SCRIPT" ]; then
        # Utiliser le script Node.js avec les variables d'environnement
        export PORT=$FRONTEND_PORT
        if [ -n "$TUNNEL_HOSTNAME" ]; then
            export TUNNEL_HOSTNAME=$TUNNEL_HOSTNAME
        fi
        
        # Lancer le script en arrière-plan et capturer l'URL
        node "$TUNNEL_SCRIPT" > /tmp/tunnel_output.log 2>&1 &
        TUNNEL_PID=$!
    else
        # Fallback: utiliser cloudflared directement
        local TUNNEL_CMD="cloudflared tunnel --url http://localhost:$FRONTEND_PORT"
        if [ -n "$TUNNEL_HOSTNAME" ]; then
            TUNNEL_CMD="$TUNNEL_CMD --hostname $TUNNEL_HOSTNAME"
        fi
        
        $TUNNEL_CMD > /tmp/tunnel_output.log 2>&1 &
        TUNNEL_PID=$!
    fi
    
    # Attendre que le tunnel soit créé et extraire l'URL
    sleep 6
    
    # Essayer de lire l'URL depuis le fichier sauvegardé par le script Node.js
    if [ -f /tmp/tunnel_url.txt ]; then
        TUNNEL_URL=$(cat /tmp/tunnel_url.txt 2>/dev/null | head -1)
        rm -f /tmp/tunnel_url.txt 2>/dev/null || true
    fi
    
    # Si pas trouvé dans le fichier, essayer d'extraire depuis les logs
    if [ -z "$TUNNEL_URL" ] && [ -f /tmp/tunnel_output.log ]; then
        TUNNEL_URL=$(grep -oE 'https://[a-zA-Z0-9-]+\.trycloudflare\.com' /tmp/tunnel_output.log | head -1)
        # Si pas trouvé, essayer un autre format
        if [ -z "$TUNNEL_URL" ]; then
            TUNNEL_URL=$(grep -oE 'https://[^[:space:]]*\.trycloudflare\.com' /tmp/tunnel_output.log | head -1)
        fi
    fi
    
    # Vérifier que le processus tunnel est toujours actif
    if kill -0 $TUNNEL_PID 2>/dev/null; then
        if [ -n "$TUNNEL_URL" ]; then
            success "Tunnel créé avec succès: $TUNNEL_URL"
        else
            warning "Tunnel démarré mais URL non récupérée. Vérifiez /tmp/tunnel_output.log"
            log "Le tunnel fonctionne mais l'URL n'a pas pu être extraite automatiquement"
        fi
    else
        error "Échec du démarrage du tunnel"
        if [ -f /tmp/tunnel_output.log ]; then
            log "Logs du tunnel:"
            tail -20 /tmp/tunnel_output.log
        fi
        return 1
    fi
}

# Fonction pour nettoyer les processus en arrière-plan
cleanup() {
    log "Arrêt des serveurs..."
    
    # Arrêter le tunnel
    if [ -n "$TUNNEL_PID" ]; then
        kill $TUNNEL_PID 2>/dev/null || true
    fi
    
    # Arrêter les serveurs
    if [ -n "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    
    if [ -n "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    
    # Nettoyer les fichiers temporaires du tunnel
    rm -f /tmp/tunnel_output.log /tmp/tunnel_url.txt 2>/dev/null || true
    
    exit 0
}

# Capturer les signaux d'arrêt
trap cleanup SIGINT SIGTERM

# Fonction pour vérifier et libérer un port
check_and_free_port() {
    local port=$1
    local service_name=$2
    
    if lsof -i :$port >/dev/null 2>&1; then
        warning "Le port $port ($service_name) est déjà utilisé"
        log "Tentative de libération du port $port..."
        
        # Essayer d'identifier et arrêter le processus
        local pid=$(lsof -ti :$port 2>/dev/null | head -1)
        if [ -n "$pid" ]; then
            log "Arrêt du processus (PID: $pid) utilisant le port $port..."
            kill $pid 2>/dev/null || true
            sleep 2
            
            # Vérifier que le port est libéré
            if lsof -i :$port >/dev/null 2>&1; then
                warning "Le port $port est toujours utilisé. Arrêt forcé..."
                kill -9 $pid 2>/dev/null || true
                sleep 1
            fi
        fi
        
        # Vérification finale
        if lsof -i :$port >/dev/null 2>&1; then
            error "Impossible de libérer le port $port"
            error "Arrêtez manuellement le processus utilisant le port $port"
            return 1
        else
            success "Port $port libéré avec succès"
        fi
    else
        log "Port $port disponible"
    fi
    
    return 0
}

# Vérifier si les ports sont disponibles
log "Vérification des ports..."

# Vérifier le port backend
if ! check_and_free_port $BACKEND_PORT "backend"; then
    exit 1
fi

# Vérifier le port frontend
if ! check_and_free_port $FRONTEND_PORT "frontend"; then
    exit 1
fi

# Fonction pour vérifier la santé du backend
check_backend_health() {
    local max_attempts=30
    local attempt=1
    local backend_url="http://localhost:$BACKEND_PORT"
    
    log "Vérification de la santé du backend..."
    
    # Vérifier que curl est disponible
    if ! command -v curl &> /dev/null; then
        warning "curl n'est pas installé, utilisation d'une vérification basique"
        # Fallback: juste vérifier que le processus est actif
        sleep 5
        if kill -0 $BACKEND_PID 2>/dev/null; then
            success "Backend démarré (vérification basique - curl non disponible)"
            return 0
        else
            error "Le processus backend s'est arrêté"
            return 1
        fi
    fi
    
    while [ $attempt -le $max_attempts ]; do
        # Vérifier que le processus backend est toujours actif
        if ! kill -0 $BACKEND_PID 2>/dev/null; then
            error "Le processus backend s'est arrêté (PID: $BACKEND_PID)"
            return 1
        fi
        
        # Essayer de contacter l'endpoint racine du backend
        if curl -s -f -m 2 "$backend_url/" > /dev/null 2>&1; then
            success "Backend accessible et répond correctement (tentative $attempt/$max_attempts)"
            
            # Vérifier également l'endpoint de statut si disponible
            if curl -s -f -m 2 "$backend_url/api/contact/status" > /dev/null 2>&1; then
                log "Endpoint de statut contact accessible"
            fi
            
            # Afficher les informations du backend
            local backend_info=$(curl -s -m 2 "$backend_url/" 2>/dev/null)
            if [ -n "$backend_info" ]; then
                log "Backend API version: $(echo "$backend_info" | grep -o '"version":"[^"]*"' | cut -d'"' -f4 || echo 'N/A')"
            fi
            
            return 0
        fi
        
        if [ $attempt -eq 1 ]; then
            log "Attente du démarrage du backend..."
        elif [ $((attempt % 5)) -eq 0 ]; then
            log "Tentative $attempt/$max_attempts - Le backend démarre..."
        fi
        
        sleep 1
        attempt=$((attempt + 1))
    done
    
    error "Le backend ne répond pas après $max_attempts tentatives"
    warning "Vérifiez les logs du backend pour plus d'informations"
    warning "URL attendue: $backend_url/"
    return 1
}

# Fonction pour vérifier la sécurité du backend
check_backend_security() {
    log "Vérification de la sécurité du backend..."
    
    # Recharger les variables d'environnement du backend si le fichier .env existe
    if [ -f "$BACKEND_DIR/.env" ]; then
        # Source le fichier .env pour charger les variables
        set -a
        source "$BACKEND_DIR/.env" 2>/dev/null || true
        set +a
    fi
    
    # Vérifier que les variables d'environnement critiques sont définies
    local security_vars=("JWT_SECRET" "JWT_SALT" "JWT_VERIFICATION_HASH")
    local missing_vars=()
    
    for var in "${security_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -gt 0 ]; then
        warning "Variables de sécurité manquantes: ${missing_vars[*]}"
        warning "Le backend peut ne pas fonctionner correctement sans ces variables"
        warning "Configurez ces variables dans $BACKEND_DIR/.env"
    else
        success "Variables de sécurité configurées"
        
        # Vérifier la longueur minimale des secrets (sécurité)
        if [ ${#JWT_SECRET} -lt 32 ]; then
            warning "JWT_SECRET semble trop court (minimum recommandé: 32 caractères)"
        fi
    fi
    
    # Vérifier que le port backend n'est pas exposé publiquement (sécurité)
    if command -v netstat &> /dev/null; then
        if netstat -an 2>/dev/null | grep -q ":$BACKEND_PORT.*LISTEN.*0.0.0.0"; then
            warning "Le backend écoute sur toutes les interfaces (0.0.0.0)"
            warning "Assurez-vous que le firewall bloque l'accès externe au port $BACKEND_PORT"
        else
            log "Backend configuré pour écouter localement uniquement"
        fi
    elif command -v lsof &> /dev/null; then
        # Alternative avec lsof
        if lsof -i :$BACKEND_PORT 2>/dev/null | grep -q "LISTEN"; then
            log "Backend configuré pour écouter sur le port $BACKEND_PORT"
        fi
    fi
    
    # Vérifier que NODE_ENV est défini
    if [ -z "$NODE_ENV" ]; then
        warning "NODE_ENV n'est pas défini (recommandé: 'development' ou 'production')"
    else
        log "NODE_ENV: $NODE_ENV"
    fi
}

# Démarrer le backend
log "Démarrage du backend (port $BACKEND_PORT)..."
cd "$BACKEND_DIR"

# Vérifier la sécurité avant le démarrage
check_backend_security

# Démarrer le backend en mode développement (avec nodemon pour le hot-reload)
# Utiliser 'dev' pour le hot-reload en développement, 'start' pour la production
# En développement, on préfère 'dev' pour avoir le hot-reload avec nodemon
if [ -f "$BACKEND_DIR/package.json" ]; then
    # Vérifier si le script 'dev' existe dans package.json
    if grep -q '"dev"' "$BACKEND_DIR/package.json"; then
        log "Démarrage du backend en mode développement (hot-reload activé)"
        $PACKAGE_MANAGER run dev &
    else
        log "Démarrage du backend en mode production"
        $PACKAGE_MANAGER start &
    fi
else
    error "package.json introuvable dans $BACKEND_DIR"
    exit 1
fi
BACKEND_PID=$!

# Attendre un peu que le backend démarre
sleep 3

# Vérifier que le processus backend est toujours actif
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    error "Échec du démarrage du backend (PID: $BACKEND_PID)"
    error "Le processus backend s'est arrêté immédiatement après le démarrage"
    log "Vérification des logs du backend..."
    cd "$BACKEND_DIR"
    if [ -f "npm-debug.log" ] || [ -f "pnpm-debug.log" ]; then
        log "Dernières lignes des logs:"
        tail -20 npm-debug.log 2>/dev/null || tail -20 pnpm-debug.log 2>/dev/null || true
    fi
    exit 1
fi

success "Processus backend démarré (PID: $BACKEND_PID)"

# Vérifier la santé du backend avant de continuer
if ! check_backend_health; then
    error "Le backend n'est pas accessible. Arrêt du script."
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

# Démarrer le frontend
log "Démarrage du frontend (port $FRONTEND_PORT)..."
cd "$FRONTEND_DIR"
# Vite utilise PORT depuis l'environnement ou --port
PORT=$FRONTEND_PORT $PACKAGE_MANAGER run dev --port $FRONTEND_PORT &
FRONTEND_PID=$!

# Attendre que les serveurs démarrent
sleep 5

# Vérifier que les serveurs sont en cours d'exécution
log "Vérification du statut des serveurs..."

# Vérifier le backend (vérification supplémentaire)
if kill -0 $BACKEND_PID 2>/dev/null; then
    success "Backend toujours actif (PID: $BACKEND_PID)"
else
    error "Le backend s'est arrêté (PID: $BACKEND_PID)"
    error "Vérifiez les logs du backend pour plus d'informations"
    exit 1
fi

# Vérifier le frontend
if kill -0 $FRONTEND_PID 2>/dev/null; then
    success "Frontend démarré avec succès (PID: $FRONTEND_PID)"
else
    error "Échec du démarrage du frontend (PID: $FRONTEND_PID)"
    log "Vérification des logs du frontend..."
    # Attendre un peu plus et réessayer
    sleep 2
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        success "Frontend démarré avec succès (PID: $FRONTEND_PID) - Délai de démarrage"
    else
        error "Le frontend ne répond pas. Vérifiez les logs ci-dessus."
        exit 1
    fi
fi

# Créer le tunnel si activé
if [ "$ENABLE_TUNNEL" = "true" ]; then
    create_tunnel
fi

echo ""
echo "🎉 DK BUILDING est maintenant en cours d'exécution !"
echo ""
echo "📱 Frontend (local):    http://localhost:$FRONTEND_PORT"
echo "📱 Frontend (réseau):   http://192.168.1.124:$FRONTEND_PORT"
if [ -n "$TUNNEL_URL" ]; then
    echo -e "📡 Frontend (public):   ${GREEN}$TUNNEL_URL${NC}"
    echo ""
    echo -e "${YELLOW}💡 Partagez l'URL publique pour permettre l'accès depuis Internet${NC}"
    echo -e "${YELLOW}⚠️  L'URL publique est accessible publiquement - utilisez avec précaution${NC}"
    echo -e "${BLUE}ℹ️  Cloudflare Tunnel ne nécessite pas de mot de passe${NC}"
fi
echo ""
echo "🔧 Backend:             http://localhost:$BACKEND_PORT"
echo "📊 Health:              http://localhost:$BACKEND_PORT/health"
echo ""
if [ "$ENABLE_TUNNEL" = "true" ]; then
    echo -e "${BLUE}💡 Pour désactiver le tunnel: ENABLE_TUNNEL=false ./start.sh${NC}"
fi
echo ""
echo "Appuyez sur Ctrl+C pour arrêter les serveurs"
echo ""

# Attendre que les processus se terminent
if [ -n "$TUNNEL_PID" ]; then
    wait $FRONTEND_PID $BACKEND_PID $TUNNEL_PID 2>/dev/null || wait $FRONTEND_PID $BACKEND_PID
else
    wait $FRONTEND_PID $BACKEND_PID
fi
