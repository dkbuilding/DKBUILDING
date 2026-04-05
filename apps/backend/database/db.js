const { createClient } = require("@libsql/client");

/**
 * Turso Database Connection
 * Ne PAS appeler dotenv ici — c'est fait dans server.js
 * Sur Vercel, les env vars sont injectées nativement dans process.env
 */

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error(
    "⚠️ Configuration Turso manquante — TURSO_DATABASE_URL ou TURSO_AUTH_TOKEN absent",
  );
  console.error("   Les fonctionnalités base de données seront désactivées");
}

let db;
try {
  db = createClient({
    url: url || "file:local.db",
    authToken: authToken || undefined,
  });
  if (url) {
    console.log(`✅ Connecté à Turso DB: ${url.substring(0, 40)}...`);
  }
} catch (error) {
  console.error("❌ Erreur connexion Turso:", error.message);
  // Fallback — ne PAS crasher le processus
  db = {
    execute: async () => ({ rows: [] }),
  };
}

module.exports = db;
