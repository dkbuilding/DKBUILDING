#!/usr/bin/env node

/**
 * Script de Test de Sécurité DK BUILDING
 * Valide le système JWT et l'authentification Health Monitoring
 *
 * @author DK BUILDING Security Team
 * @version latest
 * @date 2025-01-25
 */

const http = require("http");

class SecurityTester {
  constructor() {
    this.baseUrl = "http://localhost:3001";
    this.testResults = [];
  }

  /**
   * Effectue une requête HTTP
   */
  async makeRequest(method, path, headers = {}, body = null) {
    return new Promise((resolve, reject) => {
      const url = new URL(path, this.baseUrl);
      const options = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      };

      const req = http.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          try {
            const jsonData = JSON.parse(data);
            resolve({
              status: res.statusCode,
              headers: res.headers,
              data: jsonData,
            });
          } catch (error) {
            resolve({
              status: res.statusCode,
              headers: res.headers,
              data: data,
            });
          }
        });
      });

      req.on("error", (error) => {
        reject(error);
      });

      if (body) {
        req.write(JSON.stringify(body));
      }

      req.end();
    });
  }

  /**
   * Teste le statut de l'API d'authentification
   */
  async testAuthStatus() {
    console.log("🔍 Test du statut d'authentification...");

    try {
      const response = await this.makeRequest("GET", "/api/auth/status");

      if (response.status === 200 && response.data.configured) {
        console.log("✅ Statut d'authentification: CONFIGURÉ");
        console.log(`   Niveau de sécurité: ${response.data.security_level}`);
        console.log(`   Algorithme: ${response.data.algorithm}`);
        console.log(`   Longueur de clé: ${response.data.key_length} bits`);
        console.log(`   Itérations: ${response.data.iterations}`);

        this.testResults.push({
          test: "Auth Status",
          status: "PASS",
          details: response.data,
        });
        return true;
      } else {
        console.log("❌ Statut d'authentification: NON CONFIGURÉ");
        this.testResults.push({
          test: "Auth Status",
          status: "FAIL",
          details: response.data,
        });
        return false;
      }
    } catch (error) {
      console.log("❌ Erreur lors du test du statut:", error.message);
      this.testResults.push({
        test: "Auth Status",
        status: "ERROR",
        details: error.message,
      });
      return false;
    }
  }

  /**
   * Teste l'authentification avec un mauvais mot de passe
   */
  async testInvalidAuth() {
    console.log("\n🔍 Test d'authentification avec mot de passe invalide...");

    try {
      const response = await this.makeRequest(
        "POST",
        "/api/auth/health",
        {},
        {
          password: "wrongpassword",
        },
      );

      if (response.status === 401 && !response.data.success) {
        console.log("✅ Authentification invalide correctement rejetée");
        console.log(`   Erreur: ${response.data.error}`);
        console.log(`   Code: ${response.data.code}`);

        this.testResults.push({
          test: "Invalid Auth",
          status: "PASS",
          details: response.data,
        });
        return true;
      } else {
        console.log(
          "❌ Authentification invalide acceptée (PROBLÈME DE SÉCURITÉ)",
        );
        this.testResults.push({
          test: "Invalid Auth",
          status: "FAIL",
          details: response.data,
        });
        return false;
      }
    } catch (error) {
      console.log(
        "❌ Erreur lors du test d'authentification invalide:",
        error.message,
      );
      this.testResults.push({
        test: "Invalid Auth",
        status: "ERROR",
        details: error.message,
      });
      return false;
    }
  }

  /**
   * Teste l'authentification avec le bon mot de passe
   */
  async testValidAuth() {
    console.log("\n🔍 Test d'authentification avec mot de passe valide...");

    try {
      // Récupération du mot de passe depuis le fichier .env
      const fs = require("fs");
      const envContent = fs.readFileSync(".env", "utf8");
      const passwordMatch = envContent.match(/HEALTH_PASSWORD=(.+)/);

      if (!passwordMatch) {
        console.log("❌ Mot de passe Health non trouvé dans .env");
        return false;
      }

      const password = passwordMatch[1];
      const response = await this.makeRequest(
        "POST",
        "/api/auth/health",
        {},
        {
          password: password,
        },
      );

      if (response.status === 200 && response.data.success) {
        console.log("✅ Authentification réussie");
        console.log(
          `   Token JWT généré: ${response.data.token.substring(0, 50)}...`,
        );
        console.log(`   Expiration: ${response.data.expires_in}`);
        console.log(`   Permissions: ${response.data.permissions.join(", ")}`);
        console.log(`   Niveau de sécurité: ${response.data.security_level}`);

        this.testResults.push({
          test: "Valid Auth",
          status: "PASS",
          details: {
            token_length: response.data.token.length,
            expires_in: response.data.expires_in,
            permissions: response.data.permissions,
            security_level: response.data.security_level,
          },
        });

        return response.data.token;
      } else {
        console.log("❌ Authentification valide échouée");
        console.log(`   Erreur: ${response.data.error}`);
        this.testResults.push({
          test: "Valid Auth",
          status: "FAIL",
          details: response.data,
        });
        return false;
      }
    } catch (error) {
      console.log(
        "❌ Erreur lors du test d'authentification valide:",
        error.message,
      );
      this.testResults.push({
        test: "Valid Auth",
        status: "ERROR",
        details: error.message,
      });
      return false;
    }
  }

  /**
   * Teste l'accès à l'endpoint de santé sans token
   */
  async testHealthWithoutToken() {
    console.log("\n🔍 Test d'accès à /health sans token...");

    try {
      const response = await this.makeRequest("GET", "/health");

      if (response.status === 401) {
        console.log("✅ Accès à /health sans token correctement bloqué");
        console.log(`   Erreur: ${response.data.error}`);
        console.log(`   Code: ${response.data.code}`);
        console.log(`   Niveau de sécurité: ${response.data.security_level}`);

        this.testResults.push({
          test: "Health Without Token",
          status: "PASS",
          details: response.data,
        });
        return true;
      } else {
        console.log(
          "❌ Accès à /health sans token autorisé (PROBLÈME DE SÉCURITÉ)",
        );
        this.testResults.push({
          test: "Health Without Token",
          status: "FAIL",
          details: response.data,
        });
        return false;
      }
    } catch (error) {
      console.log("❌ Erreur lors du test d'accès sans token:", error.message);
      this.testResults.push({
        test: "Health Without Token",
        status: "ERROR",
        details: error.message,
      });
      return false;
    }
  }

  /**
   * Teste l'accès à l'endpoint de santé avec token valide
   */
  async testHealthWithToken(token) {
    console.log("\n🔍 Test d'accès à /health avec token valide...");

    try {
      const response = await this.makeRequest("GET", "/health", {
        Authorization: `Bearer ${token}`,
      });

      if (response.status === 200 && response.data.status === "OK") {
        console.log("✅ Accès à /health avec token autorisé");
        console.log(`   Statut: ${response.data.status}`);
        console.log(`   Message: ${response.data.message}`);
        console.log(
          `   Utilisateur authentifié: ${response.data.authenticated_user}`,
        );
        console.log(`   Sécurité JWT: ${response.data.services.jwt}`);
        console.log(`   Niveau de sécurité: ${response.data.security.level}`);

        this.testResults.push({
          test: "Health With Token",
          status: "PASS",
          details: {
            status: response.data.status,
            authenticated_user: response.data.authenticated_user,
            security_level: response.data.security.level,
            jwt_enabled: response.data.services.jwt,
          },
        });
        return true;
      } else {
        console.log("❌ Accès à /health avec token refusé");
        console.log(`   Statut HTTP: ${response.status}`);
        console.log(`   Données: ${JSON.stringify(response.data)}`);
        this.testResults.push({
          test: "Health With Token",
          status: "FAIL",
          details: response.data,
        });
        return false;
      }
    } catch (error) {
      console.log("❌ Erreur lors du test d'accès avec token:", error.message);
      this.testResults.push({
        test: "Health With Token",
        status: "ERROR",
        details: error.message,
      });
      return false;
    }
  }

  /**
   * Teste la vérification de token
   */
  async testTokenVerification(token) {
    console.log("\n🔍 Test de vérification de token...");

    try {
      const response = await this.makeRequest("POST", "/api/auth/verify", {
        Authorization: `Bearer ${token}`,
      });

      if (response.status === 200 && response.data.valid) {
        console.log("✅ Vérification de token réussie");
        console.log(`   Utilisateur: ${response.data.user.id}`);
        console.log(`   Émetteur: ${response.data.user.issuer}`);
        console.log(
          `   Niveau de sécurité: ${response.data.user.security_level}`,
        );
        console.log(`   Expire le: ${response.data.user.expires_at}`);

        this.testResults.push({
          test: "Token Verification",
          status: "PASS",
          details: response.data.user,
        });
        return true;
      } else {
        console.log("❌ Vérification de token échouée");
        this.testResults.push({
          test: "Token Verification",
          status: "FAIL",
          details: response.data,
        });
        return false;
      }
    } catch (error) {
      console.log("❌ Erreur lors de la vérification de token:", error.message);
      this.testResults.push({
        test: "Token Verification",
        status: "ERROR",
        details: error.message,
      });
      return false;
    }
  }

  /**
   * Affiche le résumé des tests
   */
  displaySummary() {
    console.log("\n📊 === RÉSUMÉ DES TESTS DE SÉCURITÉ ===");

    const passed = this.testResults.filter((r) => r.status === "PASS").length;
    const failed = this.testResults.filter((r) => r.status === "FAIL").length;
    const errors = this.testResults.filter((r) => r.status === "ERROR").length;
    const total = this.testResults.length;

    console.log(`Total des tests: ${total}`);
    console.log(`✅ Réussis: ${passed}`);
    console.log(`❌ Échoués: ${failed}`);
    console.log(`⚠️  Erreurs: ${errors}`);

    const successRate = Math.round((passed / total) * 100);
    console.log(`📈 Taux de réussite: ${successRate}%`);

    if (successRate === 100) {
      console.log("\n🎉 TOUS LES TESTS DE SÉCURITÉ SONT PASSÉS !");
      console.log("🔒 Le système DK BUILDING est sécurisé au niveau NSA");
    } else if (successRate >= 80) {
      console.log(
        "\n⚠️  La plupart des tests sont passés, mais des améliorations sont nécessaires",
      );
    } else {
      console.log("\n🚨 PROBLÈMES DE SÉCURITÉ DÉTECTÉS !");
      console.log("🔧 Des corrections urgentes sont nécessaires");
    }

    console.log("\n📋 Détails des tests:");
    this.testResults.forEach((result, index) => {
      const icon =
        result.status === "PASS"
          ? "✅"
          : result.status === "FAIL"
            ? "❌"
            : "⚠️";
      console.log(`${icon} ${index + 1}. ${result.test}: ${result.status}`);
    });
  }

  /**
   * Exécute tous les tests de sécurité
   */
  async runAllTests() {
    console.log("🚀 === TESTS DE SÉCURITÉ DK BUILDING ===");
    console.log("Sécurité niveau NSA - 128 bits minimum\n");

    // Test 1: Statut d'authentification
    const authStatusOk = await this.testAuthStatus();

    // Test 2: Authentification invalide
    await this.testInvalidAuth();

    // Test 3: Authentification valide
    const token = await this.testValidAuth();

    // Test 4: Accès sans token
    await this.testHealthWithoutToken();

    // Test 5: Accès avec token (si authentification réussie)
    if (token) {
      await this.testHealthWithToken(token);
      await this.testTokenVerification(token);
    }

    // Résumé
    this.displaySummary();
  }
}

// Exécution des tests
if (require.main === module) {
  const tester = new SecurityTester();
  tester.runAllTests().catch(console.error);
}

module.exports = SecurityTester;
