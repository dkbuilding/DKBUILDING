import { Component } from 'react';

/**
 * Error Boundary React — attrape les erreurs de rendu non gérées
 * et affiche un fallback au lieu de crasher toute l'application.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log en développement, envoyer vers un service de monitoring en production
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary] Erreur capturée:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Fallback personnalisé si fourni
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Fallback par défaut
      return (
        <div className="min-h-screen bg-dk-black flex items-center justify-center px-4">
          <div className="max-w-md text-center">
            <div className="text-6xl font-bold text-dk-yellow mb-4">Oops</div>
            <h1 className="text-2xl font-bold text-white mb-4">
              Une erreur inattendue s'est produite
            </h1>
            <p className="text-dk-gray-300 mb-8">
              L'application a rencontré un problème. Essayez de recharger la page.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="bg-dk-yellow text-dk-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-300 transition-colors duration-300"
              >
                Réessayer
              </button>
              <button
                onClick={() => { window.location.href = '/'; }}
                className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-bold hover:bg-white hover:text-dk-black transition-colors duration-300"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
