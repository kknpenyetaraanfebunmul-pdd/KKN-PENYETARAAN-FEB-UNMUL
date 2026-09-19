import { useEffect } from 'react';
import { X, User } from 'lucide-react';
import type { StrukturRow } from '../types';

interface StrukturModalProps {
  data: StrukturRow;
  onClose: () => void;
}

export default function StrukturModal({ data, onClose }: StrukturModalProps) {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-dark-purple/80 backdrop-blur-md animate-fade-in p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-bg rounded-3xl max-w-3xl w-full my-8 shadow-2xl animate-slide-up overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-primary-purple to-primary-purple/80 p-6 sm:p-8 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all"
            aria-label="Close"
          >
            <X size={22} />
          </button>
          <p className="text-white/70 text-xs font-semibold tracking-widest uppercase mb-2">
            Divisi
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {data.jabatan}
          </h2>
        </div>

        {/* Daftar Anggota */}
        <div className="p-5 sm:p-8">
          <p className="text-sm text-dark-purple/60 mb-5 text-center">
            {data.members.length} Anggota
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {data.members.map((member, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-bubble-light shadow-sm"
              >
                {/* Foto/Avatar */}
                <div className="w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden bg-primary-purple/10 flex items-center justify-center">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <User size={32} className="text-primary-purple/60" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-dark-purple text-base truncate">
                    {member.name || 'Belum ada nama'}
                  </h3>
                  <p className="text-xs text-dark-purple/50 font-medium mt-1">
                    {member.nim ? `NIM: ${member.nim}` : 'NIM belum diisi'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}