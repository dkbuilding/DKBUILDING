# Configuration Resend pour DK BUILDING

## 📧 Guide de configuration Resend

Ce guide explique comment configurer Resend pour l'envoi d'emails depuis le formulaire de contact.

---

## 🚀 Étapes de configuration

### 1. Créer un compte Resend

1. Allez sur [https://resend.com](https://resend.com)
2. Créez un compte gratuit (100 emails/jour en version gratuite)
3. Vérifiez votre email

### 2. Obtenir votre clé API

1. Connectez-vous à votre dashboard Resend
2. Allez dans **API Keys** dans le menu
3. Cliquez sur **Create API Key**
4. Donnez un nom à votre clé (ex: "DK BUILDING Production")
5. Copiez la clé API (elle commence par `re_`)
6. ⚠️ **Important** : La clé ne sera affichée qu'une seule fois, sauvegardez-la !

### 3. Configurer le fichier `.env`

Ouvrez le fichier `.env` dans `Site Web/apps/backend/` et remplacez :

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
```

Par votre vraie clé API :

```env
RESEND_API_KEY=re_VOTRE_VRAIE_CLE_API_ICI
```

### 4. Vérifier votre domaine (Optionnel mais recommandé)

Pour utiliser votre propre domaine `dkbuilding.fr` :

1. Allez dans **Domains** dans le dashboard Resend
2. Cliquez sur **Add Domain**
3. Entrez `dkbuilding.fr`
4. Ajoutez les enregistrements DNS demandés dans votre hébergeur
5. Attendez la vérification (quelques minutes)

**Alternative** : Vous pouvez utiliser le domaine de test Resend (`onboarding@resend.dev`) pour le développement.

### 5. Configurer l'email d'envoi

Dans le fichier `.env`, configurez l'email d'envoi :

```env
RESEND_FROM_EMAIL=DK BUILDING <noreply@dkbuilding.fr>
```

**Note** :

- Si vous avez vérifié votre domaine : utilisez `noreply@dkbuilding.fr`
- Si vous utilisez le domaine de test : utilisez `onboarding@resend.dev`

### 6. Redémarrer le serveur backend

Après avoir configuré les variables d'environnement :

```bash
cd Site\ Web/apps/backend
npm run dev
```

Vous devriez voir dans les logs :

```
📧 Service email Resend configuré avec succès
```

---

## ✅ Vérification

### Tester la configuration

1. Démarrez le backend : `npm run dev` dans `Site Web/apps/backend`
2. Démarrez le frontend : `pnpm run dev` dans `Site Web/apps/frontend`
3. Remplissez le formulaire de contact sur le site
4. Vérifiez que vous recevez :
   - Un email de notification à `contact@dkbuilding.fr`
   - Un email de confirmation au client

### Vérifier le statut de l'API

Vous pouvez vérifier si Resend est configuré en appelant :

```bash
curl http://localhost:3001/api/contact/status
```

La réponse devrait contenir :

```json
{
  "status": "OK",
  "emailConfigured": true
}
```

---

## 🔧 Dépannage

### Erreur : "Service email non configuré"

**Cause** : La variable `RESEND_API_KEY` n'est pas définie ou est incorrecte.

**Solution** :

1. Vérifiez que le fichier `.env` existe dans `Site Web/apps/backend/`
2. Vérifiez que `RESEND_API_KEY` est bien définie
3. Redémarrez le serveur backend

### Erreur : "Invalid API key"

**Cause** : La clé API est incorrecte ou a été révoquée.

**Solution** :

1. Vérifiez que vous avez copié la clé complète (commence par `re_`)
2. Créez une nouvelle clé API dans le dashboard Resend
3. Mettez à jour le fichier `.env`

### Erreur : "Domain not verified"

**Cause** : Vous essayez d'envoyer depuis un domaine non vérifié.

**Solution** :

1. Vérifiez votre domaine dans Resend
2. Utilisez temporairement `onboarding@resend.dev` pour les tests
3. Vérifiez les enregistrements DNS de votre domaine

### Les emails ne sont pas reçus

**Vérifications** :

1. Vérifiez les logs du backend pour voir les erreurs
2. Vérifiez le dashboard Resend pour voir les emails envoyés
3. Vérifiez les spams/junk mail
4. Vérifiez que l'adresse email de destination est correcte

---

## 📊 Limites Resend (Plan Gratuit)

- **100 emails/jour**
- **3 000 emails/mois**
- Domaine personnalisé disponible
- API complète

Pour plus d'emails, passez à un plan payant sur [resend.com/pricing](https://resend.com/pricing)

---

## 🔒 Sécurité

⚠️ **IMPORTANT** :

- Ne jamais commiter le fichier `.env` dans Git
- Ne jamais partager votre clé API Resend
- Régénérez la clé si elle a été compromise
- Utilisez des clés différentes pour développement et production

---

## 📝 Variables d'environnement requises

```env
# Clé API Resend (obligatoire)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx

# Email d'envoi (obligatoire)
RESEND_FROM_EMAIL=DK BUILDING <noreply@dkbuilding.fr>

# Email de contact pour recevoir les demandes (obligatoire)
CONTACT_EMAIL=contact@dkbuilding.fr
```

---

## 🎯 Prochaines étapes

Une fois Resend configuré :

1. ✅ Testez le formulaire de contact
2. ✅ Vérifiez la réception des emails
3. ✅ Configurez votre domaine personnalisé (optionnel)
4. ✅ Surveillez les logs Resend pour les erreurs

---

**Besoin d'aide ?** Consultez la [documentation Resend](https://resend.com/docs) ou contactez le support.
