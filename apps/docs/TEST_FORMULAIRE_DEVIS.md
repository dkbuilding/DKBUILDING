# Guide de Test — Formulaire de Devis

## Prérequis

1. Backend démarré sur le port 3001
2. Frontend démarré sur le port 5173
3. Fichier `.env` configuré dans `backend/` avec une clé Resend valide
4. Variables d'environnement correctement configurées

## Tests à effectuer

### 1. Test de validation frontend — Étape 1

**Objectif** : Vérifier que la sélection du type de projet est obligatoire

**Actions** :
1. Accéder à la page de contact
2. Cliquer sur "Suivant" sans sélectionner de type de projet
3. Vérifier qu'un message d'erreur apparaît : "Veuillez sélectionner un type de projet"
4. Vérifier que les cartes de type de projet ont une bordure rouge

**Résultat attendu** : Le formulaire ne passe pas à l'étape suivante et affiche l'erreur.

### 2. Test de validation frontend — Étape 2

**Objectif** : Vérifier que la surface doit être un nombre positif si renseignée

**Actions** :
1. Sélectionner un type de projet
2. Passer à l'étape 2
3. Entrer une valeur négative ou non numérique dans "Surface"
4. Vérifier qu'un message d'erreur apparaît sous le champ

**Résultat attendu** : Message d'erreur "La surface doit être un nombre positif".

### 3. Test de validation frontend — Étape 3

**Objectif** : Vérifier la validation des champs obligatoires

**Actions** :
1. Passer à l'étape 3
2. Tester chaque champ individuellement :

   **Nom** :
   - Laisser vide → Erreur : "Le nom doit contenir au moins 2 caractères"
   - Entrer 1 caractère → Erreur : "Le nom doit contenir au moins 2 caractères"
   - Entrer 2+ caractères → Pas d'erreur

   **Email** :
   - Laisser vide → Erreur : "L'email est requis"
   - Entrer "invalid" → Erreur : "Format d'email invalide"
   - Entrer "test@" → Erreur : "Format d'email invalide"
   - Entrer "test@example.com" → Pas d'erreur

   **Téléphone** :
   - Laisser vide → Erreur : "Le téléphone est requis"
   - Entrer "123" → Erreur : "Format de téléphone invalide"
   - Entrer "+33 7 68 11 38 39" → Pas d'erreur
   - Entrer "07 68 11 38 39" → Pas d'erreur
   - Entrer "0768113839" → Pas d'erreur

**Résultat attendu** : Les erreurs s'affichent sous chaque champ avec une bordure rouge.

### 4. Test de soumission — Données valides

**Objectif** : Vérifier que le formulaire s'envoie correctement

**Actions** :
1. Remplir tous les champs avec des données valides :
   - Type de projet : Sélectionner un type
   - Description : "Test de projet"
   - Surface : "500"
   - Délai : "1 à 3 mois"
   - Localisation : "Albi, Tarn"
   - Nom : "Jean Dupont"
   - Email : "jean.dupont@example.com"
   - Téléphone : "+33 7 68 11 38 39"
   - Message : "Message de test"
2. Cliquer sur "Envoyer la demande"
3. Vérifier que le bouton affiche "Envoi en cours..."
4. Attendre la réponse

**Résultat attendu** :
- Si la clé Resend est configurée : Affichage du message de succès "DEMANDE ENVOYÉE !"
- Si la clé Resend n'est pas configurée : Message d'erreur approprié

### 5. Test de soumission — Données invalides

**Objectif** : Vérifier que le formulaire ne s'envoie pas avec des données invalides

**Actions** :
1. Remplir le formulaire avec des données invalides (email invalide, téléphone invalide)
2. Cliquer sur "Envoyer la demande"
3. Vérifier que le formulaire ne s'envoie pas
4. Vérifier que les erreurs s'affichent
5. Vérifier que le formulaire passe automatiquement à l'étape avec erreur

**Résultat attendu** : Le formulaire reste sur l'étape avec erreur et affiche les messages d'erreur.

### 6. Test de gestion d'erreurs réseau

**Objectif** : Vérifier la gestion des erreurs de connexion

**Actions** :
1. Arrêter le serveur backend
2. Remplir le formulaire avec des données valides
3. Cliquer sur "Envoyer la demande"
4. Vérifier le message d'erreur affiché

