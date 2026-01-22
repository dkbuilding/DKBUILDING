import React from 'react';
import { 
  RefreshCw, 
  CheckCircle, 
  ArrowRight, 
  AlertTriangle, 
  Wrench,
  Home,
  ArrowLeft,
  Search,
  Mail,
  AlertCircle
} from 'lucide-react';

/**
 * Composant ErrorIcon - Icônes professionnelles pour les pages d'erreur
 * Mix stratégique : Lucide React pour navigation + SVG personnalisés pour erreurs
 */
const ErrorIcon = ({ code, className = '', size = 'default' }) => {
  const category = code ? code[0] : '4'; // Premier chiffre du code d'erreur
  
  // Tailles d'icônes
  const sizeClasses = {
    small: 'w-6 h-6',
    default: 'w-12 h-12',
    large: 'w-16 h-16',
    xlarge: 'w-20 h-20'
  };
  
  const iconSize = sizeClasses[size] || sizeClasses.default;
  
  // SVG personnalisés pour chaque catégorie d'erreur
  const CustomSVG1xx = () => (
    <svg 
      className={`${iconSize} text-dk-yellow`} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      <path d="M8 2v4"/>
      <path d="M2 8h4"/>
      <path d="M16 22v-4"/>
      <path d="M22 16h-4"/>
    </svg>
  );
  
  const CustomSVG2xx = () => (
    <svg 
      className={`${iconSize} text-green-500`} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <path d="M22 4 12 14.01l-3-3"/>
    </svg>
  );
  
  const CustomSVG3xx = () => (
    <svg 
      className={`${iconSize} text-blue-500`} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <path d="M5 12h14"/>
      <path d="M12 5l7 7-7 7"/>
    </svg>
  );
  
  const CustomSVG4xx = () => (
    <svg 
      className={`${iconSize} text-orange-500`} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <path d="M12 9v4"/>
      <path d="M12 17h.01"/>
      <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
    </svg>
  );
  
  const CustomSVG5xx = () => (
    <svg 
      className={`${iconSize} text-red-500`} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
      <path d="M2 17l10 5 10-5"/>
      <path d="M2 12l10 5 10-5"/>
    </svg>
  );
  
  // Icônes Lucide pour les actions de navigation
  const LucideIcon = ({ iconName }) => {
    const icons = {
      refresh: RefreshCw,
      check: CheckCircle,
      arrow: ArrowRight,
      warning: AlertTriangle,
      wrench: Wrench,
      home: Home,
      back: ArrowLeft,
      search: Search,
      mail: Mail,
      alert: AlertCircle
    };
    
    const IconComponent = icons[iconName] || AlertCircle;
    return <IconComponent className={`${iconSize} text-dk-yellow`} />;
  };
  
  // Rendu selon la catégorie
  const renderIcon = () => {
    switch (category) {
      case '1':
        return <CustomSVG1xx />;
      case '2':
        return <CustomSVG2xx />;
      case '3':
        return <CustomSVG3xx />;
      case '4':
        return <CustomSVG4xx />;
      case '5':
        return <CustomSVG5xx />;
      default:
        return <CustomSVG4xx />; // Par défaut, erreur client
    }
  };
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {renderIcon()}
    </div>
  );
};

/**
 * Composant ActionIcon - Icônes pour les boutons d'action
 */
export const ActionIcon = ({ action, className = '', size = 'default' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-5 h-5',
    large: 'w-6 h-6'
  };
  
  const iconSize = sizeClasses[size] || sizeClasses.default;
  
  const icons = {
    refresh: RefreshCw,
    home: Home,
    back: ArrowLeft,
    search: Search,
    mail: Mail,
    retry: RefreshCw,
    wait: RefreshCw,
    continue: ArrowRight,
    view: ArrowRight,
    track: ArrowRight,
    choose: ArrowRight,
    redirect: ArrowRight,
    login: ArrowRight,
    update: RefreshCw,
    alternative: ArrowRight,
    report: Mail
  };
  
  const IconComponent = icons[action] || AlertTriangle;
  
  return (
    <IconComponent 
      className={`${iconSize} ${className}`} 
      strokeWidth={2}
    />
  );
};

export default ErrorIcon;
