import { useState, useEffect, useRef, useCallback } from 'react';
import type { SiteData, ProgramItem } from './types';
import { DEFAULT_DATA } from './data';
import { loadData, saveData, subscribeToData, getLocalData, setLocalData } from './supabase';
import AdminPanel, { ADMIN_PASSCODE } from './AdminPanel';

// ============================================
// ESCAPE HTML
// ============================================
function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ============================================
// MAIN APP
// ============================================
export default function App() {
  const [data, setData] = useState<SiteData>(() => getLocalData());
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [syncToast, setSyncToast] = useState<string | null>(null);
  const clickCount = useRef(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dataRef = useRef(data);
  const isAdminRef = useRef(isAdmin);
  dataRef.current = data;
  isAdminRef.current = isAdmin;

  // --- Toast helper ---
  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  // --- Initial load from Supabase ---
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const remote = await loadData();
        if (mounted) {
          setData(remote);
          setLocalData(remote);
        }
      } catch {
        // keep local data on failure
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // --- Realtime subscription + visibilitychange ---
  useEffect(() => {
    const unsub = subscribeToData((newData) => {
      setData(newData);
      setLocalData(newData);
      if (!isAdminRef.current) {
        showToast('Data diperbarui');
      }
    });

    const handleVisibility = async () => {
      if (document.visibilityState === 'visible') {
        setSyncing(true);
        try {
          const remote = await loadData();
          const current = dataRef.current;
          if (JSON.stringify(remote) !== JSON.stringify(current)) {
            setData(remote);
            setLocalData(remote);
            setSyncToast('Data diperbarui');
            setTimeout(() => setSyncToast(null), 2000);
          }
        } catch {
          // ignore
        } finally {
          setSyncing(false);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      unsub();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [showToast]);

  // --- Polling fallback every 30s ---
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const remote = await loadData();
        const current = dataRef.current;
        if (JSON.stringify(remote) !== JSON.stringify(current)) {
          setData(remote);
          setLocalData(remote);
          if (!isAdminRef.current) {
            showToast('Data diperbarui');
          }
        }
      } catch {
        // ignore
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [showToast]);

  // --- Footer click trigger for admin ---
  const handleFooterClick = useCallback(() => {
    clickCount.current++;
    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => { clickCount.current = 0; }, 3000);
    if (clickCount.current >= 8) {
      clickCount.current = 0;
      setShowLogin(true);
    }
  }, []);

  // --- Admin save ---
  const handleSave = useCallback(async (newData: SiteData) => {
    setData(newData);
    setLocalData(newData);
    await saveData(newData);
  }, []);

  // --- Admin reset ---
  const handleReset = useCallback(async () => {
    const fresh = JSON.parse(JSON.stringify(DEFAULT_DATA)) as SiteData;
    setData(fresh);
    setLocalData(fresh);
    await saveData(fresh);
  }, []);

  // --- Admin login attempt ---
  const handleLogin = useCallback((passcode: string) => {
    if (passcode === ADMIN_PASSCODE) {
      setShowLogin(false);
      setIsAdmin(true);
    }
  }, []);

  if (isAdmin) {
    return (
      <>
        <AdminPanel data={data} onSave={handleSave} onReset={handleReset} />
        {/* Syncing indicator overlay on top of admin */}
        {syncing && (
          <div className="fixed top-16 right-6 bg-[#7b5ea7] text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg flex items-center gap-2 z-[10005]">
            <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sinkronisasi...
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <SiteView data={data} loading={loading} syncing={syncing} onFooterClick={handleFooterClick} showLogin={showLogin} onLoginClose={() => setShowLogin(false)} onLogin={handleLogin} />
      <ProgramModal />
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg z-[10002] flex items-center gap-2 animate-[fadeInUp_0.3s_ease]">
          {'\u2714'} {toast}
        </div>
      )}
      {syncToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#7b5ea7] text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg z-[10002] flex items-center gap-2 animate-[fadeInUp_0.3s_ease]">
          {'\u{1F504}'} {syncToast}
        </div>
      )}
    </>
  );
}

// ============================================
// LOGIN MODAL
// ============================================
function LoginModal({ onClose, onLogin }: { onClose: () => void; onLogin: (passcode: string) => void }) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit() {
    if (passcode === ADMIN_PASSCODE) {
      onLogin(passcode);
    } else {
      setError('Passcode salah. Coba lagi.');
      setShake(true);
      setTimeout(() => setShake(false), 400);
      setPasscode('');
    }
  }

  return (
    <div className="fixed inset-0 bg-[rgba(20,12,30,0.6)] backdrop-blur-sm z-[10000] flex items-center justify-center p-5" onClick={onClose}>
      <div
        className={`bg-white rounded-3xl p-8 sm:p-10 w-full max-w-[380px] shadow-2xl text-center ${shake ? 'animate-[shake_0.4s_ease]' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7b5ea7] to-[#2b1c3d] flex items-center justify-center mx-auto mb-5 text-3xl shadow-lg">
          {'\u{1F512}'}
        </div>
        <h3 className="text-2xl font-extrabold text-[#2b1c3d] mb-1.5 uppercase tracking-wide">Admin Access</h3>
        <p className="text-sm text-gray-400 mb-6">Masukkan passcode untuk mengakses dashboard</p>
        <input
          ref={inputRef}
          type="password"
          maxLength={6}
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="000000"
          value={passcode}
          onChange={(e) => { setPasscode(e.target.value.replace(/[^0-9]/g, '')); setError(''); }}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
          className={`w-full px-4 py-3.5 rounded-xl border-2 text-lg font-semibold text-center tracking-[4px] text-[#2b1c3d] outline-none transition ${error ? 'border-red-500 shadow-[0_0_0_4px_rgba(231,76,91,0.12)]' : 'border-[#e0d9e8] focus:border-[#7b5ea7] focus:shadow-[0_0_0_4px_rgba(123,94,167,0.12)]'}`}
        />
        <div className="text-red-500 text-xs font-semibold mb-4 min-h-[18px]">{error}</div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm hover:bg-gray-200 transition">Batal</button>
          <button onClick={handleSubmit} className="flex-1 py-3 rounded-xl bg-gradient-to-br from-[#7b5ea7] to-[#2b1c3d] text-white font-semibold text-sm shadow-md hover:-translate-y-0.5 hover:shadow-lg transition">Masuk</button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// SITE VIEW (public website)
// ============================================
function SiteView({
  data,
  loading,
  syncing,
  onFooterClick,
  showLogin,
  onLoginClose,
  onLogin,
}: {
  data: SiteData;
  loading: boolean;
  syncing: boolean;
  onFooterClick: () => void;
  showLogin: boolean;
  onLoginClose: () => void;
  onLogin: (passcode: string) => void;
}) {
  return (
    <div className="min-h-screen bg-[#f7f5fb] text-[#333] font-[Poppins,sans-serif] overflow-x-hidden">
      <style>{`
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-10px)} 40%,80%{transform:translateX(10px)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeInUp { from{opacity:0;transform:translate(-50%,120%)} to{opacity:1;transform:translate(-50%,0)} }
        @keyframes slideCarousel { 0%{transform:translateX(100%);opacity:0} 8.33%{transform:translateX(0);opacity:1} 33.33%{transform:translateX(0);opacity:1} 41.66%{transform:translateX(-100%);opacity:0} 100%{transform:translateX(-100%);opacity:0} }
        @keyframes heartbeat { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
        .resize-vertical { resize: vertical; }
      `}</style>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-[#f7f5fb] z-[9999] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-[#e0d9e8] border-t-[#7b5ea7] rounded-full animate-spin" />
            <p className="text-sm font-semibold text-[#7b5ea7]">Memuat data...</p>
          </div>
        </div>
      )}

      {/* Syncing indicator */}
      {syncing && !loading && (
        <div className="fixed top-4 right-4 bg-[#7b5ea7] text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg flex items-center gap-2 z-[9998]">
          <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sinkronisasi...
        </div>
      )}

      <div className="max-w-[1200px] mx-auto px-4 sm:px-10">
        {/* HEADER */}
        <header className="flex items-center justify-between py-4 sm:py-5 relative z-100">
          <div className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-[#2b1c3d] to-[#7b5ea7] bg-clip-text text-transparent tracking-[2px]">KKN.</div>
          <nav className="hidden md:flex gap-1 text-xs font-semibold uppercase tracking-wider">
            {['Home', 'Struktur', 'Program Kerja', 'Gallery', 'Contact'].map((label, i) => (
              <a key={label} href={`#${['home', 'struktur', 'program', 'gallery', 'contact'][i]}`} className="px-4 py-2.5 rounded-full text-[#2b1c3d] hover:text-[#7b5ea7] hover:bg-[rgba(123,94,167,0.12)] transition">
                {label}
              </a>
            ))}
          </nav>
        </header>

        {/* HERO */}
        <section className="relative flex items-center justify-center text-center overflow-hidden rounded-[0px] sm:rounded-[30px] mt-2 sm:mt-5 min-h-[60vh] sm:min-h-[500px] py-12 sm:py-20" id="home">
          <div className="absolute inset-0 z-0 overflow-hidden">
            {data.hero.slideshow.map((url, i) => (
              <div
                key={i}
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('${escapeHtml(url)}')`,
                  animation: `slideCarousel 12s infinite`,
                  animationDelay: `${i * 4}s`,
                }}
              />
            ))}
            <div className="absolute inset-0 bg-[rgba(247,245,251,0.85)] z-1" />
          </div>
          <div className="relative z-2 max-w-[850px] mx-auto px-2">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase text-[#2b1c3d] leading-[1.05] mb-4 sm:mb-5" style={{ textShadow: '0px 2px 10px rgba(255,255,255,0.8)' }}>
              <span className="text-[#7b5ea7]">{escapeHtml(data.hero.line1)}</span>
              <br />
              {escapeHtml(data.hero.line2)}
            </h1>
            <p className="text-sm sm:text-base font-semibold text-[#2b1c3d] max-w-[520px] mx-auto mb-6 sm:mb-8 px-2">{escapeHtml(data.hero.description)}</p>
            <a href="#struktur" className="inline-flex items-center gap-2.5 bg-[#7b5ea7] text-white px-6 sm:px-9 py-3 sm:py-4 rounded-full text-sm font-semibold shadow-[0_5px_15px_rgba(123,94,167,0.3)] hover:bg-[#2b1c3d] hover:-translate-y-0.5 transition min-h-[44px]">
              View KKN
            </a>
          </div>
        </section>

        {/* STRUKTUR */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 bg-white rounded-[20px] p-6 sm:p-10 -mt-5 sm:-mt-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] relative z-10 text-center" id="struktur">
          {data.struktur.map((item) => (
            <div key={item.id} className="p-2">
              <h3 className="text-base sm:text-xl font-extrabold uppercase tracking-wide text-[#2b1c3d]">{escapeHtml(item.jabatan)}</h3>
              <p className="text-xs uppercase tracking-wide font-semibold text-gray-400 mt-1.5">{escapeHtml(item.deskripsi)}</p>
            </div>
          ))}
        </section>

        {/* PROGRAM KERJA */}
        <h2 className="text-sm font-extrabold uppercase tracking-[2px] text-[#2b1c3d] mt-14 sm:mt-16 mb-4 sm:mb-5 text-center" id="program">Program Kerja</h2>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {data.program.map((p) => (
            <div
              key={p.id}
              role="button"
              tabIndex={0}
              onClick={() => openProgramModal(p)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProgramModal(p); } }}
              className="bg-[#ece6f5] p-6 sm:p-8 rounded-[20px] flex flex-col cursor-pointer transition hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(123,94,167,0.18)] hover:bg-gradient-to-br hover:from-[#ece6f5] hover:to-[#e3d9f2] select-none"
            >
              <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center mb-4 text-xl transition hover:scale-110">{escapeHtml(p.icon)}</div>
              <h4 className="text-base font-bold text-[#2b1c3d] mb-2.5">{escapeHtml(p.title)}</h4>
              <p className="text-xs text-gray-500 mb-5 flex-grow">{escapeHtml(p.shortDesc)}</p>
              <div className="text-xl text-[#2b1c3d] transition hover:translate-x-1.5 hover:text-[#7b5ea7]">{'\u2192'}</div>
            </div>
          ))}
        </section>

        {/* GALLERY */}
        <h2 className="text-sm font-extrabold uppercase tracking-[2px] text-[#2b1c3d] mt-14 sm:mt-16 mb-4 sm:mb-5 text-center" id="gallery">Gallery</h2>
        <GallerySection items={data.gallery} />

        {/* CONTACT + PARTNERS + FOOTER */}
        <section className="mt-16 sm:mt-24 px-5 sm:px-14 py-12 sm:py-20 bg-gradient-to-br from-[#ece6f5] via-[#ded0f0] to-[#ece6f5] rounded-[24px] sm:rounded-[40px] relative overflow-hidden" id="contact">
          <div className="relative z-1 text-center max-w-[900px] mx-auto">
            <div className="text-xs font-bold tracking-[3px] uppercase text-[#7b5ea7] mb-3">Mari Terhubung</div>
            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase text-[#2b1c3d] leading-tight mb-4">
              Punya Pertanyaan?<br />
              <span className="text-[#7b5ea7]">Ayo Bicara!</span>
            </h2>
            <p className="text-sm text-gray-500 max-w-[560px] mx-auto mb-10 sm:mb-12 leading-relaxed">
              Kami terbuka untuk kolaborasi, pertanyaan, atau sekadar berbagi cerita seputar KKN Penyetaraan. Jangan ragu untuk menghubungi kami melalui platform di bawah ini.
            </p>

            {/* Contact cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-[800px] mx-auto">
              <a href={data.contact.instagramUrl} target="_blank" rel="noopener" className="flex items-center gap-3.5 p-4 sm:p-6 bg-white/85 backdrop-blur rounded-[20px] border border-white/90 shadow-sm hover:-translate-y-1.5 hover:shadow-lg hover:border-[#7b5ea7] transition">
                <div className="w-12 h-12 rounded-[14px] flex items-center justify-center bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white shrink-0">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-xs font-bold uppercase tracking-wide text-[#7b5ea7]">Instagram</div>
                  <div className="text-sm font-bold text-[#2b1c3d] truncate">{escapeHtml(data.contact.instagramUsername)}</div>
                </div>
              </a>
              <a href={data.contact.tiktokUrl} target="_blank" rel="noopener" className="flex items-center gap-3.5 p-4 sm:p-6 bg-white/85 backdrop-blur rounded-[20px] border border-white/90 shadow-sm hover:-translate-y-1.5 hover:shadow-lg hover:border-[#7b5ea7] transition">
                <div className="w-12 h-12 rounded-[14px] flex items-center justify-center bg-gradient-to-br from-black via-[#25f4ee] to-[#fe2c55] text-white shrink-0">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/></svg>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-xs font-bold uppercase tracking-wide text-[#7b5ea7]">TikTok</div>
                  <div className="text-sm font-bold text-[#2b1c3d] truncate">{escapeHtml(data.contact.tiktokUsername)}</div>
                </div>
              </a>
              <a href={`mailto:${data.contact.email}`} className="flex items-center gap-3.5 p-4 sm:p-6 bg-white/85 backdrop-blur rounded-[20px] border border-white/90 shadow-sm hover:-translate-y-1.5 hover:shadow-lg hover:border-[#7b5ea7] transition">
                <div className="w-12 h-12 rounded-[14px] flex items-center justify-center bg-gradient-to-br from-[#7b5ea7] to-[#a689c9] text-white shrink-0">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-xs font-bold uppercase tracking-wide text-[#7b5ea7]">Email</div>
                  <div className="text-sm font-bold text-[#2b1c3d] truncate">{escapeHtml(data.contact.email)}</div>
                </div>
              </a>
            </div>

            {/* Partners */}
            <div className="mt-12 sm:mt-14 p-7 sm:p-12 bg-white rounded-[24px] sm:rounded-[32px] shadow-[0_10px_40px_rgba(123,94,167,0.08)] relative overflow-hidden">
              <div className="mb-8 sm:mb-12">
                <div className="text-xs font-extrabold uppercase tracking-[3px] text-[#7b5ea7] mb-6 sm:mb-9 flex items-center justify-center gap-4">
                  <span className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-[rgba(123,94,167,0.12)]" />
                  Support By
                  <span className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-[rgba(123,94,167,0.12)]" />
                </div>
                <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12">
                  {data.partners.support.map((p) => (
                    <div key={p.id} className="flex items-center justify-center h-12 sm:h-18 max-w-[160px] transition hover:scale-110 hover:-translate-y-1 cursor-pointer" title={escapeHtml(p.name)}>
                      {p.logo && <img src={escapeHtml(p.logo)} alt={escapeHtml(p.name)} className="max-h-full max-w-full object-contain" />}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-extrabold uppercase tracking-[3px] text-[#7b5ea7] mb-6 sm:mb-9 flex items-center justify-center gap-4">
                  <span className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-[rgba(123,94,167,0.12)]" />
                  Sponsor By
                  <span className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-[rgba(123,94,167,0.12)]" />
                </div>
                <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12">
                  {data.partners.sponsor.map((p) => (
                    <div key={p.id} className="flex items-center justify-center h-12 sm:h-18 max-w-[160px] transition hover:scale-110 hover:-translate-y-1 cursor-pointer" title={escapeHtml(p.name)}>
                      {p.logo && <img src={escapeHtml(p.logo)} alt={escapeHtml(p.name)} className="max-h-full max-w-full object-contain" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 sm:mt-12 pt-6 sm:pt-7 border-t border-[rgba(123,94,167,0.15)] flex flex-wrap gap-3 justify-between items-center text-xs text-gray-400">
              <div onClick={onFooterClick} className="cursor-pointer select-none" title="">
                &copy; 2025 <strong className="text-[#7b5ea7] font-bold">KKN Penyetaraan</strong>. All rights reserved.
              </div>
              <div className="font-medium flex items-center gap-1.5">
                Dibuat dengan <span className="text-[#e74c5b]" style={{ animation: 'heartbeat 1.5s ease-in-out infinite' }}>{'\u2665'}</span> untuk desa
              </div>
            </div>
          </div>
        </section>
      </div>

      {showLogin && <LoginModal onClose={onLoginClose} onLogin={onLogin} />}
    </div>
  );
}

// ============================================
// GALLERY SECTION
// ============================================
const sizeClasses = ['size-1x1', 'size-1x1', 'size-1x1', 'size-2x1', 'size-2x1', 'size-1x2', 'size-2x2'];

function GallerySection({ items }: { items: SiteData['gallery'] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let raf: number;
    let paused = false;

    const autoScroll = () => {
      if (!paused && el.scrollWidth > el.clientWidth * 2) {
        el.scrollLeft += 0.5;
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft -= el.scrollWidth / 2;
        }
      }
      raf = requestAnimationFrame(autoScroll);
    };
    raf = requestAnimationFrame(autoScroll);

    const pause = () => { paused = true; };
    const resume = () => { paused = false; };

    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resume);
    el.addEventListener('touchstart', pause, { passive: true });
    el.addEventListener('touchend', () => setTimeout(resume, 1500), { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('mouseenter', pause);
      el.removeEventListener('mouseleave', resume);
      el.removeEventListener('touchstart', pause);
      el.removeEventListener('touchend', resume);
    };
  }, [items]);

  // Keyboard nav for lightbox
  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowLeft') setLightbox((p) => (p === null ? null : (p - 1 + items.length) % items.length));
      if (e.key === 'ArrowRight') setLightbox((p) => (p === null ? null : (p + 1) % items.length));
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [lightbox, items.length]);

  return (
    <>
      <style>{`
        .gallery-scroll { display: grid; grid-auto-flow: column dense; grid-template-rows: repeat(2, 1fr); grid-auto-columns: 180px; height: 500px; gap: 14px; overflow-x: auto; overflow-y: hidden; padding: 8px 4px; scrollbar-width: none; -ms-overflow-style: none; }
        .gallery-scroll::-webkit-scrollbar { display: none; }
        .gallery-item { position: relative; border-radius: 16px; overflow: hidden; background: #ece6f5; transition: transform 0.4s, box-shadow 0.3s; cursor: pointer; }
        .gallery-item.size-1x1 { grid-column: span 1; grid-row: span 1; }
        .gallery-item.size-1x2 { grid-column: span 1; grid-row: span 2; }
        .gallery-item.size-2x1 { grid-column: span 2; grid-row: span 1; }
        .gallery-item.size-2x2 { grid-column: span 2; grid-row: span 2; }
        .gallery-item img, .gallery-item video { width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
        .gallery-item::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 0%, transparent 45%, rgba(43,28,61,0.75) 100%); opacity: 0; transition: opacity 0.3s; pointer-events: none; z-index: 2; }
        .gallery-item:hover::after { opacity: 1; }
        .gallery-item:hover { transform: translateY(-4px); box-shadow: 0 15px 40px rgba(43,28,61,0.2); z-index: 5; }
        .gallery-item.is-video::before { content: '\\25B6 VIDEO'; position: absolute; top: 12px; left: 12px; padding: 4px 10px; background: rgba(43,28,61,0.85); color: white; font-size: 9px; font-weight: 700; letter-spacing: 0.8px; border-radius: 20px; z-index: 3; }
        .gallery-caption { position: absolute; bottom: 0; left: 0; right: 0; padding: 14px 16px; color: white; z-index: 4; transform: translateY(20px); opacity: 0; transition: all 0.4s; pointer-events: none; }
        .gallery-item:hover .gallery-caption { transform: translateY(0); opacity: 1; }
        @media (hover: none) { .gallery-item::after { opacity: 1; } .gallery-caption { transform: translateY(0); opacity: 1; } }
        @media (max-width: 1100px) { .gallery-scroll { grid-auto-columns: 150px; height: 440px; } }
        @media (max-width: 900px) { .gallery-scroll { grid-auto-columns: 130px; height: 380px; } }
        @media (max-width: 600px) { .gallery-scroll { grid-auto-columns: 110px; height: 320px; gap: 8px; } }
      `}</style>

      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-10 z-10 pointer-events-none bg-gradient-to-r from-[#f7f5fb] to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-10 z-10 pointer-events-none bg-gradient-to-l from-[#f7f5fb] to-transparent" />
        <div ref={scrollRef} className="gallery-scroll">
          {items.map((item, i) => {
            const sizeClass = sizeClasses[i % sizeClasses.length];
            return (
              <div key={item.id} className={`gallery-item ${sizeClass} ${item.type === 'video' ? 'is-video' : ''}`} onClick={() => setLightbox(i)}>
                {item.type === 'video' ? (
                  <video autoPlay muted loop playsInline>
                    <source src={escapeHtml(item.src)} type="video/mp4" />
                  </video>
                ) : (
                  <img src={escapeHtml(item.src)} alt={escapeHtml(item.title)} />
                )}
                <div className="gallery-caption">
                  <h5 className="text-sm font-bold uppercase tracking-wide leading-tight">{escapeHtml(item.title)}</h5>
                  <p className="text-[10px] opacity-85 leading-tight">{escapeHtml(item.desc)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 bg-[rgba(20,12,30,0.92)] backdrop-blur-md z-[9999] flex items-center justify-center p-4 sm:p-16" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 border border-white/15 text-white text-xl flex items-center justify-center hover:bg-white/20 hover:rotate-90 transition z-100" onClick={() => setLightbox(null)}>{'\u2715'}</button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 border border-white/15 text-white text-lg flex items-center justify-center hover:bg-white/25 hover:scale-110 transition z-100" onClick={(e) => { e.stopPropagation(); setLightbox((p) => (p === null ? null : (p - 1 + items.length) % items.length)); }}>{'\u2039'}</button>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 border border-white/15 text-white text-lg flex items-center justify-center hover:bg-white/25 hover:scale-110 transition z-100" onClick={(e) => { e.stopPropagation(); setLightbox((p) => (p === null ? null : (p + 1) % items.length)); }}>{'\u203A'}</button>
          <div className="flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            {items[lightbox].type === 'video' ? (
              <video src={escapeHtml(items[lightbox].src)} controls autoPlay className="max-w-[92vw] max-h-[80vh] rounded-2xl" />
            ) : (
              <img src={escapeHtml(items[lightbox].src)} alt={escapeHtml(items[lightbox].title)} className="max-w-[92vw] max-h-[80vh] rounded-2xl object-contain" />
            )}
            <div className="mt-4 text-center text-white">
              <h4 className="text-lg sm:text-xl font-bold uppercase tracking-wide">{escapeHtml(items[lightbox].title)}</h4>
              <p className="text-sm opacity-70">{escapeHtml(items[lightbox].desc)}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ============================================
// PROGRAM MODAL
// ============================================
let programModalState: { open: boolean; program: ProgramItem | null } = { open: false, program: null };
const programModalListeners: Array<(s: { open: boolean; program: ProgramItem | null }) => void> = [];

function openProgramModal(p: ProgramItem) {
  programModalState = { open: true, program: p };
  programModalListeners.forEach((fn) => fn(programModalState));
}

function ProgramModal() {
  const [state, setState] = useState(programModalState);
  useEffect(() => {
    const listener = (s: typeof programModalState) => setState(s);
    programModalListeners.push(listener);
    return () => { programModalListeners.splice(programModalListeners.indexOf(listener), 1); };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state.open) {
        programModalState = { open: false, program: null };
        programModalListeners.forEach((fn) => fn(programModalState));
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [state.open]);

  if (!state.open || !state.program) return null;
  const p = state.program;

  const activities = p.activities.split('\n').filter((a) => a.trim());
  const infoPairs = p.info.split('\n').filter((i) => i.trim());

  return (
    <div className="fixed inset-0 bg-[rgba(20,12,30,0.7)] backdrop-blur-md z-[9998] flex items-center justify-center p-4 sm:p-10" onClick={() => { programModalState = { open: false, program: null }; programModalListeners.forEach((fn) => fn(programModalState)); }}>
      <div className="relative w-full max-w-[620px] max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 text-[#2b1c3d] text-lg flex items-center justify-center hover:bg-white hover:rotate-90 transition z-10" onClick={() => { programModalState = { open: false, program: null }; programModalListeners.forEach((fn) => fn(programModalState)); }}>{'\u2715'}</button>
        <div className="relative p-7 sm:p-10 bg-gradient-to-br from-[#ece6f5] to-[#ded0f0] rounded-t-3xl overflow-hidden">
          <div className="absolute -top-15 -right-15 w-50 h-50 bg-[rgba(123,94,167,0.15)] rounded-full z-0" />
          <div className="relative z-1">
            <div className="w-18 h-18 bg-white rounded-full flex items-center justify-center text-4xl mb-5 shadow-md" style={{ width: 72, height: 72 }}>{escapeHtml(p.icon)}</div>
            <div className="text-xs font-bold uppercase tracking-[2px] text-[#7b5ea7] mb-1.5">{escapeHtml(p.category)}</div>
            <h3 className="text-2xl sm:text-3xl font-extrabold uppercase text-[#2b1c3d] leading-tight mb-2.5">{escapeHtml(p.title)}</h3>
            <p className="text-sm text-gray-500">{escapeHtml(p.subtitle)}</p>
          </div>
        </div>
        <div className="p-6 sm:p-10">
          <div className="mb-6">
            <div className="text-xs font-extrabold uppercase tracking-wide text-[#7b5ea7] mb-3 flex items-center gap-2">
              Deskripsi Program <span className="flex-1 h-px bg-gradient-to-r from-[rgba(123,94,167,0.12)] to-transparent" />
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{escapeHtml(p.description)}</p>
          </div>
          <div className="mb-6">
            <div className="text-xs font-extrabold uppercase tracking-wide text-[#7b5ea7] mb-3 flex items-center gap-2">
              Kegiatan Utama <span className="flex-1 h-px bg-gradient-to-r from-[rgba(123,94,167,0.12)] to-transparent" />
            </div>
            <div className="flex flex-col gap-2.5">
              {activities.map((a, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-[#ece6f5] rounded-xl transition hover:bg-[#e3d9f2] hover:translate-x-1">
                  <div className="w-5.5 h-5.5 bg-white rounded-full flex items-center justify-center text-xs text-[#7b5ea7] font-bold shrink-0" style={{ width: 22, height: 22 }}>{i + 1}</div>
                  <div className="text-sm text-[#2b1c3d] font-medium leading-snug">{escapeHtml(a)}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wide text-[#7b5ea7] mb-3 flex items-center gap-2">
              Informasi <span className="flex-1 h-px bg-gradient-to-r from-[rgba(123,94,167,0.12)] to-transparent" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {infoPairs.map((pair, i) => {
                const parts = pair.split('|');
                if (parts.length < 2) return null;
                return (
                  <div key={i} className="p-3 bg-[#ece6f5] rounded-xl">
                    <div className="text-[10px] uppercase tracking-wide font-bold text-[#7b5ea7] mb-1">{escapeHtml(parts[0].trim())}</div>
                    <div className="text-sm text-[#2b1c3d] font-semibold">{escapeHtml(parts.slice(1).join('|').trim())}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