**Résultat attendu** : Message d'erreur "Erreur de connexion. Vérifiez votre connexion internet." affiché dans une boîte rouge en haut du formulaire.

### 7. Test de validation backend

**Objectif** : Vérifier que le backend valide correctement les données

**Actions** :
1. Utiliser un outil comme Postman ou curl pour envoyer une requête POST à `http://localhost:3001/api/contact`
2. Tester différents cas :

   **Requête valide** :
   ```json
   {
     "projectType": "charpente",
     "projectDetails": "Description du projet",
     "surface": "500",
     "deadline": "1-3mois",
     "location": "Albi, Tarn",
     "name": "Jean Dupont",
     "email": "jean.dupont@example.com",
     "phone": "+33768113839",
     "message": "Message de test"
   }
   ```

   **Requête invalide — Type de projet manquant** :
   ```json
   {
     "name": "Jean Dupont",
     "email": "jean.dupont@example.com",
     "phone": "+33768113839"
   }
   ```

   **Requête invalide — Email invalide** :
   ```json
   {
     "projectType": "charpente",
     "name": "Jean Dupont",
     "email": "email-invalide",
     "phone": "+33768113839"
   }
   ```

   **Requête invalide — Téléphone invalide** :
   ```json
   {
     "projectType": "charpente",
     "name": "Jean Dupont",
     "email": "jean.dupont@example.com",
     "phone": "123"
   }
   ```

**Résultat attendu** :
- Requête valide : Status 200 avec message de succès
- Requêtes invalides : Status 400 avec détails des erreurs de validation

### 8. Test de nettoyage du numéro de téléphone

**Objectif** : Vérifier que le numéro de téléphone est nettoyé avant l'envoi

**Actions** :
1. Entrer un numéro avec espaces : "+33 7 68 11 38 39"
2. Soumettre le formulaire
3. Vérifier dans les logs backend que le numéro est envoyé sans espaces : "+33768113839"

**Résultat attendu** : Le numéro est nettoyé automatiquement avant l'envoi au backend.

### 9. Test de réinitialisation du formulaire

**Objectif** : Vérifier que le formulaire se réinitialise après envoi réussi

**Actions** :
1. Envoyer un formulaire avec succès
2. Cliquer sur "NOUVELLE DEMANDE"
3. Vérifier que tous les champs sont vides
4. Vérifier que l'étape est revenue à 1
5. Vérifier qu'il n'y a plus d'erreurs affichées

**Résultat attendu** : Le formulaire est complètement réinitialisé.

### 10. Test de navigation entre les étapes

**Objectif** : Vérifier que la navigation fonctionne correctement

**Actions** :
1. Sélectionner un type de projet
2. Cliquer sur "Suivant" → Vérifier passage à l'étape 2
3. Cliquer sur "Précédent" → Vérifier retour à l'étape 1
4. Passer à l'étape 3
5. Cliquer sur "Précédent" → Vérifier retour à l'étape 2
6. Vérifier que le bouton "Précédent" est désactivé à l'étape 1

**Résultat attendu** : Navigation fluide entre les étapes avec validation à chaque passage.

## Checklist de validation complète

- [ ] Validation frontend — Type de projet obligatoire
- [ ] Validation frontend — Surface doit être un nombre positif
- [ ] Validation frontend — Nom (min 2 caractères)
- [ ] Validation frontend — Email (format valide)
- [ ] Validation frontend — Téléphone (format français)
- [ ] Affichage des erreurs sous chaque champ
- [ ] Bordure rouge sur les champs en erreur
- [ ] Message d'erreur général en haut du formulaire
- [ ] Soumission avec données valides
- [ ] Soumission bloquée avec données invalides
- [ ] Gestion des erreurs réseau
- [ ] Validation backend — Tous les champs requis
- [ ] Validation backend — Formats valides
- [ ] Nettoyage du numéro de téléphone
- [ ] Réinitialisation du formulaire après succès
- [ ] Navigation entre les étapes

## Notes importantes

- Les tests nécessitent une clé API Resend valide pour tester l'envoi d'emails
- En développement, utiliser le mode développement avec rechargement automatique
- Vérifier les logs du backend pour diagnostiquer les problèmes
- Vérifier la console du navigateur pour les erreurs JavaScript

