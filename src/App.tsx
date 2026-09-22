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

// ============================================
// KOMPONEN LOADING SCREEN
// ============================================
function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-dark-purple">
      {/* Logo */}
      <div className="mb-8">
        <span className="text-4xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-primary-purple to-purple-300 bg-clip-text text-transparent">
            KKN
          </span>
          <span className="text-white">.</span>
        </span>
      </div>

      {/* Spinner */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-primary-purple/20" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-purple animate-spin" />
      </div>

      {/* Text */}
      <p className="text-white/50 text-sm mt-6 tracking-widest uppercase">
        Memuat...
      </p>
    </div>
  );
}

export default function App() {
  const { content, updateContent, resetContent, loading } = useContent();
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
    if (adminMode || loading) return;

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
  }, [adminMode, loading]);

  const handleAdminAccess = () => setAdminMode(true);
  const handleAdminExit = () => setAdminMode(false);

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setAdminMode(false);
  };

  // ============================================
  // LOADING STATE: Tampilkan loading screen
  // sambil tunggu data dari Supabase
  // ============================================
  if (loading && !adminMode) {
    return <LoadingScreen />;
  }

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