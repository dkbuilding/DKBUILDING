import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Preloader from "./components/ui/Preloader";
import {
  LockAccess,
  LockAccessController,
  LockAccessOverlay,
} from "./components/security/LockAccess";
import { isSiteLocked } from "./config/lockAccessConfig";
import { isAdminSubdomain } from "./utils/subdomainDetector";
import Home from "./pages/Home";
import HealthPage from "./components/pages/HealthPage";
import Admin from "./pages/Admin";
import NewsDetail from "./pages/NewsDetail";
import MentionsLegales from "./pages/legal/MentionsLegales";
import PolitiqueConfidentialite from "./pages/legal/PolitiqueConfidentialite";
import CGV from "./pages/legal/CGV";
import ErrorPage from "./pages/ErrorPage";
import "./App.css";
import "./styles/lock-access.css";

function App() {
  const siteLocked = isSiteLocked();
  const isAdmin = isAdminSubdomain();

  return (
    <Router>
      <div className="App w-full max-w-full overflow-x-hidden">
        {/* Système de verrouillage sécurisé - intercepte tous les accès */}
        <LockAccess />
        {/* Contrôleur de sécurité pour les administrateurs */}
        <LockAccessController />
        {/* Overlay pour masquer le contenu quand verrouillé */}
        <LockAccessOverlay isLocked={siteLocked}>
          {/* Page de chargement */}
          <Preloader />

          <main className="w-full max-w-full overflow-x-hidden">
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
          </main>
        </LockAccessOverlay>

        {/* Toast notifications - GovTech style */}
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
