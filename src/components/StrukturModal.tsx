import { useEffect, useState } from 'react';
import { X, User } from 'lucide-react';
import type { StrukturRow, StrukturMember } from '../types';
import MemberModal from './MemberModal';

interface StrukturModalProps {
  data: StrukturRow;
  onClose: () => void;
}

export default function StrukturModal({ data, onClose }: StrukturModalProps) {
  const [selectedMember, setSelectedMember] = useState<StrukturMember | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !selectedMember) onClose();
    };
    window.addEventListener('keydown', handleKey);
    document.body.classList.add('modal-open');
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.classList.remove('modal-open');
    };
  }, [onClose, selectedMember]);

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-dark-purple/80 backdrop-blur-md animate-fade-in p-3 sm:p-4 overflow-y-auto"
        onClick={onClose}
      >
        <div
          className="bg-bg dark:bg-dark-card rounded-2xl sm:rounded-3xl max-w-3xl w-full my-4 sm:my-8 shadow-2xl animate-slide-up overflow-hidden transition-colors duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-br from-primary-purple to-primary-purple/80 p-5 sm:p-8 text-center">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white/80 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all"
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <p className="text-white/70 text-xs font-semibold tracking-widest uppercase mb-1 sm:mb-2">
              Divisi
            </p>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white break-words px-8">
              {data.jabatan}
            </h2>
          </div>

          {/* Daftar Anggota */}
          <div className="p-4 sm:p-8">
            <p className="text-xs text-dark-purple/40 dark:text-dark-text-muted text-center mb-4 sm:mb-5 transition-colors">
              Klik anggota untuk melihat detail
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
              {data.members.map((member, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedMember(member)}
                  className="flex items-center gap-3 sm:gap-4 bg-white dark:bg-dark-bg rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-bubble-light dark:border-dark-border shadow-sm hover:shadow-xl hover:border-primary-purple/40 hover:-translate-y-1 transition-all duration-300 text-left group min-w-0"
                >
                  {/* Foto/Avatar */}
                  <div className="w-14 h-14 sm:w-20 sm:h-20 flex-shrink-0 rounded-xl sm:rounded-2xl overflow-hidden bg-primary-purple/10 flex items-center justify-center">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <User size={24} className="text-primary-purple/60 sm:hidden" />
                    )}
                    {!member.photo && (
                      <User
                        size={32}
                        className="text-primary-purple/60 hidden sm:block"
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-dark-purple dark:text-dark-text text-sm sm:text-base truncate group-hover:text-primary-purple transition-colors duration-300">
                      {member.name || 'Belum ada nama'}
                    </h3>
                    <p className="text-xs text-dark-purple/50 dark:text-dark-text-muted font-medium mt-0.5 sm:mt-1 truncate transition-colors duration-300">
                      {member.nim ? `NIM: ${member.nim}` : 'NIM belum diisi'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedMember && (
        <MemberModal
          member={selectedMember}
          jabatan={data.jabatan}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </>
  );
}