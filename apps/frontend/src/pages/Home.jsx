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
      <Navigation 
        onToggleSidebar={toggleSidebar} 
        isSidebarOpen={isSidebarOpen}
        footerRef={footerRef}
      />
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={closeSidebar} 
      />
      
      {/* Indicateur de navigation intelligent */}
      <SmartNavigationIndicator />
      
      <main className={`transition-all duration-300 ${isSidebarOpen ? 'blur-sm' : ''}`}>
        <section id="home">
          <Hero />
        </section>
        <section id="news">
          <News />
        </section>
        <section id="services">
          <Services />
        </section>
        <section id="portfolio">
          <Portfolio />
        </section>
        <section id="about">
          <About />
        </section>
        <section id="contact">
          <Contact />
        </section>
      </main>
      
      {/* Footer refondé style ChatGPT */}
      <Footer ref={footerRef} className={`transition-all duration-300 ${isSidebarOpen ? 'blur-sm' : ''}`} />
    </div>
  );
};

export default Home;
