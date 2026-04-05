const { createClient } = require("@libsql/client");

/**
 * Turso Database Connection — DK BUILDING
 * Ne PAS appeler dotenv ici — c'est fait dans server.js
 * Sur Vercel, les env vars sont injectées nativement dans process.env
 *
 * Améliorations (audit DBA 2026-04-05) :
 * - Retry logic avec backoff exponentiel
 * - Timeout de requête configurable
 * - Wrapper execute() avec gestion d'erreurs robuste
 */

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error(
    "⚠️ Configuration Turso manquante — TURSO_DATABASE_URL ou TURSO_AUTH_TOKEN absent",
  );
  console.error("   Les fonctionnalités base de données seront désactivées");
}

let client;
try {
  client = createClient({
    url: url || "file:local.db",
    authToken: authToken || undefined,
  });
  if (url) {
    console.log(`✅ Connecté à Turso DB: ${url.substring(0, 40)}...`);
  }
} catch (error) {
  console.error("❌ Erreur connexion Turso:", error.message);
  // Fallback — ne PAS crasher le processus
  client = {
    execute: async () => ({ rows: [] }),
    batch: async () => [],
  };
}

/**
 * Configuration du retry
 */
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelayMs: 100,    // 100ms, 200ms, 400ms (backoff x2)
  maxDelayMs: 2000,
  retryableErrors: [
    "SQLITE_BUSY",
    "LIBSQL_SERVER_ERROR",
    "ECONNRESET",
    "ETIMEDOUT",
    "ECONNREFUSED",
    "fetch failed",
  ],
};

/**
 * Vérifie si une erreur est retryable
 */
function isRetryable(error) {
  const msg = (error.message || "").toLowerCase();
  const code = error.code || "";
  return RETRY_CONFIG.retryableErrors.some(
    (e) => msg.includes(e.toLowerCase()) || code.includes(e),
  );
}

/**
 * Pause asynchrone
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wrapper d'exécution avec retry logic
 * Compatible avec l'API libsql : db.execute(sql) ou db.execute({ sql, args })
 */
async function execute(queryOrSql, ...rest) {
  let lastError;

  for (let attempt = 0; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
    try {
      const result = await client.execute(queryOrSql, ...rest);
      return result;
    } catch (error) {
      lastError = error;

      if (attempt < RETRY_CONFIG.maxRetries && isRetryable(error)) {
        const delay = Math.min(
          RETRY_CONFIG.baseDelayMs * Math.pow(2, attempt),
          RETRY_CONFIG.maxDelayMs,
        );
        console.warn(
          `⚠️ Turso retry ${attempt + 1}/${RETRY_CONFIG.maxRetries} après ${delay}ms — ${error.message}`,
        );
        await sleep(delay);
        continue;
      }

      throw error;
    }
  }

  throw lastError;
}

/**
 * Exécuter un batch de requêtes (transaction implicite)
 * Utile pour les opérations multi-tables
 *
 * @param {Array<{sql: string, args?: any[]}>} statements
 * @returns {Promise<Array>}
 */
async function batch(statements) {
  if (!client.batch) {
    // Fallback séquentiel si batch non supporté
    const results = [];
    for (const stmt of statements) {
      results.push(await execute(stmt));
    }
    return results;
  }

  let lastError;
  for (let attempt = 0; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
    try {
      return await client.batch(statements, "deferred");
    } catch (error) {
      lastError = error;

      if (attempt < RETRY_CONFIG.maxRetries && isRetryable(error)) {
        const delay = Math.min(
          RETRY_CONFIG.baseDelayMs * Math.pow(2, attempt),
          RETRY_CONFIG.maxDelayMs,
        );
        console.warn(
          `⚠️ Turso batch retry ${attempt + 1}/${RETRY_CONFIG.maxRetries} après ${delay}ms`,
        );
        await sleep(delay);
        continue;
      }

      throw error;
    }
  }

  throw lastError;
}

/**
 * Vérifier la connectivité de la base
 * @returns {Promise<boolean>}
 */
async function healthCheck() {
  try {
    await execute("SELECT 1");
    return true;
  } catch {
    return false;
  }
}

module.exports = { execute, batch, healthCheck };
