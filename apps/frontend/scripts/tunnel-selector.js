#!/usr/bin/env node

/**
 * Script sélecteur de tunnel
 * Permet de choisir entre différentes solutions de tunneling
 *
 * @author DK BUILDING
 * @version latest
 */

import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Récupérer le type de tunnel depuis les variables d'environnement
const TUNNEL_TYPE = process.env.TUNNEL_TYPE || "cloudflare";

const tunnelScripts = {
  cloudflare: join(__dirname, "tunnel.js"), // tunnel.js est maintenant Cloudflare
  ngrok: join(__dirname, "tunnel-ngrok.js"),
};

// Fonction pour vérifier la disponibilité d'un tunnel
async function checkTunnelAvailable(type) {
  return new Promise((resolve) => {
    const commands = {
      cloudflare: "cloudflared",
      ngrok: "ngrok",
    };

    const cmd = commands[type];
    if (!cmd) {
      resolve(false);
      return;
    }

    const check = spawn(cmd, ["--version"], { stdio: "pipe" });
    check.on("close", (code) => resolve(code === 0));
    check.on("error", () => resolve(false));
  });
}

// Fonction principale
(async () => {
  try {
    const tunnelType = TUNNEL_TYPE.toLowerCase();

    // Vérifier que le type de tunnel est supporté
    if (!tunnelScripts[tunnelType]) {
      console.error(`❌ Type de tunnel non supporté: ${tunnelType}`);
      console.error("\n📋 Types disponibles:");
      console.error("   - cloudflare (recommandé, par défaut)");
      console.error("   - ngrok");
      process.exit(1);
    }

    // Vérifier la disponibilité du tunnel
    const isAvailable = await checkTunnelAvailable(tunnelType);

    if (!isAvailable) {
      console.error(`❌ ${tunnelType} n'est pas installé`);

      if (tunnelType === "cloudflare") {
        console.error("\n📦 Installation :");
        console.error("   macOS: brew install cloudflared");
        console.error(
          "   Linux: Téléchargez depuis https://github.com/cloudflare/cloudflared/releases",
        );
        console.error("   Windows: winget install --id Cloudflare.cloudflared");
      } else if (tunnelType === "ngrok") {
        console.error("\n📦 Installation :");
        console.error("   macOS: brew install ngrok");
        console.error(
          "   Linux: Téléchargez depuis https://ngrok.com/download",
        );
        console.error("   Windows: winget install ngrok");
        console.error("\n🔑 Après installation, configurez votre token :");
        console.error("   ngrok config add-authtoken YOUR_TOKEN");
        console.error(
          "   (Obtenez votre token sur https://dashboard.ngrok.com/get-started/your-authtoken)",
        );
      }

      process.exit(1);
    }

    // Lancer le script de tunnel approprié
    const scriptPath = tunnelScripts[tunnelType];
    const tunnelProcess = spawn("node", [scriptPath], {
      stdio: "inherit",
      env: process.env,
    });

    tunnelProcess.on("close", (code) => {
      process.exit(code || 0);
    });

    tunnelProcess.on("error", (err) => {
      console.error("❌ Erreur lors du lancement du tunnel :", err.message);
      process.exit(1);
    });

    // Gérer l'arrêt propre
    process.on("SIGINT", () => {
      tunnelProcess.kill("SIGTERM");
    });

    process.on("SIGTERM", () => {
      tunnelProcess.kill("SIGTERM");
    });
  } catch (error) {
    console.error("❌ Erreur :", error.message);
    process.exit(1);
  }
})();
