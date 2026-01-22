/**
 * Générateur de Sécurité DK BUILDING
 * Système de génération de mots de passe JWT avec chiffrement SHA-512
 * Sécurité niveau NSA - 128 bits minimum
 *
 * @author DK BUILDING Security Team
 * @version latest
 * @date 2025-01-25
 */

const crypto = require("crypto");
const jwt = require("jsonwebtoken");

class SecurityGenerator {
  constructor() {
    this.algorithm = "sha512";
    this.keyLength = 64; // 512 bits = 64 bytes
    this.saltLength = 32; // 256 bits = 32 bytes
    this.iterations = 100000; // PBKDF2 iterations (NSA recommended)
    this.jwtExpiry = "30m"; // 30 minutes
    this.minPasswordLength = 16;
  }

  /**
   * Génère une clé JWT sécurisée avec formule mathématique NSA
   * Utilise l'algorithme PBKDF2 avec SHA-512
   *
   * @param {string} masterPassword - Mot de passe maître
   * @param {string} salt - Sel cryptographique (optionnel)
   * @returns {Object} - Clé JWT et métadonnées de sécurité
   */
  generateJWTSecurity(masterPassword, salt = null) {
    try {
      // Validation du mot de passe maître
      if (!masterPassword || masterPassword.length < this.minPasswordLength) {
        throw new Error(
          `Mot de passe maître doit contenir au moins ${this.minPasswordLength} caractères`,
        );
      }

      // Génération du sel si non fourni
      const generatedSalt = salt || crypto.randomBytes(this.saltLength);

      // Génération de la clé avec PBKDF2-SHA512 (standard NSA)
      const derivedKey = crypto.pbkdf2Sync(
        masterPassword,
        generatedSalt,
        this.iterations,
        this.keyLength,
        this.algorithm,
      );

      // Génération de la clé JWT avec formule mathématique
      const jwtSecret = this.generateJWTSecret(derivedKey, generatedSalt);

      // Génération du token de test
      const testPayload = {
        iss: "dk-building-security",
        sub: "health-monitoring",
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes
        security_level: "NSA_128_BITS",
        algorithm: this.algorithm,
        iterations: this.iterations,
      };

      const testToken = jwt.sign(testPayload, jwtSecret, {
        algorithm: "HS512",
      });

      return {
        jwt_secret: jwtSecret,
        salt: generatedSalt.toString("hex"),
        test_token: testToken,
        security_metadata: {
          algorithm: this.algorithm,
          key_length: this.keyLength * 8, // en bits
          salt_length: this.saltLength * 8, // en bits
          iterations: this.iterations,
          security_level: "NSA_128_BITS",
          generated_at: new Date().toISOString(),
          expires_in: this.jwtExpiry,
        },
        verification_hash: this.generateVerificationHash(
          jwtSecret,
          generatedSalt,
        ),
      };
    } catch (error) {
      throw new Error(`Erreur génération sécurité JWT: ${error.message}`);
    }
  }

  /**
   * Génère la clé JWT avec formule mathématique complexe
   * Combine la clé dérivée avec le sel pour une sécurité maximale
   *
   * @param {Buffer} derivedKey - Clé dérivée PBKDF2
   * @param {Buffer} salt - Sel cryptographique
   * @returns {string} - Clé JWT sécurisée
   */
  generateJWTSecret(derivedKey, salt) {
    // Formule mathématique NSA : H(derivedKey || salt || timestamp || entropy)
    const timestamp = Buffer.from(Date.now().toString());
    const entropy = crypto.randomBytes(16); // Entropie supplémentaire

    // Concaténation sécurisée
    const combined = Buffer.concat([derivedKey, salt, timestamp, entropy]);

    // Double hachage SHA-512 pour sécurité maximale
    const firstHash = crypto
      .createHash(this.algorithm)
      .update(combined)
      .digest();
    const finalHash = crypto
      .createHash(this.algorithm)
      .update(firstHash)
      .digest();

    return finalHash.toString("base64");
  }

  /**
   * Génère un hash de vérification pour valider l'intégrité
   *
   * @param {string} jwtSecret - Clé JWT
   * @param {Buffer} salt - Sel utilisé
   * @returns {string} - Hash de vérification
   */
  generateVerificationHash(jwtSecret, salt) {
    const verificationData = jwtSecret + salt.toString("hex");
    return crypto
      .createHash(this.algorithm)
      .update(verificationData)
      .digest("hex");
  }

