#!/usr/bin/env node

require("dotenv").config();
const { createClient } = require("@libsql/client");
const fs = require("fs");
const path = require("path");

/**
 * Script d'initialisation de la base de données Turso
 * Architecture GovTech Zero-Cost pour DK BUILDING
 */

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error(
    "❌ Erreur : TURSO_DATABASE_URL ou TURSO_AUTH_TOKEN manquant dans le .env",
  );
  process.exit(1);
}

const db = createClient({ url, authToken });

async function init() {
  console.log("🚀 Connexion à Turso...");
  console.log(`📍 URL: ${url.substring(0, 50)}...`);

  try {
    // Vérifier la connexion
    await db.execute("SELECT 1");
    console.log("✅ Connexion réussie !");

    // Lecture du fichier SQL
    const sqlPath = path.join(
      __dirname,
      "../database/migrations/001_create_tables.sql",
    );

    if (!fs.existsSync(sqlPath)) {
      console.error(`❌ Fichier SQL introuvable: ${sqlPath}`);
      process.exit(1);
    }

    const sql = fs.readFileSync(sqlPath, "utf8");

    // Découper par instruction (;)
    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    console.log(`\n📦 ${statements.length} instructions SQL à exécuter...`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        await db.execute(statement);
        console.log(`✅ [${i + 1}/${statements.length}] Exécuté`);
      } catch (error) {
        // Ignorer les erreurs "table already exists"
        if (error.message.includes("already exists")) {
          console.log(
            `⚠️  [${i + 1}/${statements.length}] Table déjà existante (ignoré)`,
          );
        } else {
          console.error(
            `❌ [${i + 1}/${statements.length}] Erreur:`,
            error.message,
          );
        }
      }
    }

    console.log("\n✅ Base de données initialisée avec succès !");
    console.log(
      "🎉 Vous pouvez maintenant démarrer le serveur avec: pnpm run dev",
    );
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation :", error);
    process.exit(1);
  }
}

init();
