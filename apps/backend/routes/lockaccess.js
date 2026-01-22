const express = require('express');
const router = express.Router();
const { getConfig, updateConfig } = require('../utils/lockAccessConfig');

/**
 * Route pour récupérer la configuration LockAccess
 * GET /api/lockaccess/config
 */
router.get('/config', (req, res) => {
  try {
    const config = getConfig();
    config.timestamp = new Date().toISOString();
    config.environment = process.env.NODE_ENV || 'development';

    res.status(200).json({
      success: true,
      data: config,
      message: 'Configuration LockAccess récupérée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la config LockAccess:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur',
      message: 'Impossible de récupérer la configuration LockAccess'
    });
  }
});

/**
 * Route pour vérifier si l'IP du client est autorisée
 * GET /api/lockaccess/check-access
 */
router.get('/check-access', (req, res) => {
  try {
    const config = getConfig();
    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    const allowedIPs = config.allowedIPs || ['127.0.0.1', '::1'];
    const blockedIPs = config.blockedIPs || [];

    // Logique mathématique impartiale
    const isLocked = config.locked;
    const isMaintenance = config.maintenanceMode;
    const isIPBlocked = blockedIPs.includes(clientIP) || 
                       blockedIPs.some(blockedIP => clientIP.startsWith(blockedIP));

    // Déterminer le type d'écran à afficher (priorité)
    let screenType = 'none';
    if (isMaintenance) screenType = 'maintenance';
    else if (isLocked) screenType = 'locked';
    else if (isIPBlocked) screenType = 'ip-blocked';

    const shouldShowAnyScreen = screenType !== 'none';

    res.status(200).json({
      success: true,
      data: {
        clientIP,
        isAllowed: !shouldShowAnyScreen,
        isBlocked: isIPBlocked,
        isLocked: isLocked,
        isMaintenance: isMaintenance,
        screenType: screenType,
        lockaccessEnabled: config.enabled,
        timestamp: new Date().toISOString()
      },
      message: 'Vérification d\'accès effectuée'
    });
  } catch (error) {
    console.error('Erreur lors de la vérification d\'accès:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur',
      message: 'Impossible de vérifier l\'accès'
    });
  }
});

/**
 * Route pour obtenir le statut complet du système LockAccess
 * GET /api/lockaccess/status
 */
router.get('/status', (req, res) => {
  try {
    const config = getConfig();
    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    const allowedIPs = config.allowedIPs || ['127.0.0.1', '::1'];
    const blockedIPs = config.blockedIPs || [];

    // Logique mathématique impartiale
    const isLocked = config.locked;
    const isMaintenance = config.maintenanceMode;
    const isIPBlocked = blockedIPs.includes(clientIP) || 
                       blockedIPs.some(blockedIP => clientIP.startsWith(blockedIP));

    // Déterminer le type d'écran à afficher (priorité)
    let screenType = 'none';
    if (isMaintenance) screenType = 'maintenance';
    else if (isLocked) screenType = 'locked';
    else if (isIPBlocked) screenType = 'ip-blocked';

    const shouldShowAnyScreen = screenType !== 'none';

    const status = {
      system: {
        enabled: config.enabled,
        locked: isLocked,
        maintenanceMode: isMaintenance,
        environment: process.env.NODE_ENV || 'development'
      },
      access: {
        clientIP,
        isAllowed: !shouldShowAnyScreen,
        isBlocked: isIPBlocked,
        isLocked: isLocked,
        isMaintenance: isMaintenance,
        allowedIPs: allowedIPs,
        blockedIPs: blockedIPs
      },
      security: {
        shouldShowLockScreen: shouldShowAnyScreen,
        shouldShowMaintenance: isMaintenance,
        screenType: screenType
      },
      timestamp: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      data: status,
      message: 'Statut LockAccess récupéré avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du statut LockAccess:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur',
      message: 'Impossible de récupérer le statut LockAccess'
    });
  }
});

/**
 * Route pour mettre à jour la configuration LockAccess (protégé)
 * PUT /api/lockaccess/config
 */
const JWTAuthMiddleware = require('../middleware/jwtAuth');
const jwtAuth = new JWTAuthMiddleware();

router.put('/config', jwtAuth.authenticateToken.bind(jwtAuth), (req, res) => {
  try {
    const { enabled, locked, maintenanceMode, allowedIPs, blockedIPs } = req.body;

    // Validation
    if (typeof enabled !== 'undefined' && typeof enabled !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'Le paramètre enabled doit être un booléen'
      });
    }

    if (typeof locked !== 'undefined' && typeof locked !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'Le paramètre locked doit être un booléen'
      });
    }

    if (typeof maintenanceMode !== 'undefined' && typeof maintenanceMode !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'Le paramètre maintenanceMode doit être un booléen'
      });
    }

    // Préparer les mises à jour
    const updates = {};
    if (enabled !== undefined) updates.enabled = enabled;
    if (locked !== undefined) updates.locked = locked;
    if (maintenanceMode !== undefined) updates.maintenanceMode = maintenanceMode;
    if (allowedIPs !== undefined) updates.allowedIPs = Array.isArray(allowedIPs) ? allowedIPs : allowedIPs.split(',').map(ip => ip.trim()).filter(ip => ip);
    if (blockedIPs !== undefined) updates.blockedIPs = Array.isArray(blockedIPs) ? blockedIPs : blockedIPs.split(',').map(ip => ip.trim()).filter(ip => ip);

    // Mettre à jour la configuration
    const success = updateConfig(updates);
    
    if (!success) {
      return res.status(500).json({
        success: false,
        error: 'Erreur lors de la sauvegarde',
        message: 'Impossible de sauvegarder la configuration'
      });
    }

    const updatedConfig = getConfig();
    updatedConfig.timestamp = new Date().toISOString();

    res.status(200).json({
      success: true,
      data: updatedConfig,
      message: 'Configuration LockAccess mise à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la config LockAccess:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur',
      message: 'Impossible de mettre à jour la configuration LockAccess'
    });
  }
});

module.exports = router;
