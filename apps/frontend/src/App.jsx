import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "./components/ErrorBoundary";
import Preloader from "./components/ui/Preloader";
import {
  LockAccess,
  LockAccessController,
  LockAccessOverlay,
} from "./components/security/LockAccess";
import { isSiteLocked } from "./config/lockAccessConfig";
import { isAdminSubdomain } from "./utils/subdomainDetector";
import "./App.css";
import "./styles/lock-access.css";

// Toutes les pages en lazy loading pour un code splitting optimal
const Home = lazy(() => import("./pages/Home"));
const Admin = lazy(() => import("./pages/Admin"));
const NewsDetail = lazy(() => import("./pages/NewsDetail"));
const MentionsLegales = lazy(() => import("./pages/legal/MentionsLegales"));
const PolitiqueConfidentialite = lazy(() => import("./pages/legal/PolitiqueConfidentialite"));
const CGV = lazy(() => import("./pages/legal/CGV"));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));
const HealthPage = lazy(() => import("./components/pages/HealthPage"));

/**
 * Fallback de chargement minimaliste pour Suspense
 * Fond dk-black pour eviter le flash blanc entre les routes
 */
const RouteFallback = () => (
  <div className="min-h-screen bg-dk-black" />
);

function App() {
  const siteLocked = isSiteLocked();
  const isAdmin = isAdminSubdomain();

  return (
    <Router>
      <div className="App w-full max-w-full overflow-x-hidden">
        {/* Lien d'évitement pour la navigation clavier (WCAG 2.4.1) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[99999] focus:bg-dk-yellow focus:text-dk-black focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold focus:shadow-lg"
        >
          Aller au contenu principal
        </a>

        {/* Système de verrouillage sécurisé - intercepte tous les accès */}
        <LockAccess />
        {/* Contrôleur de sécurité pour les administrateurs */}
        <LockAccessController />
        {/* Overlay pour masquer le contenu quand verrouillé */}
        <LockAccessOverlay isLocked={siteLocked}>
          {/* Page de chargement */}
          <Preloader />

          <main id="main-content" className="w-full max-w-full overflow-x-hidden">
            <ErrorBoundary>
              <Suspense fallback={<RouteFallback />}>
                <Routes>
                  {/* Si on est sur le sous-domaine admin, rediriger toutes les routes vers /admin */}
                  {isAdmin ? (
                    <>
                      <Route path="/" element={<Navigate to="/admin" replace />} />
                      <Route path="/admin" element={<Admin />} />
                      <Route path="*" element={<Navigate to="/admin" replace />} />
                    </>
                  ) : (
                    <>
                      <Route path="/" element={<Home />} />
                      <Route path="/health" element={<HealthPage />} />
                      <Route path="/admin" element={<Admin />} />
                      <Route path="/news/:id" element={<NewsDetail />} />
                      <Route
                        path="/legal/mentions-legales"
                        element={<MentionsLegales />}
                      />
                      <Route
                        path="/legal/politique-confidentialite"
                        element={<PolitiqueConfidentialite />}
                      />
                      <Route path="/legal/cgv" element={<CGV />} />
                      <Route path="/error/:code" element={<ErrorPage />} />
                      <Route path="*" element={<ErrorPage />} />
                    </>
                  )}
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </main>
        </LockAccessOverlay>

        {/* Toast notifications — unique instance pour toute l'app */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1a1a1a",
              color: "#fff",
              border: "1px solid #333",
            },
            success: {
              iconTheme: {
                primary: "#F3E719",
                secondary: "#0E0E0E",
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
