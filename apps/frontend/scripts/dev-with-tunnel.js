#!/usr/bin/env node

/**
 * Script pour démarrer Vite et le tunnel Cloudflare simultanément
 * Permet d'accéder au serveur de développement depuis Internet
 * Utilise Cloudflare Tunnel (cloudflared) - Alternative moderne et fiable
 * 
 * @author DK BUILDING
 * @version 3.0.0
 */

import { spawn, execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

// S'assurer que le port est un nombre valide
const PORT = (() => {
  const envPort = process.env.PORT;
  if (!envPort) return 5173;
  const parsed = parseInt(envPort, 10);
  return isNaN(parsed) ? 5173 : parsed;
})();

const HOSTNAME = process.env.TUNNEL_HOSTNAME || undefined; // Optionnel : sous-domaine personnalisé
const URL = `http://localhost:${PORT}`;

let viteProcess = null;
let tunnelProcess = null;

// Fonction pour installer cloudflared selon le système d'exploitation
async function installCloudflared() {
  const platform = process.platform;
  console.log('📦 Installation de cloudflared...\n');

  try {
    if (platform === 'darwin') {
      // macOS - utiliser Homebrew
      console.log('🍺 Installation via Homebrew...');
      execSync('brew install cloudflared', { stdio: 'inherit' });
    } else if (platform === 'linux') {
      // Linux - essayer plusieurs méthodes
      console.log('🐧 Installation pour Linux...');
      try {
        // Essayer avec apt (Debian/Ubuntu)
        execSync('sudo apt-get update && sudo apt-get install -y cloudflared', { stdio: 'inherit' });
      } catch {
        try {
          // Essayer avec yum (RHEL/CentOS)
          execSync('sudo yum install -y cloudflared', { stdio: 'inherit' });
        } catch {
          // Essayer avec dnf (Fedora)
          execSync('sudo dnf install -y cloudflared', { stdio: 'inherit' });
        }
      }
    } else if (platform === 'win32') {
      // Windows - utiliser winget
      console.log('🪟 Installation via winget...');
      execSync('winget install --id Cloudflare.cloudflared --accept-source-agreements --accept-package-agreements', { stdio: 'inherit' });
    } else {
      throw new Error(`Système d'exploitation non supporté: ${platform}`);
    }
    
    console.log('\n✅ cloudflared installé avec succès !\n');
    return true;
  } catch {
    console.error('\n❌ Échec de l\'installation automatique');
    console.error('\n📦 Installation manuelle requise :');
    if (platform === 'darwin') {
      console.error('   brew install cloudflared');
    } else if (platform === 'linux') {
      console.error('   Téléchargez depuis https://github.com/cloudflare/cloudflared/releases');
      console.error('   Ou utilisez votre gestionnaire de paquets :');
      console.error('     - Debian/Ubuntu: sudo apt-get install cloudflared');
      console.error('     - RHEL/CentOS: sudo yum install cloudflared');
      console.error('     - Fedora: sudo dnf install cloudflared');
    } else if (platform === 'win32') {
      console.error('   winget install --id Cloudflare.cloudflared');
    }
    return false;
  }
}

// Fonction pour nettoyer et quitter
function cleanup() {
  console.log('\n\n🛑 Arrêt en cours...\n');
  
  if (tunnelProcess) {
    console.log('🔒 Fermeture du tunnel...');
    tunnelProcess.kill('SIGTERM');
  }
  
  if (viteProcess) {
    console.log('🔒 Arrêt du serveur Vite...');
    viteProcess.kill('SIGTERM');
  }
  
  setTimeout(() => {
    process.exit(0);
  }, 1000);
}

// Gérer les signaux d'arrêt
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Vérifier que cloudflared est installé
(async () => {
  try {
    await new Promise((resolve, reject) => {
      const check = spawn('cloudflared', ['--version'], { stdio: 'pipe' });
      check.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error('cloudflared non trouvé'));
        }
      });
      check.on('error', () => reject(new Error('cloudflared non installé')));
    });
  } catch {
    console.log('⚠️  cloudflared n\'est pas installé');
    console.log('🔄 Tentative d\'installation automatique...\n');
    
    const installed = await installCloudflared();
    if (!installed) {
      process.exit(1);
    }
    
    // Vérifier à nouveau après installation
    try {
      await new Promise((resolve, reject) => {
        const check = spawn('cloudflared', ['--version'], { stdio: 'pipe' });
        check.on('close', (code) => {
          if (code === 0) resolve();
          else reject(new Error('cloudflared toujours non trouvé'));
        });
        check.on('error', () => reject(new Error('cloudflared toujours non installé')));
      });
      console.log('✅ cloudflared est maintenant disponible !\n');
    } catch {
      console.error('\n❌ cloudflared n\'est toujours pas disponible après installation');
      console.error('💡 Veuillez installer manuellement et réessayer');
      process.exit(1);
    }
  }
})();

// Démarrer Vite
console.log('🚀 Démarrage du serveur Vite...\n');
viteProcess = spawn('pnpm', ['run', 'dev'], {
  cwd: ROOT_DIR,
  stdio: 'inherit',
  shell: true,
});

viteProcess.on('error', (err) => {
  console.error('❌ Erreur lors du démarrage de Vite :', err.message);
  cleanup();
});

// Attendre que Vite soit prêt avant de créer le tunnel
setTimeout(() => {
  try {
    console.log('\n🌐 Création du tunnel Cloudflare...\n');
    console.log(`📡 Port local: ${PORT}`);
    console.log(`🔗 URL locale: ${URL}`);
    
    if (HOSTNAME) {
      console.log(`🌐 Sous-domaine: ${HOSTNAME}`);
    } else {
      console.log('🌐 Sous-domaine: aléatoire (généré par Cloudflare)');
    }
    
    // Construire la commande cloudflared
    const args = ['tunnel', '--url', URL];
    if (HOSTNAME) {
      args.push('--hostname', HOSTNAME);
    }
    
    // Lancer cloudflared
    tunnelProcess = spawn('cloudflared', args, {
      stdio: 'inherit'
    });
    
    tunnelProcess.on('error', (err) => {
      console.error('❌ Erreur du tunnel :', err.message);
      console.log('⚠️  Le serveur Vite continue de fonctionner en local');
    });
    
    tunnelProcess.on('close', (code) => {
      console.log('\n🔒 Tunnel fermé');
      if (viteProcess) {
        viteProcess.kill('SIGTERM');
      }
    });
    
    console.log('\n💡 Partagez l\'URL publique pour permettre l\'accès depuis Internet');
    console.log('⚠️  Appuyez sur Ctrl+C pour arrêter le serveur et le tunnel\n');
    
  } catch (error) {
    console.error('❌ Erreur lors de la création du tunnel :', error.message);
    console.log('⚠️  Le serveur Vite continue de fonctionner en local');
  }
}, 3000); // Attendre 3 secondes pour que Vite démarre

