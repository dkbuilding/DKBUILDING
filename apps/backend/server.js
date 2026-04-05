const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
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
const { sendError, sendNotFound } = require("./utils/apiResponse");

const app = express();

// Charger la configuration LockAccess au démarrage
const lockAccessConfig = loadConfig();
process.env.LOCKACCESS = lockAccessConfig.enabled ? "true" : "false";
process.env.LOCKACCESS_LOCKED = lockAccessConfig.locked ? "true" : "false";
process.env.LOCKACCESS_MAINTENANCE_MODE = lockAccessConfig.maintenanceMode
  ? "true"
  : "false";
process.env.LOCKACCESS_ALLOWED_IPS = lockAccessConfig.allowedIPs.join(",");
process.env.LOCKACCESS_BLOCKED_IPS = lockAccessConfig.blockedIPs.join(",");

// ============================================
// MIDDLEWARE DE SÉCURITÉ
// ============================================

// 1. Helmet (headers de sécurité)
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
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    frameguard: { action: "deny" },
  }),
);

// 2. CORS (origines spécifiques, pas de wildcard)
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "https://dkbuilding.fr",
  "https://www.dkbuilding.fr",
  "https://admin.dkbuilding.fr",
  "https://administrateur.dkbuilding.fr",
  "https://administrator.dkbuilding.fr",
  "https://dkbuilding-frontend.vercel.app",
].filter(Boolean);

// En développement uniquement, autoriser localhost
if (process.env.NODE_ENV !== "production") {
  allowedOrigins.push("http://localhost:5173");
}

app.use(
  cors({
    origin: (origin, callback) => {
      // En production, refuser les requêtes sans Origin (sécurité CORS)
      // En développement, les autoriser (Postman, cURL, etc.)
      if (!origin) {
        if (process.env.NODE_ENV === "production") {
          return callback(new Error("Origin requise"), false);
        }
        return callback(null, true);
      }

      // Vérifier si l'origine est autorisée
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else if (process.env.NODE_ENV !== "production") {
        // En dev, autoriser localhost et 127.0.0.1
        try {
          const url = new URL(origin);
          if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
            return callback(null, true);
          }
        } catch {
          // URL invalide, refuser
        }
        callback(new Error("Non autorisé par CORS"));
      } else {
        callback(new Error("Non autorisé par CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// 3. Logging
app.use(morgan("combined"));

// 4. Cookies (JWT HttpOnly)
app.use(cookieParser());

// 5. Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ============================================
// SECURITY ENHANCEMENTS
// ============================================

const sanitizeInput = require("./middleware/sanitizer");
const { publicLimiter, loginLimiter, contactLimiter, uploadLimiter } = require("./middleware/rateLimiter");
const { adminGuard } = require("./middleware/adminGuard");

// 6. Sanitisation XSS sur toutes les routes
app.use(sanitizeInput);

// 7. Rate limiting public
app.use("/api", publicLimiter);

// ============================================

// Initialisation du middleware JWT
const jwtAuth = new JWTAuthMiddleware();

// Initialisation de la base de données (async — Turso)
(async () => {
  try {
    const initialized = await isDatabaseInitialized();
    if (!initialized) {
      await initDatabase();
      console.log("Base de données initialisée");
    }
  } catch (error) {
    console.error("Erreur initialisation DB:", error.message);
  }
})();

// ============================================
// ROUTES
// ============================================

// Routes publiques
app.use("/api", contactRoutes);
app.use("/api/lockaccess", lockaccessRoutes);
app.use("/api", newsRoutes);
app.use("/api/annonces", annoncesRoutes);
app.use("/api/projets", projetsRoutes);
app.use("/api/media", mediaRoutes);

// Routes d'authentification (rate limiting strict)
app.use("/api/auth", loginLimiter, authRoutes);

// Routes admin (guard complet : rate limit + IP whitelist + JWT + role)
app.use("/api/admin", adminGuard, adminRoutes);

// ============================================

// Route de santé PUBLIQUE (pour monitoring externe : UptimeRobot, Vercel, etc.)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// Route de santé DÉTAILLÉE (protégée JWT — pour le dashboard admin)
app.get("/health/detailed", jwtAuth.authenticateToken.bind(jwtAuth), (req, res) => {
  const uptime = process.uptime();

  res.status(200).json({
    success: true,
    data: {
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: {
        seconds: `${Math.floor(uptime)}s`,
        human: formatUptime(uptime),
      },
      services: {
        email: emailService.isConfigured() ? "configured" : "not_configured",
      },
      environment: process.env.NODE_ENV || "development",
      nodeVersion: process.version,
    },
  });
});

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (days > 0) return `${days}j ${hours}h ${minutes}m ${secs}s`;
  if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
}

// Route racine
app.get("/", (req, res) => {
  res.json({
    success: true,
    data: {
      name: "DK BUILDING API",
      version: "latest",
      status: "OK",
    },
  });
});

// ============================================
// ERROR HANDLING CENTRALISÉ
// ============================================

// Middleware de gestion d'erreurs (format standardisé)
app.use((err, req, res, next) => {
  console.error("Error:", err);

  // Erreur de parsing JSON
  if (err.type === "entity.parse.failed") {
    return sendError(res, {
      status: 400,
      code: "INVALID_JSON",
      message: "Le format JSON envoyé est invalide",
    });
  }

  // Erreur CORS
  if (err.message && err.message.includes("CORS")) {
    return sendError(res, {
      status: 403,
      code: "CORS_ERROR",
      message: "Origine non autorisée",
    });
  }

  // Erreur générique
  sendError(res, {
    status: err.status || 500,
    code: err.code || "INTERNAL_SERVER_ERROR",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Une erreur interne s'est produite",
  });
});

// Routes non trouvées (404)
app.use((req, res) => {
  sendNotFound(res, `Route ${req.method} ${req.path} non trouvée`);
});

// ============================================
// DÉMARRAGE
// ============================================

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`DK BUILDING API démarrée sur le port ${PORT}`);
    console.log(`Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`);
  });
} else {
  console.log("DK BUILDING API - Mode Serverless (Vercel)");
}

module.exports = app;
