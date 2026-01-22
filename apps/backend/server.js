const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const contactRoutes = require("./routes/contact");
const lockaccessRoutes = require("./routes/lockaccess");
const authRoutes = require("./routes/auth");
const newsRoutes = require("./routes/news");
const annoncesRoutes = require("./routes/annonces");
const projetsRoutes = require("./routes/projets");
const mediaRoutes = require("./routes/media");
const adminRoutes = require("./routes/admin");
const emailService = require("./utils/emailService");
const JWTAuthMiddleware = require("./middleware/jwtAuth");
const { initDatabase, isDatabaseInitialized } = require("./utils/dbInit");
const { loadConfig } = require("./utils/lockAccessConfig");

const app = express();
const PORT = process.env.PORT || 3001;

// Charger la configuration LockAccess au démarrage
const lockAccessConfig = loadConfig();
process.env.LOCKACCESS = lockAccessConfig.enabled ? "true" : "false";
process.env.LOCKACCESS_LOCKED = lockAccessConfig.locked ? "true" : "false";
process.env.LOCKACCESS_MAINTENANCE_MODE = lockAccessConfig.maintenanceMode
  ? "true"
  : "false";
process.env.LOCKACCESS_ALLOWED_IPS = lockAccessConfig.allowedIPs.join(",");
process.env.LOCKACCESS_BLOCKED_IPS = lockAccessConfig.blockedIPs.join(",");

// Middleware de sécurité
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
      },
    },
  }),
);

// Middleware CORS
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "https://dkbuilding.fr",
  "https://www.dkbuilding.fr",
  "https://admin.dkbuilding.fr",
  "https://administrateur.dkbuilding.fr",
  "https://administrator.dkbuilding.fr",
  "http://admin.dkbuilding.fr", // Pour développement
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Autoriser les requêtes sans origine (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // Vérifier si l'origine est autorisée
      if (
        allowedOrigins.includes(origin) ||
        origin.includes("localhost") ||
        origin.includes("127.0.0.1")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Non autorisé par CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Middleware de logging
app.use(morgan("combined"));

// Middleware pour parser le JSON
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ============================================
// SECURITY ENHANCEMENTS - GovTech Architecture
// ============================================

// Import des middlewares de sécurité
const sanitizeInput = require("./middleware/sanitizer");
const { publicLimiter, loginLimiter } = require("./middleware/rateLimiter");
const { adminGuard } = require("./middleware/adminGuard");

// 1. Request Sanitization (Protection XSS)
// Appliqué sur toutes les routes pour nettoyer les données entrantes
app.use(sanitizeInput);

// 2. Rate Limiting Public
// Appliqué sur toutes les routes publiques
app.use("/api", publicLimiter);

// ============================================

// Initialisation du middleware JWT
const jwtAuth = new JWTAuthMiddleware();

// Initialisation de la base de données SQLite
if (!isDatabaseInitialized()) {
  console.log("🔄 Initialisation de la base de données SQLite...");
  try {
    initDatabase();
    console.log("✅ Base de données initialisée");
  } catch (error) {
    console.error(
      "❌ Erreur lors de l'initialisation de la base de données:",
      error,
    );
  }
}

// ============================================
// ROUTES WITH SECURITY MIDDLEWARE
// ============================================

// Routes publiques (avec rate limiting public)
app.use("/api", contactRoutes);
app.use("/api/lockaccess", lockaccessRoutes);
app.use("/api", newsRoutes);
app.use("/api/annonces", annoncesRoutes);
app.use("/api/projets", projetsRoutes);
app.use("/api/media", mediaRoutes);

// Routes d'authentification (avec rate limiting strict pour login)
app.use("/api/auth", loginLimiter, authRoutes);

// Routes admin (avec admin guard complet)
app.use("/api/admin", adminGuard, adminRoutes);

// ============================================

// Route de santé sécurisée
app.get("/health", jwtAuth.authenticateToken.bind(jwtAuth), (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();

  res.status(200).json({
    status: "OK",
    message: "DK BUILDING API is running",
    timestamp: new Date().toISOString(),
    version: "latest",
    uptime: {
      seconds: `${Math.floor(uptime)}s`,
      human: formatUptime(uptime),
    },
    system: {
      platform: process.platform,
      nodeVersion: process.version,
      pid: process.pid,
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
        external: `${Math.round(memoryUsage.external / 1024 / 1024)} MB`,
      },
    },
    services: {
      email: emailService.isConfigured() ? "Configured" : "Not configured",
      cors: "Enabled",
      helmet: "Enabled",
      morgan: "Enabled",
      jwt: "Enabled",
      lockaccess: {
        enabled: process.env.LOCKACCESS === "true",
        maintenanceMode: process.env.LOCKACCESS_MAINTENANCE_MODE === "true",
      },
    },
    security: {
      level: process.env.JWT_SECURITY_LEVEL || "NSA_128_BITS",
      algorithm: process.env.JWT_ALGORITHM || "sha512",
      key_length: process.env.SECURITY_KEY_LENGTH || "512",
      iterations: process.env.SECURITY_ITERATIONS || "100000",
    },
    environment: process.env.NODE_ENV || "development",
    port: PORT,
    authenticated_user: req.user.id,
  });
});

// Fonction utilitaire pour formater le temps de fonctionnement
function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (days > 0) {
    return `${days}j ${hours}h ${minutes}m ${secs}s`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

// Route racine
app.get("/", (req, res) => {
  res.json({
    message: "DK BUILDING API",
    version: "latest",
    security_level: process.env.JWT_SECURITY_LEVEL || "NSA_128_BITS",
    endpoints: {
      health: "/health (Authentifié)",
      contact: "/api/contact",
      auth: "/api/auth",
      lockaccess: "/api/lockaccess",
      news: "/api/news",
      annonces: "/api/annonces",
      projets: "/api/projets",
      media: "/api/media",
      admin: "/api/admin",
    },
    authentication: {
      required_for_health: true,
      algorithm: process.env.JWT_ALGORITHM || "sha512",
      key_length: process.env.SECURITY_KEY_LENGTH || "512",
    },
  });
});

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
  console.error("Error:", err);

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      error: "Invalid JSON format",
      message: "Le format JSON envoyé est invalide",
    });
  }

  res.status(500).json({
    error: "Internal Server Error",
    message: "Une erreur interne s'est produite",
  });
});

// Gestion des routes non trouvées
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: "Route non trouvée",
  });
});

// Démarrage du serveur (uniquement en développement local)
// En production Vercel, l'app est exportée comme serverless function
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 DK BUILDING API démarrée sur le port ${PORT}`);
    console.log(
      `🔒 Sécurité niveau: ${process.env.JWT_SECURITY_LEVEL || "NSA_128_BITS"}`,
    );
    console.log(`🔐 Algorithme JWT: ${process.env.JWT_ALGORITHM || "sha512"}`);
    console.log(
      `📧 Service email: ${emailService.isConfigured() ? "Configuré" : "Non configuré"}`,
    );
    console.log(
      `🌐 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`,
    );
    console.log(`⚠️  Health Monitoring: Authentification JWT requise`);
  });
} else {
  console.log("🚀 DK BUILDING API - Mode Serverless (Vercel)");
}

// Export pour Vercel Serverless Functions
module.exports = app;
