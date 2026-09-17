import { useState, useEffect, useRef } from 'react';
import type { SiteData, ProgramItem } from './types';
import { DEFAULT_DATA } from './data';
import { AdminLogin, AdminDashboard } from './AdminPanel';
import { fetchSiteData, saveSiteData, subscribeToChanges } from './supabase';

function App() {
  const [data, setData] = useState<SiteData>(DEFAULT_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [showLogin, setShowLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [programModal, setProgramModal] = useState<ProgramItem | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [dockShow, setDockShow] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<number | null>(null);

  /* ========== LOAD DATA DARI SUPABASE ========== */
  useEffect(() => {
    let mounted = true;

    async function load() {
      const remote = await fetchSiteData();
      if (mounted && remote) {
        setData({ ...DEFAULT_DATA, ...remote });
      }
      if (mounted) setIsLoading(false);
    }

    load();

    // Real-time subscription: auto update saat ada perubahan
    const unsubscribe = subscribeToChanges((newData) => {
      if (mounted) setData({ ...DEFAULT_DATA, ...newData });
    });

    // Fallback: polling tiap 30 detik (kalau realtime tidak jalan)
    const interval = setInterval(async () => {
      const remote = await fetchSiteData();
      if (mounted && remote) setData({ ...DEFAULT_DATA, ...remote });
    }, 30000);

    return () => {
      mounted = false;
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  /* ========== SAVE KE SUPABASE ========== */
  const updateData = async (partial: Partial<SiteData>): Promise<boolean> => {
    const next = { ...data, ...partial };
    setData(next); // Optimistic update (UI langsung berubah)
    setSaveStatus('saving');

    const ok = await saveSiteData(next);
    setSaveStatus(ok ? 'success' : 'error');
    setTimeout(() => setSaveStatus('idle'), 2000);

    return ok;
  };

  /* ========== BODY SCROLL LOCK ========== */
  useEffect(() => {
    const locked = showLogin || showAdmin || programModal !== null || lightboxIndex !== null;
    document.body.style.overflow = locked ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showLogin, showAdmin, programModal, lightboxIndex]);

  /* ========== SCROLL HANDLER ========== */
  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById('home');
      if (!hero) return;
      const isMobile = window.innerWidth <= 900;
      if (isMobile) setDockShow(true);
      else setDockShow(hero.getBoundingClientRect().bottom < 50);

      const scrollY = window.scrollY + window.innerHeight / 3;
      ['home', 'struktur', 'program', 'gallery', 'contact'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const bottom = top + el.offsetHeight;
          if (scrollY >= top && scrollY < bottom) setActiveSection(id);
        }
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  /* ========== 8-CLICK TRIGGER ========== */
  const handleCopyrightClick = () => {
    clickCountRef.current += 1;
    if (clickTimerRef.current) window.clearTimeout(clickTimerRef.current);
    clickTimerRef.current = window.setTimeout(() => { clickCountRef.current = 0; }, 1500);
    if (clickCountRef.current >= 8) {
      clickCountRef.current = 0;
      setShowLogin(true);
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = window.innerWidth <= 900 ? 80 : 40;
      window.scrollTo({ top: el.offsetTop - offset, behavior: 'smooth' });
    }
  };

  const heroBgs = data.hero.backgroundImages.length > 0 ? data.hero.backgroundImages : [''];

  /* ========== LOADING SCREEN ========== */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f5fb]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#7b5ea7] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs font-bold uppercase tracking-widest text-[#7b5ea7]">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Save Status Indicator (pojok kanan bawah) */}
      {saveStatus !== 'idle' && (
        <div
          className={`fixed top-4 right-4 z-[10020] px-4 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 transition ${
            saveStatus === 'saving'
              ? 'bg-[#7b5ea7] text-white'
              : saveStatus === 'success'
              ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          {saveStatus === 'saving' && <>⏳ Menyimpan...</>}
          {saveStatus === 'success' && <>✓ Tersimpan!</>}
          {saveStatus === 'error' && <>✗ Gagal menyimpan</>}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <header className="py-4 sm:py-5 flex items-center justify-between gap-4">
          <div className="text-2xl sm:text-3xl font-extrabold tracking-widest bg-gradient-to-br from-[#2b1c3d] to-[#7b5ea7] bg-clip-text text-transparent">
            KKN.
          </div>
          <nav className="hidden md:flex gap-1">
            {['Home', 'Struktur', 'Program', 'Gallery', 'Contact'].map((item, i) => {
              const id = ['home', 'struktur', 'program', 'gallery', 'contact'][i];
              return (
                <button
                  key={item}
                  onClick={() => scrollTo(id)}
                  className={`relative px-4 py-2 text-xs font-semibold uppercase tracking-wide transition rounded-full ${
                    activeSection === id ? 'text-[#7b5ea7] bg-[#ece6f5]' : 'text-[#2b1c3d] hover:text-[#7b5ea7]'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </nav>
        </header>

        {/* HERO */}
        <section id="home" className="relative flex items-center justify-center min-h-[500px] sm:min-h-[600px] rounded-3xl overflow-hidden mt-2">
          <div className="absolute inset-0">
            {heroBgs.map((bg, i) => (
              <div
                key={i}
                className="slide-anim"
                style={{
                  backgroundImage: `url('${bg}')`,
                  animationDelay: `${i * 5}s`,
                  animationDuration: `${heroBgs.length * 5}s`,
                }}
              />
            ))}
            <div className="absolute inset-0 bg-[#f7f5fb]/85" />
          </div>
          <div className="relative z-10 text-center px-6 max-w-4xl">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-[#2b1c3d] uppercase leading-tight tracking-tight mb-4">
              <span className="text-[#7b5ea7]">{data.hero.title1}</span>
              <br />
              {data.hero.title2}
            </h1>
            <p className="text-sm sm:text-base text-[#2b1c3d] font-semibold max-w-xl mx-auto mb-6">{data.hero.desc}</p>
            <button
              onClick={() => scrollTo('struktur')}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#7b5ea7] text-white text-sm font-bold shadow-lg hover:bg-[#2b1c3d] hover:-translate-y-0.5 transition"
            >
              View KKN
            </button>
          </div>
        </section>

        {/* STRUKTUR */}
        <section id="struktur" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 bg-white rounded-3xl p-6 sm:p-10 mt-[-40px] relative z-10 shadow-lg">
          {data.struktur.map((item, i) => (
            <div key={i} className="text-center py-2">
              <h3 className="text-sm sm:text-lg font-extrabold text-[#2b1c3d] uppercase tracking-wide">{item.title}</h3>
              <p className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wide mt-1">{item.subtitle}</p>
            </div>
          ))}
        </section>

        {/* PROGRAM */}
        <h2 id="program" className="text-center text-sm font-extrabold uppercase tracking-[3px] text-[#2b1c3d] mt-16 mb-6">
          Program Kerja
        </h2>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.program.map((p) => (
            <button
              key={p.key}
              onClick={() => setProgramModal(p)}
              className="text-left bg-[#ece6f5] rounded-2xl p-6 hover:-translate-y-1 hover:shadow-xl transition group"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:-rotate-6 transition">
                {p.icon}
              </div>
              <h4 className="text-base font-extrabold text-[#2b1c3d] mb-2">{p.title}</h4>
              <p className="text-xs text-gray-600 mb-5 leading-relaxed">{p.desc}</p>
              <div className="text-xl text-[#2b1c3d] group-hover:translate-x-1 group-hover:text-[#7b5ea7] transition">→</div>
            </button>
          ))}
        </section>

        {/* GALLERY */}
        <h2 id="gallery" className="text-center text-sm font-extrabold uppercase tracking-[3px] text-[#2b1c3d] mt-16 mb-6">
          Gallery
        </h2>
        <section className="relative">
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory scroll-smooth">
            {data.gallery.map((g, i) => (
              <button
                key={i}
                onClick={() => setLightboxIndex(i)}
                className="relative flex-shrink-0 w-52 h-64 sm:w-60 sm:h-72 rounded-2xl overflow-hidden bg-[#ece6f5] group snap-start"
              >
                {g.type === 'video' ? (
                  <video src={g.src} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                ) : (
                  <img src={g.src} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                )}
                {g.type === 'video' && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#2b1c3d]/85 text-white text-[9px] font-bold tracking-wider backdrop-blur-sm">
                    ▶ VIDEO
                  </span>
                )}
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#2b1c3d]/85 to-transparent text-white text-left">
                  <div className="text-xs font-bold uppercase tracking-wide leading-tight">{g.title}</div>
                  <div className="text-[10px] opacity-85 leading-tight mt-0.5">{g.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="mt-16 mb-[120px] md:mb-16 rounded-[24px] sm:rounded-[40px] bg-gradient-to-br from-[#ece6f5] via-[#ded0f0] to-[#ece6f5] p-8 sm:p-14 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-[3px] text-[#7b5ea7] mb-3">Mari Terhubung</div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#2b1c3d] uppercase leading-tight mb-4">
              Punya Pertanyaan?<br /><span className="text-[#7b5ea7]">Ayo Bicara!</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto mb-10">
              Kami terbuka untuk kolaborasi, pertanyaan, atau sekadar berbagi cerita seputar KKN Penyetaraan.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
              <a href={data.contact.instagramUrl} target="_blank" rel="noopener" className="flex items-center gap-3 p-4 rounded-2xl bg-white/85 backdrop-blur border border-white hover:-translate-y-1.5 hover:shadow-xl hover:border-[#7b5ea7] transition">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="text-[9px] font-bold uppercase tracking-widest text-[#7b5ea7]">Instagram</div>
                  <div className="text-xs font-extrabold text-[#2b1c3d] truncate">{data.contact.instagram}</div>
                </div>
                <div className="text-[#7b5ea7] opacity-50">→</div>
              </a>

              <a href={data.contact.tiktokUrl} target="_blank" rel="noopener" className="flex items-center gap-3 p-4 rounded-2xl bg-white/85 backdrop-blur border border-white hover:-translate-y-1.5 hover:shadow-xl hover:border-[#7b5ea7] transition">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br from-black via-cyan-400 to-pink-500">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" /></svg>
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="text-[9px] font-bold uppercase tracking-widest text-[#7b5ea7]">TikTok</div>
                  <div className="text-xs font-extrabold text-[#2b1c3d] truncate">{data.contact.tiktok}</div>
                </div>
                <div className="text-[#7b5ea7] opacity-50">→</div>
              </a>

              <a href={`mailto:${data.contact.email}`} className="flex items-center gap-3 p-4 rounded-2xl bg-white/85 backdrop-blur border border-white hover:-translate-y-1.5 hover:shadow-xl hover:border-[#7b5ea7] transition">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br from-[#7b5ea7] to-purple-400">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="text-[9px] font-bold uppercase tracking-widest text-[#7b5ea7]">Email</div>
                  <div className="text-xs font-extrabold text-[#2b1c3d] truncate">{data.contact.email}</div>
                </div>
                <div className="text-[#7b5ea7] opacity-50">→</div>
              </a>
            </div>

            <div className="mt-14 bg-white rounded-3xl p-8 sm:p-12 shadow-md">
              <div className="mb-8">
                <div className="text-center text-xs font-extrabold uppercase tracking-[3px] text-[#7b5ea7] mb-6">Support By</div>
                <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-12">
                  {data.partners.support.map((p, i) => (
                    <div key={i} className="h-14 sm:h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:scale-110 hover:-translate-y-1 transition duration-300" title={p.name}>
                      <img src={p.logo} alt={p.name} className="h-full w-auto object-contain" />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-center text-xs font-extrabold uppercase tracking-[3px] text-[#7b5ea7] mb-6">Sponsor By</div>
                <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-12">
                  {data.partners.sponsor.map((p, i) => (
                    <div key={i} className="h-14 sm:h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:scale-110 hover:-translate-y-1 transition duration-300" title={p.name}>
                      <img src={p.logo} alt={p.name} className="h-full w-auto object-contain" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-[#7b5ea7]/15 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
              <div onClick={handleCopyrightClick} className="select-none cursor-default">
                © 2025 <strong className="text-[#7b5ea7]">KKN Penyetaraan</strong>. All rights reserved.
              </div>
              <div className="flex items-center gap-1.5">
                Dibuat dengan <span className="text-red-500 animate-heartbeat">♥</span> untuk desa
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* DOCK NAV */}
      <nav
        className={`fixed z-[999] flex gap-1 p-2.5 bg-white/75 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl transition-all duration-500 ${
          dockShow ? 'opacity-100 visible' : 'opacity-0 invisible'
        } md:right-5 md:top-1/2 md:-translate-y-1/2 md:flex-col md:p-3 md:rounded-[28px] ${
          dockShow ? 'md:translate-x-0' : 'md:translate-x-[120%]'
        } max-md:bottom-4 max-md:left-1/2 max-md:-translate-x-1/2 max-md:flex-row max-md:max-w-[calc(100vw-32px)] max-md:overflow-x-auto no-scrollbar`}
      >
        {[
          { id: 'home', icon: '🏠', label: 'Home' },
          { id: 'struktur', icon: '👥', label: 'Struktur' },
          { id: 'program', icon: '📋', label: 'Program' },
          { id: 'gallery', icon: '🖼️', label: 'Gallery' },
          { id: 'contact', icon: '✉️', label: 'Contact' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl min-w-[56px] transition-all ${
              activeSection === item.id ? 'bg-gradient-to-br from-[#7b5ea7]/20 to-[#7b5ea7]/10 text-[#7b5ea7]' : 'text-[#2b1c3d] hover:bg-[#7b5ea7]/10'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-[8px] font-bold uppercase tracking-wider opacity-80">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* PROGRAM MODAL - sama seperti sebelumnya */}
      {programModal && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-[#140c1e]/70 backdrop-blur-md" onClick={() => setProgramModal(null)}>
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setProgramModal(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 shadow flex items-center justify-center text-[#2b1c3d] hover:bg-white hover:rotate-90 transition z-10">✕</button>
            <div className="relative p-8 sm:p-10 bg-gradient-to-br from-[#ece6f5] to-[#ded0f0] rounded-t-3xl overflow-hidden">
              <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-[#7b5ea7]/15" />
              <div className="relative">
                <div className="w-[72px] h-[72px] bg-white rounded-full flex items-center justify-center text-4xl mb-5 shadow-lg">{programModal.icon}</div>
                <div className="text-[11px] font-bold uppercase tracking-[2px] text-[#7b5ea7] mb-1.5">{programModal.category}</div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#2b1c3d] uppercase tracking-tight mb-2">{programModal.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">{programModal.subtitle}</p>
              </div>
            </div>
            <div className="p-8 sm:p-10">
              <div className="mb-6">
                <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#7b5ea7] mb-3 flex items-center gap-2">Deskripsi Program<span className="flex-1 h-px bg-gradient-to-r from-[#7b5ea7]/20 to-transparent" /></div>
                <p className="text-sm text-gray-600 leading-relaxed">{programModal.description}</p>
              </div>
              {programModal.activities.length > 0 && (
                <div className="mb-6">
                  <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#7b5ea7] mb-3 flex items-center gap-2">Kegiatan Utama<span className="flex-1 h-px bg-gradient-to-r from-[#7b5ea7]/20 to-transparent" /></div>
                  <div className="space-y-2.5">
                    {programModal.activities.map((a, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[#ece6f5] hover:bg-[#e3d9f2] hover:translate-x-1 transition">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white flex items-center justify-center text-[11px] font-bold text-[#7b5ea7]">{i + 1}</div>
                        <div className="text-xs text-[#2b1c3d] font-medium leading-relaxed">{a}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {programModal.info.length > 0 && (
                <div>
                  <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#7b5ea7] mb-3 flex items-center gap-2">Informasi<span className="flex-1 h-px bg-gradient-to-r from-[#7b5ea7]/20 to-transparent" /></div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {programModal.info.map((info, i) => (
                      <div key={i} className="p-3 rounded-xl bg-[#ece6f5]">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#7b5ea7] mb-1">{info.label}</div>
                        <div className="text-xs font-semibold text-[#2b1c3d]">{info.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX */}
      {lightboxIndex !== null && data.gallery[lightboxIndex] && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-10 bg-[#140c1e]/92 backdrop-blur-md" onClick={() => setLightboxIndex(null)}>
          <button onClick={() => setLightboxIndex(null)} className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 border border-white/15 text-white flex items-center justify-center text-xl hover:bg-white/20 hover:rotate-90 transition">✕</button>
          {data.gallery.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + data.gallery.length) % data.gallery.length); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 border border-white/15 text-white flex items-center justify-center text-2xl hover:bg-white/20 transition">‹</button>
              <button onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % data.gallery.length); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 border border-white/15 text-white flex items-center justify-center text-2xl hover:bg-white/20 transition">›</button>
            </>
          )}
          <div className="max-w-full max-h-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <div className="max-w-[min(1100px,92vw)] max-h-[80vh] rounded-2xl overflow-hidden shadow-2xl bg-black">
              {data.gallery[lightboxIndex].type === 'video' ? (
                <video src={data.gallery[lightboxIndex].src} controls autoPlay playsInline className="max-w-full max-h-[80vh] block" />
              ) : (
                <img src={data.gallery[lightboxIndex].src} alt={data.gallery[lightboxIndex].title} className="max-w-full max-h-[80vh] object-contain block" />
              )}
            </div>
            <div className="mt-5 text-center text-white max-w-xl px-3">
              <h4 className="text-lg font-bold uppercase tracking-wide mb-1.5">{data.gallery[lightboxIndex].title}</h4>
              <p className="text-sm opacity-70">{data.gallery[lightboxIndex].desc}</p>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN */}
      <AdminLogin open={showLogin} onClose={() => setShowLogin(false)} onSuccess={() => { setShowLogin(false); setShowAdmin(true); }} />
      <AdminDashboard open={showAdmin} onClose={() => setShowAdmin(false)} data={data} updateData={updateData} onReset={() => updateData(DEFAULT_DATA)} />
    </div>
  );
}

export default App;