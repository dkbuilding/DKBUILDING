# Tunnels de développement - Cloudflare Tunnel

## 📋 Vue d'ensemble

Ce document présente la solution de tunneling utilisée dans le projet : **Cloudflare Tunnel (cloudflared)**.

> ⚠️ **Note** : `localtunnel` a été remplacé par Cloudflare Tunnel dans ce projet. Voir la section "Migration" pour plus de détails.

---

## 🏆 Recommandation : Cloudflare Tunnel (cloudflared)

### ✅ Avantages
- **100% gratuit** sans limitations
- **Très fiable** et stable
- **Pas de limite de temps** (contrairement à localtunnel)
- **Pas de mot de passe requis** (optionnel)
- **HTTPS automatique** avec certificat valide
- **Sous-domaine personnalisable** (avec compte Cloudflare gratuit)
- **Open source** et maintenu activement
- **Performance excellente** (réseau Cloudflare)

### ❌ Inconvénients
- Nécessite l'installation de `cloudflared` (CLI)
- Configuration initiale légèrement plus complexe

### 📦 Installation

```bash
# macOS (via Homebrew)
brew install cloudflared

# Linux
# Télécharger depuis https://github.com/cloudflare/cloudflared/releases
# Ou via package manager selon votre distribution

# Vérification
cloudflared --version
```

### 🚀 Utilisation basique

```bash
# Tunnel simple (sous-domaine aléatoire)
cloudflared tunnel --url http://localhost:5173

# Tunnel avec sous-domaine personnalisé (nécessite compte Cloudflare)
cloudflared tunnel --url http://localhost:5173 --hostname dk-building.your-domain.com
```

---

## 🔄 Alternative 2 : ngrok

### ✅ Avantages
- **Très populaire** et bien documenté
- **Interface web** pour monitoring
- **Inspection des requêtes** (version payante)
- **Sous-domaines personnalisés** (version payante)
- **Webhooks** et replay de requêtes

### ❌ Inconvénients
- **Limite de temps** sur la version gratuite (2h)
- **Sous-domaine aléatoire** sur version gratuite
- **Limite de connexions** simultanées (gratuit)
- Nécessite un compte (gratuit mais obligatoire)

### 📦 Installation

```bash
# macOS
brew install ngrok

# Ou télécharger depuis https://ngrok.com/download
```

### 🚀 Utilisation

```bash
# Après inscription et configuration du token
ngrok http 5173
```

---

## 🔄 Alternative 3 : bore

### ✅ Avantages
- **100% open source** (Rust)
- **Très léger** et rapide
- **Pas de compte requis**
- **Simple à utiliser**

### ❌ Inconvénients
- **Sous-domaine aléatoire** uniquement
- **Moins de fonctionnalités** que les autres
- **Communauté plus petite**

### 📦 Installation

```bash
# Via cargo (Rust)
cargo install bore-cli

# Ou télécharger binaire depuis https://github.com/ekzhang/bore
```

### 🚀 Utilisation

```bash
bore local 5173 --to bore.pub
```

---

## 🔄 Alternative 4 : serveo (SSH)

### ✅ Avantages
- **Aucune installation** requise (utilise SSH)
- **100% gratuit**
- **Sous-domaine personnalisable**

### ❌ Inconvénients
- **Moins fiable** que les autres solutions
- **Nécessite SSH** configuré
- **Peut être bloqué** par certains pare-feu

### 🚀 Utilisation

```bash
ssh -R 80:localhost:5173 serveo.net
```

---

## 📊 Comparaison rapide

| Solution | Gratuit | Fiable | Sous-domaine | HTTPS | Installation |
|----------|---------|--------|--------------|-------|--------------|
| **Cloudflare Tunnel** | ✅ | ⭐⭐⭐⭐⭐ | ✅ (avec compte) | ✅ | Moyenne |
| **ngrok** | ⚠️ (limité) | ⭐⭐⭐⭐ | ⚠️ (payant) | ✅ | Facile |
| **bore** | ✅ | ⭐⭐⭐ | ❌ | ⚠️ | Facile |
| **serveo** | ✅ | ⭐⭐ | ✅ | ⚠️ | Aucune |
| ~~**localtunnel**~~ | ✅ | ⭐⭐⭐ | ⚠️ | ⚠️ | Facile | ⚠️ **OBSOLÈTE** |

---

## 🎯 Solution utilisée : Cloudflare Tunnel

### ✅ Migration effectuée

Le projet utilise maintenant **Cloudflare Tunnel** comme solution unique de tunneling.

### Pourquoi Cloudflare Tunnel ?

1. **Gratuit sans limitations** : Pas de limite de temps, pas de limite de connexions
2. **Très fiable** : Infrastructure Cloudflare mondiale
3. **HTTPS automatique** : Certificats SSL valides
4. **Sous-domaines personnalisés** : Avec compte Cloudflare gratuit
5. **Maintenu activement** : Mises à jour régulières
6. **Performance excellente** : Réseau Cloudflare optimisé

### Migration effectuée

✅ **Installer cloudflared** - Voir section Installation  
✅ **Scripts de tunnel mis à jour** - `tunnel.js` utilise maintenant cloudflared  
✅ **`start.sh` mis à jour** - Utilise Cloudflare Tunnel  
✅ **Configuration Vite mise à jour** - Autorise `.trycloudflare.com`  
✅ **Documentation mise à jour** - Reflète les changements

---

## 📝 Notes importantes

### Sécurité

⚠️ **Tous ces tunnels exposent votre serveur local sur Internet** :
- Utilisez uniquement pour le développement
- Ne partagez l'URL qu'avec des personnes de confiance
- Ne pas utiliser en production
- Désactivez le tunnel quand vous ne l'utilisez pas

### Performance

- Les tunnels ajoutent une latence (généralement < 100ms)
- Cloudflare Tunnel est généralement le plus rapide
- La latence dépend de votre connexion Internet

### Limitations

- Certains tunnels peuvent être bloqués par des pare-feu d'entreprise
- Les tunnels gratuits peuvent avoir des limitations de bande passante
- Vérifiez les conditions d'utilisation de chaque service

---

## 🔗 Ressources

- **Cloudflare Tunnel** : https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/
- **ngrok** : https://ngrok.com/
- **bore** : https://github.com/ekzhang/bore
- **serveo** : https://serveo.net/

---

**Dernière mise à jour** : Janvier 2025

