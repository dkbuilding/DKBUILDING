#!/usr/bin/env node

/**
 * Script pour exposer le serveur Vite via ngrok
 * Alternative populaire à localtunnel
 *
 * @author DK BUILDING
 * @version latest
 */

import { spawn } from "child_process";
import { writeFileSync } from "fs";

// S'assurer que le port est un nombre valide
const PORT = (() => {
  const envPort = process.env.PORT;
  if (!envPort) return 5173;
  const parsed = parseInt(envPort, 10);
  return isNaN(parsed) ? 5173 : parsed;
})();

const URL = `http://localhost:${PORT}`;

// Fonction principale async
(async () => {
  try {
    console.log("🚀 Démarrage du tunnel ngrok...\n");
    console.log(`📡 Port local: ${PORT}`);
    console.log(`🔗 URL locale: ${URL}\n`);

    // Vérifier que ngrok est installé
    try {
      await new Promise((resolve, reject) => {
        const check = spawn("ngrok", ["version"], { stdio: "pipe" });
        check.on("close", (code) => {
          if (code === 0) resolve();
          else reject(new Error("ngrok non trouvé"));
        });
        check.on("error", () => reject(new Error("ngrok non installé")));
      });
    } catch (error) {
      console.error("❌ Erreur : ngrok n'est pas installé");
      console.error("\n📦 Installation :");
      console.error("   macOS: brew install ngrok");
      console.error("   Linux: Téléchargez depuis https://ngrok.com/download");
      console.error("   Windows: winget install ngrok");
      console.error("\n🔑 Après installation, configurez votre token :");
      console.error("   ngrok config add-authtoken YOUR_TOKEN");
      console.error(
        "   (Obtenez votre token sur https://dashboard.ngrok.com/get-started/your-authtoken)",
      );
      process.exit(1);
    }

    console.log("⏳ Création du tunnel...\n");

    // Lancer ngrok
    const tunnel = spawn("ngrok", ["http", PORT.toString()], {
      stdio: ["ignore", "pipe", "pipe"],
    });

    let tunnelUrl = "";
    let outputBuffer = "";

    // Capturer la sortie stdout pour extraire l'URL
    tunnel.stdout.on("data", (data) => {
      const output = data.toString();
      outputBuffer += output;
      process.stdout.write(output);

      // Extraire l'URL du tunnel depuis la sortie ngrok
      // Format: "Forwarding https://xxxx-xxxx-xxxx.ngrok-free.app -> http://localhost:5173"
      const urlMatch = output.match(/https:\/\/[a-zA-Z0-9-]+\.ngrok[^.\s]+/g);
      if (urlMatch && !tunnelUrl) {
        tunnelUrl = urlMatch[0];

        // Sauvegarder l'URL dans un fichier pour que le script bash puisse la lire
        try {
          writeFileSync("/tmp/tunnel_url.txt", tunnelUrl, "utf8");
        } catch {
          // Ignorer les erreurs d'écriture
        }

        console.log("\n✅ Tunnel créé avec succès !\n");
        console.log("📡 URL publique :", tunnelUrl);
        console.log("🔗 URL locale    :", URL);
        console.log("\n💡 Partagez l'URL publique pour permettre l'accès");
        console.log("⚠️  Appuyez sur Ctrl+C pour fermer le tunnel");
        console.log("🌐 Interface web : http://localhost:4040\n");
      }
    });

    // Capturer les erreurs
    tunnel.stderr.on("data", (data) => {
      const error = data.toString();
      process.stderr.write(error);

      // Extraire l'URL même depuis stderr si nécessaire
      const urlMatch = error.match(/https:\/\/[a-zA-Z0-9-]+\.ngrok[^.\s]+/g);
      if (urlMatch && !tunnelUrl) {
        tunnelUrl = urlMatch[0];
        try {
          writeFileSync("/tmp/tunnel_url.txt", tunnelUrl, "utf8");
        } catch {}
      }
    });

    // Gérer la fermeture
    tunnel.on("close", (code) => {
      console.log("\n🔒 Tunnel fermé");
      process.exit(code || 0);
    });

    // Gérer les erreurs
    tunnel.on("error", (err) => {
      console.error("❌ Erreur du tunnel :", err.message);
      process.exit(1);
    });

    // Gérer l'arrêt propre
    process.on("SIGINT", () => {
      console.log("\n\n🛑 Fermeture du tunnel...");
      tunnel.kill("SIGTERM");
    });

    process.on("SIGTERM", () => {
      tunnel.kill("SIGTERM");
    });

    // Timeout pour extraire l'URL si elle n'a pas été trouvée rapidement
    setTimeout(() => {
      if (!tunnelUrl && outputBuffer) {
        const urlMatch = outputBuffer.match(
          /https:\/\/[a-zA-Z0-9-]+\.ngrok[^.\s]+/g,
        );
        if (urlMatch) {
          tunnelUrl = urlMatch[0];
          try {
            writeFileSync("/tmp/tunnel_url.txt", tunnelUrl, "utf8");
          } catch {}
          console.log("\n✅ URL du tunnel :", tunnelUrl);
        }
      }
    }, 5000);
  } catch (error) {
    console.error("❌ Erreur lors de la création du tunnel :", error.message);
    process.exit(1);
  }
})();
