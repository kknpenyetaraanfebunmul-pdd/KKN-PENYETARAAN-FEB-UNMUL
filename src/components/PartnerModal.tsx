import { useEffect } from 'react';
import { X } from 'lucide-react';
import type { PartnerRow } from '../types';

interface PartnerModalProps {
  partner: PartnerRow;
  onClose: () => void;
}

export default function PartnerModal({ partner, onClose }: PartnerModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    document.body.classList.add('modal-open');
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.classList.remove('modal-open');
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-dark-purple/80 backdrop-blur-md animate-fade-in p-4"
      onClick={onClose}
    >
      <div
        className="bg-bg rounded-3xl max-w-md w-full shadow-2xl animate-slide-up overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-primary-purple to-primary-purple/80 p-6 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all"
            aria-label="Close"
          >
            <X size={22} />
          </button>
          <p className="text-white/70 text-xs font-semibold tracking-widest uppercase mb-1">
            {partner.grup === 'support' ? 'Didukung Oleh' : 'Disponsori Oleh'}
          </p>
          <h2 className="text-2xl font-extrabold text-white">
            {partner.nama}
          </h2>
        </div>

        {/* Logo */}
        <div className="p-8 flex items-center justify-center bg-white">
          <div className="w-48 h-48 rounded-2xl bg-card-bg border border-bubble-light flex items-center justify-center p-6">
            <img
              src={partner.logo_url}
              alt={partner.nama}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>

        {/* Info */}
        <div className="px-6 pb-6 text-center">
          <p className="text-sm text-dark-purple/50">
            Klik di luar area atau tekan <kbd className="px-2 py-0.5 bg-card-bg rounded text-xs font-mono">Esc</kbd> untuk menutup
          </p>
        </div>
      </div>
    </div>
  );
}