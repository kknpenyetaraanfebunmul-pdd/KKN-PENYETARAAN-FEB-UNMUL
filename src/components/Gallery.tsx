import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import type { SiteContent } from '../types';

interface GalleryProps {
  content: SiteContent['gallery'];
}

export default function Gallery({ content }: GalleryProps) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightbox(null), []);
  const nextImage = useCallback(() => {
    setLightbox((prev) => {
      if (prev === null) return prev;
      return (prev + 1) % content.length;
    });
  }, [content.length]);
  const prevImage = useCallback(() => {
    setLightbox((prev) => {
      if (prev === null) return prev;
      return (prev - 1 + content.length) % content.length;
    });
  }, [content.length]);

  useEffect(() => {
    if (lightbox === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKey);
    document.body.classList.add('modal-open');
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.classList.remove('modal-open');
    };
  }, [lightbox, closeLightbox, nextImage, prevImage]);

  // ============================================================
  // LOGIKA INFINITY MARQUEE
  // Pastikan konten cukup lebar agar tidak ada gap saat looping
  // ============================================================
  const itemCount = Math.max(content.length, 1);
  
  // Minimal 12 item per "half" agar selalu lebih lebar dari layar
  const itemsPerHalf = 12;
  const repeatCount = Math.max(1, Math.ceil(itemsPerHalf / itemCount));
  
  // Half pertama: konten diulang sebanyak repeatCount
  const halfContent = Array(repeatCount).fill(content).flat();
  
  // Gabungkan 2 half yang identik (untuk animasi -50% yang seamless)
  const extendedContent = [...halfContent, ...halfContent];
  
  // Durasi animasi proporsional dengan jumlah item (biar kecepatan konsisten)
  // ~4 detik per item, minimal 40 detik
  const animationDuration = Math.max(40, halfContent.length * 4);

  return (
    <section id="gallery" className="py-20 sm:py-28 overflow-hidden">
      {/* KEYFRAMES ANIMASI MARQUEE */}
      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee-scroll linear infinite;
          width: max-content;
          will-change: transform;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-14">
          <p className="text-primary-purple font-semibold text-sm tracking-widest uppercase mb-3">
            Dokumentasi
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-dark-purple mb-4">
            Gallery
          </h2>
          <div className="w-20 h-1.5 bg-primary-purple rounded-full mx-auto" />
        </div>
      </div>

      {/* CONTAINER MARQUEE (FULL WIDTH) */}
      <div className="relative w-full">
        {/* Gradient fade di kiri & kanan agar transisi mulus */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none" />

        <div
          className="marquee-track flex gap-4 sm:gap-6 py-4"
          style={{ animationDuration: `${animationDuration}s` }}
        >
          {extendedContent.map((item, idx) => {
            const realIndex = idx % content.length;
            const isVideo = item.tipe === 'video';

            return (
              <div
                key={`${item.id}-${idx}`}
                className="flex-shrink-0 h-[300px] sm:h-[450px] w-fit group cursor-pointer relative rounded-3xl overflow-hidden shadow-lg bg-card-bg"
                onClick={() => setLightbox(realIndex)}
              >
                {isVideo ? (
                  <>
                    <video
                      src={item.url}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      className="h-full w-auto object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-dark-purple/20 pointer-events-none">
                      <Play size={48} className="text-white fill-white opacity-80" />
                    </div>
                  </>
                ) : (
                  <img
                    src={item.url}
                    alt={item.judul}
                    loading="lazy"
                    className="h-full w-auto object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )}

                {/* Overlay Judul & Deskripsi saat Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-purple/90 via-dark-purple/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 pointer-events-none">
                  <h3 className="text-white font-bold text-lg mb-1">
                    {item.judul}
                  </h3>
                  <p className="text-white/70 text-sm line-clamp-2">
                    {item.deskripsi}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {lightbox !== null && content[lightbox] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-dark-purple/95 backdrop-blur-md animate-fade-in p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 text-white/80 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all z-10"
            aria-label="Close"
          >
            <X size={28} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-3 sm:left-8 text-white/80 hover:text-white hover:bg-white/10 rounded-full p-3 transition-all z-10"
            aria-label="Previous"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-3 sm:right-8 text-white/80 hover:text-white hover:bg-white/10 rounded-full p-3 transition-all z-10"
            aria-label="Next"
          >
            <ChevronRight size={28} />
          </button>

          <div
            className="max-w-4xl w-full max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {content[lightbox].tipe === 'video' ? (
              <video
                src={content[lightbox].url}
                controls
                autoPlay
                className="max-w-full max-h-[75vh] rounded-2xl shadow-2xl"
              />
            ) : (
              <img
                src={content[lightbox].url}
                alt={content[lightbox].judul}
                className="max-w-full max-h-[75vh] rounded-2xl object-contain shadow-2xl"
              />
            )}
            <div className="mt-4 text-center">
              <h3 className="text-white font-bold text-xl">
                {content[lightbox].judul}
              </h3>
              <p className="text-white/60 text-sm mt-1">
                {content[lightbox].deskripsi}
              </p>
              <p className="text-white/40 text-xs mt-2">
                {lightbox + 1} / {content.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}