  /**
   * Valide un token JWT avec vérification de sécurité
   *
   * @param {string} token - Token JWT à valider
   * @param {string} secret - Clé secrète JWT
   * @returns {Object} - Résultat de validation
   */
  validateJWT(token, secret) {
    try {
      const decoded = jwt.verify(token, secret, { algorithms: ["HS512"] });

      // Vérifications de sécurité supplémentaires
      const now = Math.floor(Date.now() / 1000);

      if (decoded.exp < now) {
        return { valid: false, error: "Token expiré" };
      }

      if (decoded.iss !== "dk-building-security") {
        return { valid: false, error: "Émetteur invalide" };
      }

      if (decoded.security_level !== "NSA_128_BITS") {
        return { valid: false, error: "Niveau de sécurité insuffisant" };
      }

      return {
        valid: true,
        payload: decoded,
        security_level: decoded.security_level,
        expires_at: new Date(decoded.exp * 1000).toISOString(),
      };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  /**
   * Génère un mot de passe fort selon les standards NSA
   *
   * @param {number} length - Longueur du mot de passe (minimum 16)
   * @param {Object} options - Options de génération
   * @returns {string} - Mot de passe sécurisé
   */
  generateStrongPassword(length = 24, options = {}) {
    const {
      includeUppercase = true,
      includeLowercase = true,
      includeNumbers = true,
      includeSymbols = true,
      excludeSimilar = true,
    } = options;

    if (length < this.minPasswordLength) {
      length = this.minPasswordLength;
    }

    let charset = "";

    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (excludeSimilar) {
      charset = charset.replace(/[0O1lI]/g, ""); // Exclure caractères similaires
    }

    let password = "";
    const randomBytes = crypto.randomBytes(length);

    for (let i = 0; i < length; i++) {
      password += charset[randomBytes[i] % charset.length];
    }

    // Vérification de la force du mot de passe
    const strength = this.calculatePasswordStrength(password);

    return {
      password,
      strength: strength.score,
      entropy: strength.entropy,
      recommendations: strength.recommendations,
    };
  }

  /**
   * Calcule la force d'un mot de passe
   *
   * @param {string} password - Mot de passe à analyser
   * @returns {Object} - Analyse de force
   */
  calculatePasswordStrength(password) {
    let score = 0;
    let recommendations = [];

    // Longueur
    if (password.length >= 16) score += 2;
    else if (password.length >= 12) score += 1;
    else recommendations.push("Augmenter la longueur à au moins 16 caractères");

    // Diversité des caractères
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;

    // Calcul de l'entropie
    const charsetSize = this.getCharsetSize(password);
    const entropy = Math.log2(Math.pow(charsetSize, password.length));

    // Recommandations
    if (entropy < 60)
      recommendations.push("Entropie faible - ajouter plus de caractères");
    if (!/[A-Z]/.test(password)) recommendations.push("Ajouter des majuscules");
    if (!/[0-9]/.test(password)) recommendations.push("Ajouter des chiffres");
    if (!/[^a-zA-Z0-9]/.test(password))
      recommendations.push("Ajouter des symboles");

    return {
      score: Math.min(score, 5),
      entropy: Math.round(entropy),
      recommendations,
    };
  }

  /**
   * Calcule la taille du jeu de caractères utilisé
   *
   * @param {string} password - Mot de passe
   * @returns {number} - Taille du jeu de caractères
   */
  getCharsetSize(password) {
    let size = 0;
    if (/[a-z]/.test(password)) size += 26;
    if (/[A-Z]/.test(password)) size += 26;
    if (/[0-9]/.test(password)) size += 10;
    if (/[^a-zA-Z0-9]/.test(password)) size += 32; // Symboles courants
    return size;
  }

  /**
   * Génère la configuration .env sécurisée
   *
   * @param {string} masterPassword - Mot de passe maître
   * @returns {Object} - Configuration .env sécurisée
   */
  generateSecureEnvConfig(masterPassword) {
    const security = this.generateJWTSecurity(masterPassword);
    const strongPassword = this.generateStrongPassword(32);

    return {
      // Configuration existante
      PORT: process.env.PORT || 3001,
      FRONTEND_PORT: process.env.FRONTEND_PORT || 5173,
      FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
      API_BASE_URL: process.env.API_BASE_URL || "http://localhost:3001",

      // Configuration SMTP (à configurer)
      SMTP_HOST: process.env.SMTP_HOST || "smtp.gmail.com",
      SMTP_PORT: process.env.SMTP_PORT || 587,
      SMTP_SECURE: process.env.SMTP_SECURE || "false",
      SMTP_USER: process.env.SMTP_USER || "your-email@gmail.com",
      SMTP_PASS: process.env.SMTP_PASS || "your-app-password",

      // Email de contact
      CONTACT_EMAIL: process.env.CONTACT_EMAIL || "contact@dkbuilding.fr",

      // Configuration de production
      NODE_ENV: process.env.NODE_ENV || "development",
      LOG_LEVEL: process.env.LOG_LEVEL || "info",

      // Configuration LockAccess System
      LOCKACCESS: process.env.LOCKACCESS || "true",
      LOCKACCESS_LOCKED: process.env.LOCKACCESS_LOCKED || "false",
      LOCKACCESS_MAINTENANCE_MODE:
        process.env.LOCKACCESS_MAINTENANCE_MODE || "false",
      LOCKACCESS_ALLOWED_IPS:
        process.env.LOCKACCESS_ALLOWED_IPS || "127.0.0.1,::1",
      LOCKACCESS_BLOCKED_IPS: process.env.LOCKACCESS_BLOCKED_IPS || "",

      // === SÉCURITÉ JWT DK BUILDING ===
      JWT_SECRET: security.jwt_secret,
      JWT_SALT: security.salt,
      JWT_ALGORITHM: security.security_metadata.algorithm,
      JWT_EXPIRY: security.security_metadata.expires_in,
      JWT_SECURITY_LEVEL: security.security_metadata.security_level,
      JWT_VERIFICATION_HASH: security.verification_hash,

      // === MOT DE PASSE HEALTH MONITORING ===
      HEALTH_PASSWORD: strongPassword.password,
      HEALTH_PASSWORD_STRENGTH: strongPassword.strength,
      HEALTH_PASSWORD_ENTROPY: strongPassword.entropy,

      // === MÉTADONNÉES DE SÉCURITÉ ===
      SECURITY_GENERATED_AT: security.security_metadata.generated_at,
      SECURITY_ALGORITHM: security.security_metadata.algorithm,
      SECURITY_KEY_LENGTH: security.security_metadata.key_length,
      SECURITY_ITERATIONS: security.security_metadata.iterations,
    };
  }
}

module.exports = SecurityGenerator;
