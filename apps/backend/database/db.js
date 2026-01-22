const { createClient } = require("@libsql/client");
require("dotenv").config();

/**
 * Turso Database Connection
 * Architecture GovTech Zero-Cost pour DK BUILDING
 *
 * Remplace better-sqlite3 (local) par @libsql/client (cloud)
 */

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error(
    "❌ ERREUR CRITIQUE: Configuration Turso manquante dans le .env",
  );
  console.error("   Ajoutez TURSO_DATABASE_URL et TURSO_AUTH_TOKEN");

  // En développement, on pourrait fallback sur un fichier local
  // mais pour la migration serverless, on force le cloud
  if (process.env.NODE_ENV === "production") {
    process.exit(1);
  }
}

const db = createClient({
  url,
  authToken,
});

console.log(`✅ Connecté à Turso DB: ${url.substring(0, 40)}...`);

module.exports = db;
