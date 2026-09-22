import { useState, useRef } from 'react';
import { X, Lock, AlertCircle } from 'lucide-react';
import type { SiteContent } from '../types';
import { ADMIN_SESSION_KEY, ADMIN_PASSCODE } from '../useContent';

interface FooterProps {
  content: SiteContent['footer'];
  onAdminAccess: () => void;
}

export default function Footer({ content, onAdminAccess }: FooterProps) {
  const clickCountRef = useRef(0);
  const lastClickRef = useRef(0);
  const [showPasscode, setShowPasscode] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  const handleCopyrightClick = () => {
    const now = Date.now();
    if (now - lastClickRef.current > 2000) {
      clickCountRef.current = 1;
    } else {
      clickCountRef.current += 1;
    }
    lastClickRef.current = now;

    if (clickCountRef.current >= 8) {
      clickCountRef.current = 0;
      const isLoggedIn = sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
      if (isLoggedIn) {
        onAdminAccess();
      } else {
        setShowPasscode(true);
      }
    }
  };

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      setShowPasscode(false);
      setPasscode('');
      setError(false);
      onAdminAccess();
    } else {
      setError(true);
    }
  };

  return (
    <>
      {/* Footer utama — sudah gelap, cocok di kedua mode */}
      <footer className="bg-dark-purple dark:bg-[#1a0e2e] text-white pt-10 pb-32 px-5 sm:px-8 transition-colors duration-300">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-3 text-center">
          <button
            onClick={handleCopyrightClick}
            className="text-white/70 text-sm hover:text-white transition-colors focus:outline-none select-none"
          >
            {content.copyright}
          </button>
          <p className="text-white/50 text-sm">{content.madeWith}</p>
        </div>
      </footer>

      {/* MODAL PASSCODE */}
      {showPasscode && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-dark-purple/80 backdrop-blur-md animate-fade-in p-4"
          onClick={() => setShowPasscode(false)}
        >
          <div
            className="bg-bg dark:bg-dark-card rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-slide-up transition-colors duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-purple/10 flex items-center justify-center transition-colors duration-300">
                  <Lock size={20} className="text-primary-purple" />
                </div>
                <h3 className="text-lg font-bold text-dark-purple dark:text-dark-text transition-colors duration-300">
                  Admin Access
                </h3>
              </div>
              <button
                onClick={() => setShowPasscode(false)}
                className="text-dark-purple/40 dark:text-dark-text-muted hover:text-dark-purple dark:hover:text-dark-text p-1 transition-colors duration-300"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handlePasscodeSubmit}>
              <input
                type="password"
                inputMode="numeric"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError(false);
                }}
                placeholder="Masukkan passcode"
                autoFocus
                className={`w-full bg-card-bg dark:bg-dark-bg rounded-xl px-4 py-3 text-dark-purple dark:text-dark-text text-center text-lg tracking-widest font-semibold border-2 transition-all focus:outline-none ${
                  error
                    ? 'border-red-400'
                    : 'border-transparent focus:border-primary-purple'
                }`}
              />
              {error && (
                <p className="flex items-center justify-center gap-2 text-red-500 text-sm mt-3">
                  <AlertCircle size={16} />
                  Passcode salah, coba lagi
                </p>
              )}
              <button
                type="submit"
                className="w-full mt-5 bg-primary-purple hover:bg-primary-purple/90 text-white font-semibold py-3 rounded-xl transition-all"
              >
                Masuk
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}