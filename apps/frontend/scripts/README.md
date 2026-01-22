# Scripts de Tunnel pour Accès Externe

## 📡 Vue d'ensemble

Ces scripts permettent d'exposer votre serveur Vite de développement sur Internet via **Cloudflare Tunnel (cloudflared)**, une solution moderne, fiable et gratuite.

> ⚠️ **Note** : `localtunnel` a été remplacé par Cloudflare Tunnel dans ce projet.

## 🚀 Utilisation

### Option 1 : Démarrer Vite + Tunnel ensemble (Recommandé)

```bash
pnpm run dev:tunnel
```

Cette commande démarre automatiquement :
1. Le serveur Vite sur `http://localhost:5173` (ou le port configuré)
2. Un tunnel Cloudflare qui expose votre serveur sur Internet

### Option 2 : Tunnel seul (si Vite est déjà lancé)

Si vous avez déjà démarré Vite avec `pnpm run dev`, vous pouvez créer uniquement le tunnel :

```bash
pnpm run tunnel
```

### Option 3 : Tunnel spécifique

```bash
# Cloudflare Tunnel (par défaut, recommandé)
pnpm run tunnel:cloudflare

# ngrok (alternative)
pnpm run tunnel:ngrok
```

## 📋 Prérequis

### Installation de cloudflared

**macOS** :
```bash
brew install cloudflared
```

**Linux** :
```bash
# Télécharger depuis https://github.com/cloudflare/cloudflared/releases
# Ou utiliser le package manager de votre distribution
```

**Windows** :
```bash
winget install --id Cloudflare.cloudflared
```

### Vérification

```bash
cloudflared --version
```

## 📋 Variables d'environnement

Vous pouvez personnaliser le comportement via des variables d'environnement :

```bash
# Changer le port (défaut: 5173)
PORT=3000 pnpm run dev:tunnel

# Utiliser un sous-domaine personnalisé (nécessite compte Cloudflare)
TUNNEL_HOSTNAME=dk-building.your-domain.com pnpm run dev:tunnel
```

## 🔗 URLs disponibles

Une fois le tunnel créé, vous aurez accès à votre serveur via :

- **URL locale** : `http://localhost:5173` (ou le port configuré)
- **URL réseau local** : `http://192.168.1.124:5173` (selon votre IP locale)
- **URL publique** : `https://[sous-domaine].trycloudflare.com` (affichée dans le terminal)

## ✅ Avantages de Cloudflare Tunnel

- **100% gratuit** sans limitations
- **Très fiable** et stable
- **Pas de limite de temps** (contrairement à localtunnel)
- **Pas de mot de passe requis**
- **HTTPS automatique** avec certificat valide
- **Performance excellente** (réseau Cloudflare)

## ⚠️ Notes importantes

### Sécurité

- ⚠️ **Ne partagez l'URL publique qu'avec des personnes de confiance**
- ⚠️ Le tunnel est accessible publiquement sur Internet
- ⚠️ Utilisez uniquement pour le développement, jamais en production
- ⚠️ Désactivez le tunnel quand vous ne l'utilisez pas

### Limitations

- L'URL change à chaque redémarrage (sauf si vous utilisez un sous-domaine personnalisé avec compte Cloudflare)
- Certains pare-feu d'entreprise peuvent bloquer l'accès
- Nécessite l'installation de `cloudflared` (CLI)

### Performance

- La latence est généralement très faible (< 50ms) grâce au réseau Cloudflare
- Le débit est excellent grâce à l'infrastructure Cloudflare

## 🛑 Arrêt

Appuyez sur `Ctrl+C` pour arrêter proprement le serveur et le tunnel.

## 🔄 Alternatives

Si Cloudflare Tunnel ne fonctionne pas pour vous, vous pouvez utiliser ngrok :

### ngrok (nécessite un compte gratuit)

```bash
# Installation
brew install ngrok  # macOS
# ou télécharger depuis https://ngrok.com/download

# Configuration du token
ngrok config add-authtoken YOUR_TOKEN

# Utilisation
pnpm run tunnel:ngrok
```

## 📚 Documentation

- [Cloudflare Tunnel Documentation](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
- [Vite Server Options](https://vite.dev/config/server-options.html)
- [Documentation complète des tunnels](./../docs/tunnels-alternatives.md)
