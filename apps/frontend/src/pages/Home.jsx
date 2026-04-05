import { useState, useRef } from 'react';
import { Navigation, Sidebar, SmartNavigationIndicator } from '../components/navigation';
import { Hero, News, Services, Portfolio, About, Contact } from '../components/pages';
import { Footer } from '../components/ui';

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const footerRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-dk-black w-full max-w-full overflow-x-hidden">
      {/* Header avec Navigation (WCAG landmark: banner) */}
      <header>
        <Navigation 
          onToggleSidebar={toggleSidebar} 
          isSidebarOpen={isSidebarOpen}
          footerRef={footerRef}
        />
      </header>
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={closeSidebar} 
      />
      
      {/* Indicateur de navigation intelligent */}
      <SmartNavigationIndicator />
      
      {/* Suppression du <main> dupliqué — le <main> est dans App.jsx (WCAG 1.3.1) */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'blur-sm' : ''}`} aria-hidden={isSidebarOpen ? 'true' : undefined}>
        <section id="home" aria-label="Accueil">
          <Hero />
        </section>
        <section id="news" aria-label="Actualités">
          <News />
        </section>
        <section id="services" aria-label="Services">
          <Services />
        </section>
        <section id="portfolio" aria-label="Réalisations">
          <Portfolio />
        </section>
        <section id="about" aria-label="À propos">
          <About />
        </section>
        <section id="contact" aria-label="Contact">
          <Contact />
        </section>
      </div>
      
      {/* Footer refondé style ChatGPT */}
      <Footer ref={footerRef} className={`transition-all duration-300 ${isSidebarOpen ? 'blur-sm' : ''}`} />
    </div>
  );
};

export default Home;
