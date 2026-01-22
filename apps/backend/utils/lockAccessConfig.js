const fs = require('fs');
const path = require('path');

const CONFIG_FILE = path.join(__dirname, '../data/lockaccess-config.json');

/**
 * Charge la configuration LockAccess depuis le fichier
 */
function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Erreur lors du chargement de la config LockAccess:', error);
  }

  // Configuration par défaut
  return {
    enabled: process.env.LOCKACCESS === 'true',
    locked: process.env.LOCKACCESS_LOCKED === 'true',
    maintenanceMode: process.env.LOCKACCESS_MAINTENANCE_MODE === 'true',
    allowedIPs: process.env.LOCKACCESS_ALLOWED_IPS ? 
      process.env.LOCKACCESS_ALLOWED_IPS.split(',').map(ip => ip.trim()) : 
      ['127.0.0.1', '::1'],
    blockedIPs: process.env.LOCKACCESS_BLOCKED_IPS ? 
      process.env.LOCKACCESS_BLOCKED_IPS.split(',').map(ip => ip.trim()) : 
      []
  };
}

/**
 * Sauvegarde la configuration LockAccess dans le fichier
 */
function saveConfig(config) {
  try {
    const configDir = path.dirname(CONFIG_FILE);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');
    
    // Mettre à jour les variables d'environnement pour cette session
    process.env.LOCKACCESS = config.enabled ? 'true' : 'false';
    process.env.LOCKACCESS_LOCKED = config.locked ? 'true' : 'false';
    process.env.LOCKACCESS_MAINTENANCE_MODE = config.maintenanceMode ? 'true' : 'false';
    process.env.LOCKACCESS_ALLOWED_IPS = config.allowedIPs.join(',');
    process.env.LOCKACCESS_BLOCKED_IPS = config.blockedIPs.join(',');

    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la config LockAccess:', error);
    return false;
  }
}

/**
 * Met à jour la configuration LockAccess
 */
function updateConfig(updates) {
  const currentConfig = loadConfig();
  const newConfig = {
    ...currentConfig,
    ...updates,
    lastUpdated: new Date().toISOString()
  };
  
  return saveConfig(newConfig);
}

/**
 * Récupère la configuration actuelle
 */
function getConfig() {
  return loadConfig();
}

module.exports = {
  loadConfig,
  saveConfig,
  updateConfig,
  getConfig
};

