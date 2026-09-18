import { useState, useEffect, useRef } from 'react';
import type { SiteContent } from '../types';

interface HeroProps {
  content: SiteContent['hero'];
}

export default function Hero({ content }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (content.slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % content.slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [content.slides.length]);

  const scrollToStruktur = () => {
    const el = document.getElementById('struktur');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* KEYFRAMES ANIMASI KEN BURNS */}
      <style>{`
        @keyframes kenburns-in {
          0% { transform: scale(1); }
          100% { transform: scale(1.15); }
        }
        @keyframes kenburns-out {
          0% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
      `}</style>

      {content.slides.map((slide, idx) => {
        const isActive = idx === currentSlide;
        const isEven = idx % 2 === 0;
        
        return (
          <div
            key={slide.id}
            className="absolute inset-0 transition-opacity duration-[1500ms] ease-in-out"
            style={{
              backgroundImage: `url(${slide.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: isActive ? 1 : 0,
              // Animasi HANYA berjalan pada slide yang aktif
              animation: isActive
                ? `${isEven ? 'kenburns-in' : 'kenburns-out'} 6s ease-out forwards`
                : 'none',
            }}
          />
        );
      })}

      <div className="absolute inset-0 bg-gradient-to-b from-dark-purple/70 via-dark-purple/50 to-dark-purple/80" />

      <div className="relative z-10 text-center px-5 max-w-4xl mx-auto">
        <div className="animate-fade-in">
          <p className="text-primary-purple font-semibold tracking-widest text-sm sm:text-base mb-4 uppercase">
            Kuliah Kerja Nyata
          </p>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            {content.title}
          </h1>
          <p className="text-base sm:text-xl text-white/90 max-w-2xl mx-auto font-light mb-10 leading-relaxed">
            {content.subtitle}
          </p>
          
          <button
            onClick={scrollToStruktur}
            className="inline-flex items-center justify-center bg-primary-purple hover:bg-primary-purple/90 text-white font-semibold px-8 py-4 rounded-full text-base shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            {content.buttonText}
          </button>
        </div>
      </div>

      {content.slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {content.slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide
                  ? 'w-8 bg-primary-purple'
                  : 'w-2 bg-white/50'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}