import { useEffect } from 'react';

export default function InstagramFeed() {
  useEffect(() => {
    // 1. Load script Elfsight secara dinamis
    const script = document.createElement('script');
    script.src = 'https://static.elfsight.com/platform/platform.js'; 
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script saat komponen di-unmount (opsional tapi disarankan)
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section id="instagram" className="py-20 sm:py-24 px-5 sm:px-8 bg-white dark:bg-dark-bg transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-primary-purple font-semibold text-sm tracking-widest uppercase mb-3">
            Media Sosial
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-dark-purple dark:text-dark-text mb-4 transition-colors">
            Instagram Feed
          </h2>
          <div className="w-20 h-1.5 bg-primary-purple rounded-full mx-auto" />
        </div>

        {/* CONTAINER ELFSIGHT */}
        <div 
          className="elfsight-app-ID_WIDGET_ANDA" // GANTI DENGAN ID WIDGET DARI ELFSIGHT
          data-elfsight-app-lazy
        ></div>
      </div>
    </section>
  );
}