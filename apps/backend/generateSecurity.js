#!/usr/bin/env node

/**
 * Script de Génération de Sécurité DK BUILDING
 * Génère des clés JWT sécurisées et met à jour le fichier .env
 *
 * Usage: node generateSecurity.js [master-password]
 *
 * @author DK BUILDING Security Team
 * @version latest
 * @date 2025-01-25
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const SecurityGenerator = require("./utils/securityGenerator");

class SecuritySetup {
  constructor() {
    this.generator = new SecurityGenerator();
    this.envPath = path.join(__dirname, ".env");
    this.backupPath = path.join(__dirname, ".env.backup");
  }

  /**
   * Interface utilisateur pour la saisie sécurisée du mot de passe
   */
  async promptMasterPassword() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      console.log("\n🔒 === GÉNÉRATEUR DE SÉCURITÉ DK BUILDING ===");
      console.log("Sécurité niveau NSA - 128 bits minimum\n");

      rl.question(
        "Entrez le mot de passe maître (minimum 16 caractères): ",
        (password) => {
          rl.close();
          resolve(password);
        },
      );
    });
  }

  /**
   * Sauvegarde le fichier .env existant
   */
  backupExistingEnv() {
    if (fs.existsSync(this.envPath)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const backupFile = `${this.backupPath}-${timestamp}`;

      fs.copyFileSync(this.envPath, backupFile);
      console.log(`✅ Sauvegarde créée: ${backupFile}`);
      return true;
    }
    return false;
  }

  /**
   * Génère le contenu du fichier .env sécurisé
   */
  generateEnvContent(masterPassword) {
    const config = this.generator.generateSecureEnvConfig(masterPassword);

    let envContent = `# Configuration sécurisée DK BUILDING
# Générée le: ${new Date().toISOString()}
# Sécurité niveau NSA - 128 bits minimum
# ⚠️  NE JAMAIS PARTAGER CE FICHIER ⚠️

# === CONFIGURATION SERVEUR ===
PORT=${config.PORT}
FRONTEND_PORT=${config.FRONTEND_PORT}
FRONTEND_URL=${config.FRONTEND_URL}
API_BASE_URL=${config.API_BASE_URL}

# === CONFIGURATION SMTP ===
SMTP_HOST=${config.SMTP_HOST}
SMTP_PORT=${config.SMTP_PORT}
SMTP_SECURE=${config.SMTP_SECURE}
SMTP_USER=${config.SMTP_USER}
SMTP_PASS=${config.SMTP_PASS}

# === EMAIL DE CONTACT ===
CONTACT_EMAIL=${config.CONTACT_EMAIL}

# === CONFIGURATION PRODUCTION ===
NODE_ENV=${config.NODE_ENV}
LOG_LEVEL=${config.LOG_LEVEL}

# === SYSTÈME LOCKACCESS ===
LOCKACCESS=${config.LOCKACCESS}
LOCKACCESS_LOCKED=${config.LOCKACCESS_LOCKED}
LOCKACCESS_MAINTENANCE_MODE=${config.LOCKACCESS_MAINTENANCE_MODE}
LOCKACCESS_ALLOWED_IPS=${config.LOCKACCESS_ALLOWED_IPS}
LOCKACCESS_BLOCKED_IPS=${config.LOCKACCESS_BLOCKED_IPS}

# === SÉCURITÉ JWT DK BUILDING ===
# Clé secrète JWT générée avec PBKDF2-SHA512
JWT_SECRET=${config.JWT_SECRET}
JWT_SALT=${config.JWT_SALT}
JWT_ALGORITHM=${config.JWT_ALGORITHM}
JWT_EXPIRY=${config.JWT_EXPIRY}
JWT_SECURITY_LEVEL=${config.JWT_SECURITY_LEVEL}
JWT_VERIFICATION_HASH=${config.JWT_VERIFICATION_HASH}

# === MOT DE PASSE HEALTH MONITORING ===
# Mot de passe fort généré automatiquement
HEALTH_PASSWORD=${config.HEALTH_PASSWORD}
HEALTH_PASSWORD_STRENGTH=${config.HEALTH_PASSWORD_STRENGTH}
HEALTH_PASSWORD_ENTROPY=${config.HEALTH_PASSWORD_ENTROPY}

# === MÉTADONNÉES DE SÉCURITÉ ===
SECURITY_GENERATED_AT=${config.SECURITY_GENERATED_AT}
SECURITY_ALGORITHM=${config.SECURITY_ALGORITHM}
SECURITY_KEY_LENGTH=${config.SECURITY_KEY_LENGTH}
SECURITY_ITERATIONS=${config.SECURITY_ITERATIONS}

# === INFORMATIONS DE SÉCURITÉ ===
# Algorithme: ${config.SECURITY_ALGORITHM}
# Longueur de clé: ${config.SECURITY_KEY_LENGTH} bits
# Itérations PBKDF2: ${config.SECURITY_ITERATIONS}
# Niveau de sécurité: ${config.JWT_SECURITY_LEVEL}
# Entropie mot de passe: ${config.HEALTH_PASSWORD_ENTROPY} bits
`;

    return envContent;
  }

  /**
   * Écrit le fichier .env sécurisé
   */
  writeSecureEnv(content) {
    fs.writeFileSync(this.envPath, content, { mode: 0o600 }); // Permissions restrictives
    console.log("✅ Fichier .env sécurisé créé avec permissions restrictives");
  }

  /**
   * Affiche le résumé de sécurité
   */
  displaySecuritySummary(config) {
    console.log("\n🔐 === RÉSUMÉ DE SÉCURITÉ ===");
    console.log(`Algorithme: ${config.SECURITY_ALGORITHM}`);
    console.log(`Longueur de clé: ${config.SECURITY_KEY_LENGTH} bits`);
    console.log(`Itérations PBKDF2: ${config.SECURITY_ITERATIONS}`);
    console.log(`Niveau de sécurité: ${config.JWT_SECURITY_LEVEL}`);
    console.log(
      `Entropie mot de passe: ${config.HEALTH_PASSWORD_ENTROPY} bits`,
    );
    console.log(`Force mot de passe: ${config.HEALTH_PASSWORD_STRENGTH}/5`);
    console.log(`Généré le: ${config.SECURITY_GENERATED_AT}`);

    console.log("\n⚠️  === INSTRUCTIONS DE SÉCURITÉ ===");
    console.log("1. Sauvegardez ce fichier .env en lieu sûr");
    console.log("2. Ne jamais commiter ce fichier dans Git");
    console.log("3. Changez le mot de passe maître régulièrement");
    console.log("4. Surveillez les logs de sécurité");
    console.log("5. Utilisez HTTPS en production");
  }

  /**
   * Valide la configuration générée
   */
  validateConfiguration(config) {
    // Validation basique de la configuration
    const jwtSecretValid = config.JWT_SECRET && config.JWT_SECRET.length > 0;
    const jwtSaltValid = config.JWT_SALT && config.JWT_SALT.length > 0;
    const verificationHashValid =
      config.JWT_VERIFICATION_HASH && config.JWT_VERIFICATION_HASH.length > 0;
    const healthPasswordValid =
      config.HEALTH_PASSWORD && config.HEALTH_PASSWORD.length >= 16;

    console.log("\n🔍 === VALIDATION DE SÉCURITÉ ===");
    console.log(`JWT Secret: ${jwtSecretValid ? "✅ Valide" : "❌ Invalide"}`);
    console.log(`JWT Salt: ${jwtSaltValid ? "✅ Valide" : "❌ Invalide"}`);
    console.log(
      `Verification Hash: ${verificationHashValid ? "✅ Valide" : "❌ Invalide"}`,
    );
    console.log(
      `Mot de passe Health: ${config.HEALTH_PASSWORD_STRENGTH >= 4 ? "✅ Fort" : "⚠️  Faible"}`,
    );
    console.log(
      `Entropie: ${config.HEALTH_PASSWORD_ENTROPY >= 60 ? "✅ Suffisante" : "⚠️  Insuffisante"}`,
    );
    console.log(
      `Mot de passe longueur: ${healthPasswordValid ? "✅ Suffisante" : "⚠️  Insuffisante"}`,
    );

    return (
      jwtSecretValid &&
      jwtSaltValid &&
      verificationHashValid &&
      config.HEALTH_PASSWORD_STRENGTH >= 4 &&
      healthPasswordValid
    );
  }

  /**
   * Exécute le processus complet de génération de sécurité
   */
  async run() {
    try {
      console.log("🚀 Démarrage du générateur de sécurité DK BUILDING...\n");

      // Sauvegarde du fichier existant
      this.backupExistingEnv();

      // Saisie du mot de passe maître
      const masterPassword =
        process.argv[2] || (await this.promptMasterPassword());

      if (!masterPassword || masterPassword.length < 16) {
        throw new Error(
          "Le mot de passe maître doit contenir au moins 16 caractères",
        );
      }

      console.log("\n🔧 Génération des clés de sécurité...");

      // Génération de la configuration
      const config = this.generator.generateSecureEnvConfig(masterPassword);

      // Génération du contenu .env
      const envContent = this.generateEnvContent(masterPassword);

      // Écriture du fichier
      this.writeSecureEnv(envContent);

      // Validation
      const isValid = this.validateConfiguration(config);

      if (!isValid) {
        throw new Error(
          "La configuration générée ne respecte pas les standards de sécurité",
        );
      }

      // Affichage du résumé
      this.displaySecuritySummary(config);

      console.log("\n✅ Génération de sécurité terminée avec succès !");
      console.log(
        "🔒 Votre système DK BUILDING est maintenant sécurisé au niveau NSA",
      );
    } catch (error) {
      console.error("\n❌ Erreur lors de la génération de sécurité:");
      console.error(error.message);
      process.exit(1);
    }
  }
}

// Exécution du script
if (require.main === module) {
  const setup = new SecuritySetup();
  setup.run();
}

module.exports = SecuritySetup;
