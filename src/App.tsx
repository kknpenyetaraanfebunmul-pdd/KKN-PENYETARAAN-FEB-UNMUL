import { useState, useEffect } from 'react';
import { useContent, ADMIN_SESSION_KEY } from './useContent';
import Header from './components/Header';
import DockNav from './components/DockNav';
import Hero from './components/Hero';
import Struktur from './components/Struktur';
import Program from './components/Program';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminDashboard from './components/admin/AdminDashboard';

const sections = ['home', 'struktur', 'program', 'gallery', 'contact'];

export default function App() {
  const { content, updateContent, resetContent } = useContent();
  const [activeSection, setActiveSection] = useState('home');
  const [showDock, setShowDock] = useState(false);
  const [adminMode, setAdminMode] = useState(false);

  useEffect(() => {
    if (adminMode) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [adminMode]);

  useEffect(() => {
    if (adminMode) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // Logika:
    // - showDock = true  -> user sudah scroll melewati Hero (Header hilang, DockNav muncul)
    // - showDock = false -> user masih di Hero (Header muncul, DockNav hilang)
    const onScroll = () => {
      const hero = document.getElementById('home');
      if (hero) {
        const rect = hero.getBoundingClientRect();
        const passed = rect.bottom < window.innerHeight * 0.7;
        setShowDock(passed);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [adminMode]);

  const handleAdminAccess = () => setAdminMode(true);
  const handleAdminExit = () => setAdminMode(false);

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setAdminMode(false);
  };

  if (adminMode) {
    return (
      <AdminDashboard
        content={content}
        updateContent={updateContent}
        resetContent={resetContent}
        onExit={handleAdminExit}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header: TIDAK dibungkus div lagi. Animasi ada di dalam Header.tsx */}
      <Header activeSection={activeSection} visible={!showDock} />

      <main>
        <Hero content={content.hero} />
        <Struktur content={content.struktur} />
        <Program content={content.programs} />
        <Gallery content={content.gallery} />
        <Contact
          contacts={content.contacts}
          supportBy={content.supportBy}
          sponsorBy={content.sponsorBy}
        />
      </main>
      <Footer content={content.footer} onAdminAccess={handleAdminAccess} />
      <DockNav activeSection={activeSection} visible={showDock} />
    </div>
  );
}