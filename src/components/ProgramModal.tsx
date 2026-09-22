import { useEffect } from 'react';
import { X, Target, Calendar, MapPin, Users } from 'lucide-react';
import type { ProgramRow } from '../types';

interface ProgramModalProps {
  program: ProgramRow;
  onClose: () => void;
}

export default function ProgramModal({ program, onClose }: ProgramModalProps) {
  // Handle Escape key untuk close
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

  const infoItems = [
    { icon: Target, label: 'Sasaran', value: program.info?.sasaran || '-' },
    { icon: Calendar, label: 'Jadwal', value: program.info?.jadwal || '-' },
    { icon: MapPin, label: 'Lokasi', value: program.info?.lokasi || '-' },
    { icon: Users, label: 'Peserta/Target/Layanan', value: program.info?.target || '-' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-purple/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-bg dark:bg-dark-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary-purple to-dark-purple px-6 sm:px-8 py-6 flex items-start justify-between rounded-t-3xl z-10">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{program.icon}</span>
            <h3 className="text-2xl font-extrabold text-white">
              {program.judul}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {/* Deskripsi Lengkap */}
          <p className="text-dark-purple/80 dark:text-dark-text-muted leading-relaxed mb-8 transition-colors">
            {program.deskripsi_lengkap}
          </p>

          {/* Kegiatan */}
          <h4 className="text-lg font-bold text-dark-purple dark:text-dark-text mb-4 flex items-center gap-2 transition-colors">
            <span className="w-1.5 h-6 bg-primary-purple rounded-full" />
            Kegiatan Utama
          </h4>
          <ol className="space-y-3 mb-8">
            {(program.kegiatan || []).map((activity, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 bg-card-bg dark:bg-dark-bg rounded-xl p-3 transition-colors"
              >
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary-purple text-white text-sm font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="text-sm text-dark-purple/80 dark:text-dark-text-muted pt-0.5 transition-colors">
                  {activity}
                </span>
              </li>
            ))}
          </ol>

          {/* Info Program */}
          <h4 className="text-lg font-bold text-dark-purple dark:text-dark-text mb-4 flex items-center gap-2 transition-colors">
            <span className="w-1.5 h-6 bg-primary-purple rounded-full" />
            Informasi Program
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {infoItems.map((info) => {
              const Icon = info.icon;
              return (
                <div
                  key={info.label}
                  className="bg-card-bg dark:bg-dark-bg rounded-2xl p-4 border border-bubble-light dark:border-dark-border transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={18} className="text-primary-purple" />
                    <span className="text-xs font-semibold text-primary-purple uppercase tracking-wide">
                      {info.label}
                    </span>
                  </div>
                  <p className="text-sm text-dark-purple/80 dark:text-dark-text-muted transition-colors">
                    {info.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}