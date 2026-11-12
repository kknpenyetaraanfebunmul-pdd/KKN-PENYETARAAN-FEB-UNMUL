import { useEffect, useState } from 'react';
import { X, User, Hash, Users } from 'lucide-react';
import type { StrukturMember } from '../types';

interface MemberModalProps {
  member: StrukturMember;
  jabatan: string;
  onClose: () => void;
}

export default function MemberModal({ member, jabatan, onClose }: MemberModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    
    // Kunci scroll di html & body
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

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center bg-dark-purple/90 backdrop-blur-md p-4 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-bg dark:bg-dark-card rounded-3xl max-w-md w-full shadow-2xl overflow-hidden transition-all duration-300 ${
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Foto Besar */}
        <div className="relative aspect-square bg-gradient-to-br from-primary-purple/20 to-primary-purple/5 dark:from-primary-purple/10 dark:to-transparent flex items-center justify-center overflow-hidden transition-colors">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white bg-dark-purple/40 hover:bg-dark-purple/60 backdrop-blur-sm rounded-full p-2 transition-all z-10"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {member.photo ? (
            <img
              src={member.photo}
              alt={member.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={96} className="text-primary-purple/40" />
          )}

          {/* Gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-bg dark:from-dark-card to-transparent transition-colors" />
        </div>

        {/* Info Detail */}
        <div className="px-6 pb-6 -mt-8 relative">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-dark-purple dark:text-dark-text mb-1 transition-colors">
              {member.name || 'Belum ada nama'}
            </h2>
            <p className="text-xs text-primary-purple font-bold tracking-widest uppercase mb-5">
              {jabatan}
            </p>
          </div>

          {/* Detail Grid */}
          <div className="space-y-3 pt-5 border-t border-bubble-light dark:border-dark-border transition-colors">
            <div className="flex items-center justify-center gap-2 text-dark-purple/70 dark:text-dark-text-muted transition-colors">
              <div className="w-8 h-8 rounded-lg bg-primary-purple/10 flex items-center justify-center">
                <Hash size={14} className="text-primary-purple" />
              </div>
              <span className="text-sm font-medium">
                {member.nim ? member.nim : 'NIM belum diisi'}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 text-dark-purple/70 dark:text-dark-text-muted transition-colors">
              <div className="w-8 h-8 rounded-lg bg-primary-purple/10 flex items-center justify-center">
                <Users size={14} className="text-primary-purple" />
              </div>
              <span className="text-sm font-medium">
                Divisi {jabatan}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}