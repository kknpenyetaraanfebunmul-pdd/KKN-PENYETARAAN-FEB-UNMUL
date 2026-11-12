import { useState, useEffect } from 'react';
import { useContent, ADMIN_SESSION_KEY } from './useContent';
import { ThemeProvider } from './ThemeContext';
import Header from './components/Header';
import DockNav from './components/DockNav';
import Hero from './components/Hero';
import Struktur from './components/Struktur';
import Program from './components/Program';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLogin from './components/admin/AdminLogin';

const sections = ['home', 'struktur', 'program', 'gallery', 'contact'];

// Halaman operator: /admin (contoh: localhost:5173/admin)
const IS_ADMIN_PAGE =
  window.location.pathname === '/admin' ||
  window.location.pathname.startsWith('/admin/');

// ============================================
// KOMPONEN LOADING SCREEN
// ============================================
function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-dark-purple">
      {/* Logo Loading Screen (Kotak luar, Bulat dalam) */}
      <div className="mb-8 relative">
        {/* Bingkai Kotak */}
        <div className="w-28 h-28 bg-white/10 backdrop-blur-md rounded-[2rem] border border-white/20 shadow-2xl flex items-center justify-center p-2">
          {/* Bingkai Bulat di dalamnya */}
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden shadow-inner">
            <img 
              src="/images/logo.webp" 
              alt="Logo KKN" 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
      </div>

      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-primary-purple/20" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-purple animate-spin" />
      </div>

      <p className="text-white/50 text-sm mt-6 tracking-widest uppercase">
        Memuat...
      </p>
    </div>
  );
}

// ============================================
// MAIN APP (dipisah agar bisa dibungkus ThemeProvider)
// ============================================
function MainApp() {
  const { content, updateContent, resetContent, loading } = useContent();
  const [activeSection, setActiveSection] = useState('home');
  const [showDock, setShowDock] = useState(false);
  const [adminMode, setAdminMode] = useState(
    IS_ADMIN_PAGE && sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true'
  );

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

  const handleAdminExit = () => {
    // Kembali ke situs publik
    window.location.href = '/';
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    window.location.href = '/admin';
  };

  // ============================================
  // HALAMAN /admin: hanya login + dashboard
  // ============================================
  if (IS_ADMIN_PAGE) {
    if (!adminMode) {
      return <AdminLogin onSuccess={() => setAdminMode(true)} />;
    }
    if (loading) return <LoadingScreen />;
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

  // ============================================
  // LOADING STATE
  // ============================================
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-bg dark:bg-dark-bg transition-colors duration-500">
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
      <Footer content={content.footer} />
      <DockNav activeSection={activeSection} visible={showDock} />
    </div>
  );
}

// ============================================
// APP WRAPPER
// ============================================
export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
