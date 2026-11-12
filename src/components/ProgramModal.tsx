import { useEffect, useState } from 'react';
import { X, Target, Calendar, MapPin, Users } from 'lucide-react';
import type { ProgramRow } from '../types';

interface ProgramModalProps {
  program: ProgramRow;
  onClose: () => void;
}

export default function ProgramModal({ program, onClose }: ProgramModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKey);
    
    document.documentElement.classList.add('modal-open');
    document.body.classList.add('modal-open');
    
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.documentElement.classList.remove('modal-open');
      document.body.classList.remove('modal-open');
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!program) return null; // Mencegah crash total jika data hilang

  // Pengaman untuk array kegiatan dan objek info
  const safeKegiatan = Array.isArray(program.kegiatan) ? program.kegiatan : [];
  const safeInfo = program.info || { sasaran: '', jadwal: '', lokasi: '', target: '' };

  const infoItems = [
    { icon: Target, label: 'Sasaran', value: safeInfo.sasaran || '-' },
    { icon: Calendar, label: 'Jadwal', value: safeInfo.jadwal || '-' },
    { icon: MapPin, label: 'Lokasi', value: safeInfo.lokasi || '-' },
    { icon: Users, label: 'Peserta/Target/Layanan', value: safeInfo.target || '-' },
  ];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-purple/70 backdrop-blur-sm transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-bg dark:bg-dark-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transition-all duration-300 ${
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-primary-purple to-dark-purple px-6 sm:px-8 py-6 flex items-start justify-between rounded-t-3xl z-10">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{program.icon || '📌'}</span>
            <h3 className="text-2xl font-extrabold text-white">
              {program.judul || 'Tanpa Judul'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <p className="text-dark-purple/80 dark:text-dark-text-muted leading-relaxed mb-8 transition-colors">
            {program.deskripsi_lengkap || 'Belum ada deskripsi lengkap.'}
          </p>

          <h4 className="text-lg font-bold text-dark-purple dark:text-dark-text mb-4 flex items-center gap-2 transition-colors">
            <span className="w-1.5 h-6 bg-primary-purple rounded-full" />
            Kegiatan Utama
          </h4>
          <ol className="space-y-3 mb-8">
            {safeKegiatan.map((activity, idx) => (
              <li key={idx} className="flex items-start gap-3 bg-card-bg dark:bg-dark-bg rounded-xl p-3 transition-colors">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary-purple text-white text-sm font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="text-sm text-dark-purple/80 dark:text-dark-text-muted pt-0.5 transition-colors">
                  {activity}
                </span>
              </li>
            ))}
            {safeKegiatan.length === 0 && (
              <p className="text-sm text-dark-purple/50 italic">Belum ada kegiatan yang diisi.</p>
            )}
          </ol>

          <h4 className="text-lg font-bold text-dark-purple dark:text-dark-text mb-4 flex items-center gap-2 transition-colors">
            <span className="w-1.5 h-6 bg-primary-purple rounded-full" />
            Informasi Program
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {infoItems.map((info) => {
              const Icon = info.icon;
              return (
                <div key={info.label} className="bg-card-bg dark:bg-dark-bg rounded-2xl p-4 border border-bubble-light dark:border-dark-border transition-colors">
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