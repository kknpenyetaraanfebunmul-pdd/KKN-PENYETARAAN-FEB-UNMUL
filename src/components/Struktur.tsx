import Reveal from './Reveal';
import { useState } from 'react';
import type { SiteContent } from '../types';
import { Users, FileText, Wallet, Megaphone, Camera, Package } from 'lucide-react';
import StrukturModal from './StrukturModal';

const iconMap: Record<string, typeof Users> = {
  Ketua: Users,
  Sekretaris: FileText,
  Bendahara: Wallet,
  Humas: Megaphone,
  PDD: Camera,
  Perdek: Package,
};

interface StrukturProps {
  content: SiteContent['struktur'];
}

export default function Struktur({ content }: StrukturProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Kelompokkan jadi 3 level hierarki (index asli dipertahankan untuk modal)
  const indexed = content.map((item, idx) => ({ item, idx }));
  const levelOf = (jabatan: string) =>
    jabatan === 'Ketua'
      ? 0
      : jabatan === 'Sekretaris' || jabatan === 'Bendahara'
      ? 1
      : 2;
  const levels = [0, 1, 2].map((lv) =>
    indexed.filter(({ item }) => levelOf(item.jabatan) === lv)
  );

  return (
    <section
      id="struktur"
      className="py-20 sm:py-28 px-4 sm:px-8 relative bg-white dark:bg-dark-bg transition-colors duration-300 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <Reveal>
          <div className="text-center mb-12 sm:mb-16 px-2">
            <p className="text-primary-purple font-semibold text-xs sm:text-sm tracking-widest uppercase mb-3">
              Tim Kami
            </p>
            <h2 className="text-2xl sm:text-5xl font-extrabold text-dark-purple dark:text-dark-text mb-4 transition-colors break-words">
              Struktur KKN
            </h2>
            <div className="w-20 h-1.5 bg-primary-purple rounded-full mx-auto" />
            <p className="text-xs sm:text-sm text-dark-purple/50 dark:text-dark-text-muted mt-4 transition-colors">
              Klik salah satu kartu untuk melihat detail anggota
            </p>
          </div>
        </Reveal>

        {/* Grid Cards */}
        <div className="flex flex-col items-center">
          {levels.map((row, lv) =>
            row.length === 0 ? null : (
              <div key={lv} className="flex flex-col items-center w-full">
                {lv > 0 && (
                  <div className="w-px h-8 sm:h-12 bg-primary-purple/30" />
                )}
                <div className="flex flex-wrap justify-center gap-4 sm:gap-8 items-stretch w-full">
                  {row.map(({ item, idx }) => {
            const Icon = iconMap[item.jabatan] || Users;
            const photos = (item.members || [])
              .filter((m) => m.photo)
              .slice(0, 1);
            return (
              <Reveal key={item.id} delay={idx * 150} direction={idx % 2 === 0 ? 'left' : 'right'} className="w-full sm:w-72 lg:w-80">
              <button
                key={item.id}
                onClick={() => setSelectedIndex(idx)}
                className="group relative bg-white dark:bg-dark-card rounded-2xl sm:rounded-3xl text-center transition-shadow duration-300 hover:shadow-2xl border border-bubble-light dark:border-dark-border overflow-hidden flex flex-col h-full cursor-pointer w-full sm:w-72 lg:w-80"
                style={{
                  animation: `fadeIn 0.5s ease ${idx * 0.1}s both`,
                }}
              >
                {/* Efek Background saat Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-purple/0 to-primary-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10 flex flex-col items-center flex-grow w-full">
                  {/* Foto Cover / Avatar (Desain Full Banner) */}
                  <div className="w-full relative flex-shrink-0">
                    {photos.length > 0 ? (
                      <div className="w-full h-48 sm:h-56 overflow-hidden relative">
                        <img
                          src={photos[0].photo}
                          alt={photos[0].name}
                          loading="lazy"
                          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        {/* Overlay Gradasi Solid dengan Masking */}
                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-white dark:bg-dark-card pointer-events-none transition-colors duration-300" style={{ maskImage: 'linear-gradient(to top, black 0%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)' }} />
                      </div>
                    ) : (
                      <div className="w-full h-48 sm:h-56 bg-primary-purple/5 flex items-center justify-center transition-all duration-300 group-hover:bg-primary-purple">
                        <Icon
                          size={48}
                          className="text-primary-purple/60 transition-colors duration-300 group-hover:text-white"
                        />
                      </div>
                    )}
                  </div>

                  {/* Container Teks (Padding dipindah ke sini) */}
                  <div className="px-5 pb-6 pt-4 flex flex-col flex-grow w-full">
                    {/* Teks Jabatan */}
                    <h3 className="text-base sm:text-xl font-bold text-dark-purple dark:text-dark-text mb-3 sm:mb-4 transition-colors break-words px-1">
                      {item.jabatan}
                    </h3>

                    {/* DAFTAR NAMA */}
                    <ul className="space-y-1 sm:space-y-1.5 flex-grow w-full px-1">
                      {(item.members || []).map((member, i) => (
                        <li
                          key={i}
                          className="text-xs sm:text-sm text-dark-purple/70 dark:text-dark-text-muted font-medium leading-snug sm:leading-relaxed transition-colors break-words"
                        >
                          {member.name}
                        </li>
                      ))}
                    </ul>

                    {/* Garis Aksen Kecil di Bawah */}
                    <div className="mt-auto pt-4 sm:pt-6 w-full flex justify-center">
                      <div className="w-8 h-1 bg-primary-purple/20 rounded-full transition-all duration-300 group-hover:w-16 group-hover:bg-primary-purple/60" />
                    </div>
                  </div>
                </div>
              </button>
              </Reveal>
            );
                  })}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* MODAL */}
      {selectedIndex !== null && content[selectedIndex] && (
        <StrukturModal
          data={content[selectedIndex]}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </section>
  );
}