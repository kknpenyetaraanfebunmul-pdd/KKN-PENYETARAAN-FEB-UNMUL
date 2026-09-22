import { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import type { SiteContent } from '../types';

interface GalleryProps {
  content: SiteContent['gallery'];
}

export default function Gallery({ content }: GalleryProps) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0 });

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
  // PAUSE / RESUME MARQUEE
  // ============================================================
  const pauseMarquee = useCallback(() => {
    setIsPaused(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  }, []);

  const resumeMarqueeLater = useCallback((delay = 3000) => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, delay);
  }, []);

  // Cleanup timer saat unmount
  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  // ============================================================
  // DRAG TO SCROLL
  // ============================================================
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    dragState.current.isDown = true;
    dragState.current.startX = e.pageX - el.offsetLeft;
    dragState.current.scrollLeft = el.scrollLeft;
    pauseMarquee();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragState.current.isDown) return;
    const el = scrollRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - dragState.current.startX) * 1.5;
    el.scrollLeft = dragState.current.scrollLeft - walk;
  };

  const handleMouseUp = () => {
    dragState.current.isDown = false;
    resumeMarqueeLater(2500);
  };

  const handleMouseLeave = () => {
    dragState.current.isDown = false;
    resumeMarqueeLater(2500);
  };

  // ============================================================
  // DATA PREPARATION
  // ============================================================
  const itemCount = Math.max(content.length, 1);
  const itemsPerHalf = 12;
  const repeatCount = Math.max(1, Math.ceil(itemsPerHalf / itemCount));
  const halfContent = Array(repeatCount).fill(content).flat();
  const extendedContent = [...halfContent, ...halfContent];
  const animationDuration = Math.max(40, halfContent.length * 8);

  return (
    <section id="gallery" className="py-20 sm:py-28 overflow-hidden">
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
        .marquee-track.paused {
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
          <p className="text-xs text-dark-purple/40 mt-3">
            Klik & geser untuk menjelajah, atau sentuh gambar untuk memperbesar
          </p>
        </div>
      </div>

      {/* CONTAINER MARQUEE */}
      <div className="relative w-full">
        {/* Gradient fade kiri & kanan */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none" />

        <div
          ref={scrollRef}
          className="overflow-x-hidden w-full cursor-grab active:cursor-grabbing"
          onMouseEnter={pauseMarquee}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={pauseMarquee}
          onTouchEnd={() => resumeMarqueeLater(2000)}
        >
          <div
            className={`marquee-track flex gap-4 sm:gap-6 py-4 select-none ${
              isPaused ? 'paused' : ''
            }`}
            style={{ animationDuration: `${animationDuration}s` }}
          >
            {extendedContent.map((item, idx) => {
              const realIndex = idx % content.length;
              const isVideo = item.tipe === 'video';

              return (
                <div
                  key={`${item.id}-${idx}`}
                  className="flex-shrink-0 h-[300px] sm:h-[450px] w-fit group cursor-pointer relative rounded-3xl overflow-hidden shadow-lg bg-card-bg"
                  onClick={() => {
                    // Hanya buka lightbox kalau bukan sedang drag
                    if (!dragState.current.isDown) {
                      setLightbox(realIndex);
                    }
                  }}
                >
                  {isVideo ? (
                    <>
                      <video
                        src={item.url}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className="h-full w-auto object-cover transition-transform duration-500 group-hover:scale-110 pointer-events-none"
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
                      draggable={false}
                      className="h-full w-auto object-cover transition-transform duration-500 group-hover:scale-110 pointer-events-none"
                    />
                  )}

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
      </div>

      {/* LIGHTBOX */}
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