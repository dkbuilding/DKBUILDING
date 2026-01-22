import React, { useState } from 'react';
import { Mail, Copy, Check, AlertCircle, X } from 'lucide-react';
import { log, error as logError } from '../../utils/logger';

/**
 * Hook personnalisé pour le système de signalement d'erreur
 * Gère l'envoi au backend et le fallback avec copie URL + redirect contact
 */
const useErrorReporting = () => {
  const [isReporting, setIsReporting] = useState(false);
  const [reportStatus, setReportStatus] = useState(null); // 'success', 'error', 'copied'
  
  const reportError = async (errorData) => {
    setIsReporting(true);
    setReportStatus(null);
    
    try {
      // Tentative d'envoi au backend
      const response = await fetch('/api/report-error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...errorData,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          url: window.location.href
        })
      });
      
      if (response.ok) {
        setReportStatus('success');
        return true;
      } else {
        throw new Error('Backend unavailable');
      }
    } catch {
      log('Backend unavailable, using fallback method');
      
      // Fallback : copie URL + redirect vers contact
      try {
        await navigator.clipboard.writeText(errorData.brokenUrl);
        setReportStatus('copied');
        
        // Redirection vers contact avec paramètre d'erreur
        const contactUrl = `/#contact?error_url=${encodeURIComponent(errorData.brokenUrl)}&error_code=${errorData.errorCode}`;
        setTimeout(() => {
          window.location.href = contactUrl;
        }, 2000);
        
        return true;
      } catch (clipboardError) {
        logError('Clipboard API not available:', clipboardError);
        setReportStatus('error');
        return false;
      }
    } finally {
      setIsReporting(false);
    }
  };
  
  const resetStatus = () => {
    setReportStatus(null);
  };
  
  return {
    reportError,
    isReporting,
    reportStatus,
    resetStatus
  };
};

/**
 * Composant ReportButton - Bouton de signalement d'erreur
 */
const ReportButton = ({ 
  errorCode, 
  brokenUrl, 
  className = "",
  variant = "default" // "default", "compact", "minimal"
}) => {
  const { reportError, isReporting, reportStatus, resetStatus } = useErrorReporting();
  
  const handleReport = async () => {
    const success = await reportError({
      errorCode,
      brokenUrl: brokenUrl || window.location.pathname,
      errorType: 'user_reported',
      source: 'error_page'
    });
    
    if (!success) {
      // Si même le fallback échoue, afficher un message d'erreur
      setTimeout(() => {
        resetStatus();
      }, 3000);
    }
  };
  
  // Styles selon la variante
  const getButtonStyles = () => {
    switch (variant) {
      case 'compact':
        return "px-4 py-2 text-sm";
      case 'minimal':
        return "px-3 py-2 text-xs";
      default:
        return "px-6 py-3 text-base";
    }
  };
  
  // Contenu selon l'état
  const getButtonContent = () => {
    if (isReporting) {
      return (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
          Signalement...
        </>
      );
    }
    
    switch (reportStatus) {
      case 'success':
        return (
          <>
            <Check className="w-4 h-4 mr-2" strokeWidth={2} />
            Signalé !
          </>
        );
      case 'copied':
        return (
          <>
            <Copy className="w-4 h-4 mr-2" strokeWidth={2} />
            URL copiée !
          </>
        );
      case 'error':
        return (
          <>
            <AlertCircle className="w-4 h-4 mr-2" strokeWidth={2} />
            Erreur
          </>
        );
      default:
        return (
          <>
            <Mail className="w-4 h-4 mr-2" strokeWidth={2} />
            Signaler cette erreur
          </>
        );
    }
  };
  
  // Couleurs selon l'état
  const getButtonColors = () => {
    switch (reportStatus) {
      case 'success':
        return "bg-green-600 hover:bg-green-700 text-white border-green-600";
      case 'copied':
        return "bg-blue-600 hover:bg-blue-700 text-white border-blue-600";
      case 'error':
        return "bg-red-600 hover:bg-red-700 text-white border-red-600";
      default:
        return "bg-transparent border-2 border-dk-yellow text-dk-yellow hover:bg-dk-yellow hover:text-dk-black";
    }
  };
  
  return (
    <button
      onClick={handleReport}
      disabled={isReporting}
      className={`
        ${getButtonStyles()}
        ${getButtonColors()}
        rounded-lg font-foundation-bold transition-all duration-300 
        flex items-center justify-center gap-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      aria-label="Signaler cette erreur à l'équipe technique"
    >
      {getButtonContent()}
    </button>
  );
};

/**
 * Composant ToastNotification - Notification toast pour les actions
 */
export const ToastNotification = ({ 
  message, 
  type = "info", // "success", "error", "info"
  isVisible, 
  onClose,
  duration = 3000 
}) => {
  React.useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);
  
  if (!isVisible) return null;
  
  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return "bg-green-600 text-white border-green-500";
      case 'error':
        return "bg-red-600 text-white border-red-500";
      default:
        return "bg-dk-gray-800 text-white border-dk-gray-700";
    }
  };
  
  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className={`
        ${getToastStyles()}
        px-4 py-3 rounded-lg border shadow-lg
        flex items-center space-x-2
        max-w-sm
      `}>
        <div className="flex-1">
          <p className="text-sm font-foundation-roman">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-current hover:opacity-70 transition-opacity duration-200"
          aria-label="Fermer la notification"
        >
          <X className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};

export default ReportButton;
