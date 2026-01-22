import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// Plugin Vite pour injecter le CSP dynamique
function cspPlugin() {
  return {
    name: 'csp-injector',
    transformIndexHtml(html, context) {
      const mode = context.server ? 'development' : 'production'
      
      // Générer le CSP selon le mode
      const isDev = mode === 'development'
      let csp
      
      if (isDev) {
        // CSP permissif pour le développement
        csp = [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' data: https://fonts.gstatic.com",
          "img-src 'self' data: blob: https://images.unsplash.com https://res.cloudinary.com",
          "media-src 'self' https://static.vecteezy.com https://res.cloudinary.com",
          "connect-src 'self' ws: wss: http://localhost:* http://127.0.0.1:* http://192.168.1.124:* *.trycloudflare.com https://api.cloudinary.com",
          "worker-src 'self' blob:",
          "frame-src 'self'",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'"
        ].join('; ')
      } else {
        // CSP strict pour la production
        csp = [
          "default-src 'self'",
          "script-src 'self' https://www.googletagmanager.com",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' data: https://fonts.gstatic.com",
          "img-src 'self' data: blob: https://images.unsplash.com https://res.cloudinary.com",
          "media-src 'self' https://static.vecteezy.com https://res.cloudinary.com",
          "connect-src 'self' https://api.cloudinary.com",
          "worker-src 'self' blob:",
          "frame-src 'none'",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          "upgrade-insecure-requests",
          "block-all-mixed-content"
        ].join('; ')
      }
      
      const cspMetaTag = `<meta http-equiv="Content-Security-Policy" content="${csp.replace(/"/g, '&quot;')}" />`
      
      // Remplacer le placeholder par le CSP généré
      return html.replace(
        /<!-- VITE_CSP_META_TAG -->/g,
        cspMetaTag
      )
    }
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Charger les variables d'environnement
  const __dirname = dirname(fileURLToPath(import.meta.url))
  const env = loadEnv(mode, resolve(__dirname, '..'), '')
  
  return {
    plugins: [
      react(),
      cspPlugin()
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    },
    server: {
      port: parseInt(env.PORT) || 5173,
      host: true, // Permet l'accès depuis d'autres machines
      // Autoriser les domaines Cloudflare Tunnel pour l'accès externe
      allowedHosts: [
        '.trycloudflare.com', // Autoriser tous les sous-domaines Cloudflare Tunnel
        'localhost',
        '127.0.0.1',
        '192.168.1.124', // IP réseau local
        'admin.dkbuilding.fr', // Sous-domaine admin
        'administrateur.dkbuilding.fr', // Alternative
        'administrator.dkbuilding.fr', // Alternative
      ],
      proxy: {
        '/api': {
          target: env.API_BASE_URL || 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path, // Garder le chemin tel quel
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.error('Proxy error:', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log(`[Proxy] ${req.method} ${req.url} -> ${proxyReq.path}`);
            });
          },
        },
        '/health': {
          target: env.API_BASE_URL || 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
        }
      }
    },
    define: {
      // Exposer les variables d'environnement nécessaires
      // En développement, on utilise le proxy Vite, donc on laisse API_BASE_URL vide
      // pour forcer l'utilisation du proxy /api
      'import.meta.env.API_URL': JSON.stringify(env.API_URL || env.API_BASE_URL || ''),
      'import.meta.env.API_BASE_URL': JSON.stringify(env.API_BASE_URL || env.API_URL || ''),
      'import.meta.env.BASE_URL': JSON.stringify(env.BASE_URL || 'http://localhost:5173'),
      // Variables Cloudinary (exposées pour uploads frontend-only)
      'import.meta.env.CLOUDINARY_CLOUD_NAME': JSON.stringify(env.CLOUDINARY_CLOUD_NAME || ''),
      'import.meta.env.CLOUDINARY_API_KEY': JSON.stringify(env.CLOUDINARY_API_KEY || ''),
      'import.meta.env.CLOUDINARY_UPLOAD_PRESET': JSON.stringify(env.CLOUDINARY_UPLOAD_PRESET || ''),
      'import.meta.env.CLOUDINARY_FOLDER': JSON.stringify(env.CLOUDINARY_FOLDER || ''),
    }
  }
})
