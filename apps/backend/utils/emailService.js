const { Resend } = require('resend');

class EmailService {
  constructor() {
    this.resend = null;
    this.isConfiguredFlag = false;
    this.init();
  }

  init() {
    try {
      const apiKey = process.env.RESEND_API_KEY;
      
      if (apiKey) {
        this.resend = new Resend(apiKey);
        this.isConfiguredFlag = true;
        console.log('📧 Service email Resend configuré avec succès');
      } else {
        console.warn('⚠️ Service email non configuré - RESEND_API_KEY manquante');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la configuration du service email:', error);
    }
  }

  isConfigured() {
    return this.isConfiguredFlag;
  }

  async sendEmail(emailData) {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'Service email non configuré'
      };
    }

    try {
      const { to, subject, template, data } = emailData;
      
      // Génération du contenu HTML selon le template
      let htmlContent;
      switch (template) {
        case 'contact-form':
          htmlContent = this.generateContactFormTemplate(data);
          break;
        case 'confirmation':
          htmlContent = this.generateConfirmationTemplate(data);
          break;
        default:
          htmlContent = this.generateDefaultTemplate(data);
      }

      // Envoi via Resend
      const result = await this.resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'DK BUILDING <noreply@dkbuilding.fr>',
        to: Array.isArray(to) ? to : [to],
        subject: subject,
        html: htmlContent,
        text: this.generateTextVersion(data, template)
      });
      
      // Vérification de la réponse Resend
      if (result.error) {
        throw new Error(result.error.message || 'Erreur Resend: ' + JSON.stringify(result.error));
      }
      
      if (!result.data || !result.data.id) {
        throw new Error('Réponse Resend invalide: aucun ID de message retourné');
      }
      
      console.log('✅ Email envoyé avec succès via Resend:', result.data.id);
      
      return {
        success: true,
        messageId: result.data.id
      };

    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
      
      // Gestion détaillée des erreurs Resend
      let errorMessage = 'Erreur lors de l\'envoi de l\'email';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error.response?.body) {
        // Erreur Resend avec détails
        errorMessage = error.response.body.message || JSON.stringify(error.response.body);
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  generateContactFormTemplate(data) {
    return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nouvelle demande de devis - DK BUILDING</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0E0E0E; color: #F3E719; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #0E0E0E; }
            .value { margin-top: 5px; }
            .footer { background: #0E0E0E; color: #F3E719; padding: 15px; text-align: center; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🏗️ DK BUILDING</h1>
                <h2>Nouvelle demande de devis</h2>
            </div>
            <div class="content">
                <div class="field">
                    <div class="label">👤 Client:</div>
                    <div class="value">${data.name}</div>
                </div>
                <div class="field">
                    <div class="label">📧 Email:</div>
                    <div class="value">${data.email}</div>
                </div>
                <div class="field">
                    <div class="label">📞 Téléphone:</div>
                    <div class="value">${data.phone}</div>
                </div>
                <div class="field">
                    <div class="label">🏗️ Type de projet:</div>
                    <div class="value">${data.projectType}</div>
                </div>
                <div class="field">
                    <div class="label">📝 Description:</div>
                    <div class="value">${data.projectDetails}</div>
                </div>
                <div class="field">
                    <div class="label">📐 Surface:</div>
                    <div class="value">${data.surface}</div>
                </div>
                <div class="field">
                    <div class="label">⏰ Délai souhaité:</div>
                    <div class="value">${data.deadline}</div>
                </div>
                <div class="field">
                    <div class="label">📍 Localisation:</div>
                    <div class="value">${data.location}</div>
                </div>
                <div class="field">
                    <div class="label">💬 Message:</div>
                    <div class="value">${data.message}</div>
                </div>
                <div class="field">
                    <div class="label">🕒 Date de demande:</div>
                    <div class="value">${data.timestamp}</div>
                </div>
                <div class="field">
                    <div class="label">🌐 IP Client:</div>
                    <div class="value">${data.clientIP}</div>
                </div>
            </div>
            <div class="footer">
                <p>DK BUILDING - 59 Rue Pierre Cormary, 81000 Albi | SIREN: 947998555</p>
                <p>Email automatique - Ne pas répondre directement</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  generateConfirmationTemplate(data) {
    return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmation de votre demande - DK BUILDING</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0E0E0E; color: #F3E719; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; }
            .footer { background: #0E0E0E; color: #F3E719; padding: 15px; text-align: center; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🏗️ DK BUILDING</h1>
                <h2>Confirmation de votre demande</h2>
            </div>
            <div class="content">
                <p>Bonjour ${data.name},</p>
                <p>Nous avons bien reçu votre demande de devis pour un projet de <strong>${data.projectType}</strong>.</p>
                <p>Notre équipe va étudier votre demande et vous contactera dans les plus brefs délais pour discuter de votre projet.</p>
                <p>En attendant, n'hésitez pas à nous contacter directement :</p>
                <ul>
                    <li>📞 Téléphone: +33 7 68 11 38 39</li>
                    <li>📧 Email: contact@dkbuilding.fr</li>
                    <li>📍 Adresse: 59 Rue Pierre Cormary, 81000 Albi</li>
                </ul>
                <p>Cordialement,<br>L'équipe DK BUILDING</p>
            </div>
            <div class="footer">
                <p>DK BUILDING - 59 Rue Pierre Cormary, 81000 Albi | SIREN: 947998555</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  generateDefaultTemplate(data) {
    return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Message de DK BUILDING</title>
    </head>
    <body>
        <h1>Message de DK BUILDING</h1>
        <p>${JSON.stringify(data, null, 2)}</p>
    </body>
    </html>
    `;
  }

  generateTextVersion(data, template) {
    switch (template) {
      case 'contact-form':
        return `
Nouvelle demande de devis - DK BUILDING

Client: ${data.name}
Email: ${data.email}
Téléphone: ${data.phone}
Type de projet: ${data.projectType}
Description: ${data.projectDetails}
Surface: ${data.surface}
Délai: ${data.deadline}
Localisation: ${data.location}
Message: ${data.message}
Date: ${data.timestamp}
IP: ${data.clientIP}
        `;
      case 'confirmation':
        return `
Bonjour ${data.name},

Nous avons bien reçu votre demande de devis pour un projet de ${data.projectType}.

Notre équipe vous contactera dans les plus brefs délais.

Cordialement,
L'équipe DK BUILDING
        `;
      default:
        return JSON.stringify(data, null, 2);
    }
  }
}

module.exports = new EmailService();
