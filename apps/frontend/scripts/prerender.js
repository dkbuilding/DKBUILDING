#!/usr/bin/env node

/**
 * Script de pre-rendering pour DK BUILDING
 * Genere des pages HTML statiques a partir du build React SPA
 *
 * Usage: node scripts/prerender.js
 * Prerequis: npm run build doit avoir ete execute avant (ou le script le fait automatiquement)
 *
 * Note securite: les commandes execSync ci-dessous sont hardcodees (pas d'input utilisateur),
 * donc il n'y a pas de risque d'injection.
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const http = require("http");

// Routes a pre-rendre
const ROUTES = [
  "/",
  "/legal/mentions-legales",
  "/legal/politique-confidentialite",
  "/legal/cgv",
];

const DIST_DIR = path.join(__dirname, "..", "dist");
const PORT = 4173;

// Serveur statique simple pour servir le build
function startServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      let filePath = path.join(
        DIST_DIR,
        req.url === "/" ? "index.html" : req.url
      );

      // SPA fallback : si le fichier n'existe pas, servir index.html
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(DIST_DIR, "index.html");
      }

      const ext = path.extname(filePath);
      const contentTypes = {
        ".html": "text/html; charset=utf-8",
        ".js": "application/javascript",
        ".css": "text/css",
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".webp": "image/webp",
        ".avif": "image/avif",
        ".svg": "image/svg+xml",
        ".woff": "font/woff",
        ".woff2": "font/woff2",
        ".ttf": "font/ttf",
        ".ico": "image/x-icon",
      };

      const contentType =
        contentTypes[ext] || "application/octet-stream";

      try {
        res.writeHead(200, { "Content-Type": contentType });
        fs.createReadStream(filePath).pipe(res);
      } catch (err) {
        res.writeHead(404);
        res.end("Not found");
      }
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(
          `Le port ${PORT} est deja utilise. Arretez le processus existant ou changez le port.`
        );
        reject(err);
      } else {
        reject(err);
      }
    });

    server.listen(PORT, () => {
      console.log(
        `Serveur de pre-rendering demarre sur http://localhost:${PORT}`
      );
      resolve(server);
    });
  });
}

async function prerender() {
  console.log("Pre-rendering des pages statiques...\n");

  // Verifier que dist/ existe
  if (!fs.existsSync(DIST_DIR)) {
    console.log("Build non trouve, execution de vite build...");
    execSync("npx vite build", {
      cwd: path.join(__dirname, ".."),
      stdio: "inherit",
    });
  }

  // Lire le template HTML original
  const indexHtml = fs.readFileSync(
    path.join(DIST_DIR, "index.html"),
    "utf-8"
  );

  let server;
  let browser;

  try {
    // Importer puppeteer
    let puppeteer;
    try {
      puppeteer = require("puppeteer");
    } catch {
      console.log("Puppeteer non installe. Installation en cours...");
      execSync("npm install --no-save puppeteer", {
        cwd: path.join(__dirname, ".."),
        stdio: "inherit",
      });
      puppeteer = require("puppeteer");
    }

    server = await startServer();
    browser = await puppeteer.launch({ headless: "new" });

    let successCount = 0;
    let failCount = 0;

    for (const route of ROUTES) {
      const page = await browser.newPage();
      const url = `http://localhost:${PORT}${route}`;

      console.log(`  Pre-rendu: ${route}`);

      try {
        await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });

        // Attendre que React ait fini de rendre le contenu dans #root
        await page
          .waitForSelector("#root > *", { timeout: 10000 })
          .catch(() => {
            console.warn(`  Attention: pas de contenu trouve pour ${route}`);
          });

        // Recuperer le HTML du #root
        const rootContent = await page.evaluate(() => {
          return document.getElementById("root")?.innerHTML || "";
        });

        if (rootContent) {
          // Injecter le contenu pre-rendu dans le template
          const prerenderedHtml = indexHtml.replace(
            '<div id="root"></div>',
            `<div id="root">${rootContent}</div>`
          );

          // Ecrire le fichier HTML dans le bon dossier
          const outputDir = path.join(DIST_DIR, route === "/" ? "" : route);
          fs.mkdirSync(outputDir, { recursive: true });

          const outputFile =
            route === "/"
              ? path.join(DIST_DIR, "index.html")
              : path.join(outputDir, "index.html");

          fs.writeFileSync(outputFile, prerenderedHtml);
          console.log(`  OK ${outputFile.replace(DIST_DIR, "dist")}`);
          successCount++;
        } else {
          console.warn(`  Echec: aucun contenu pour ${route}`);
          failCount++;
        }
      } catch (err) {
        console.error(`  Erreur pour ${route}: ${err.message}`);
        failCount++;
      }

      await page.close();
    }

    console.log(
      `\nPre-rendering termine: ${successCount}/${ROUTES.length} pages generees`
    );
    if (failCount > 0) {
      console.warn(`${failCount} page(s) en echec.`);
    }
  } catch (error) {
    console.error("Erreur lors du pre-rendering:", error.message);
    console.log("\nPour utiliser le pre-rendering, installez puppeteer :");
    console.log("   cd apps/frontend && npm install --save-dev puppeteer");
    process.exit(1);
  } finally {
    if (browser) await browser.close();
    if (server) server.close();
  }
}

prerender();
