import { Plus, Trash2 } from 'lucide-react';
import type { SiteContent } from '../../../types';
import { generateId } from '../../../useContent';

interface Props {
  draft: SiteContent;
  updateDraft: (updater: (prev: SiteContent) => SiteContent) => void;
}

export default function HeroEditor({ draft, updateDraft }: Props) {
  const hero = draft.hero;

  const setField = (field: keyof typeof hero, value: string) => {
    updateDraft((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: value },
    }));
  };

  const addSlide = (isMobile = false) => {
    updateDraft((prev) => {
      const field = isMobile ? 'slides_mobile' : 'slides';
      const currentSlides = prev.hero[field] || [];
      return {
        ...prev,
        hero: {
          ...prev.hero,
          [field]: [...currentSlides, { id: generateId(isMobile ? 'm' : 's'), url: '' }],
        },
      };
    });
  };

  const updateSlide = (id: string, url: string, isMobile = false) => {
    updateDraft((prev) => {
      const field = isMobile ? 'slides_mobile' : 'slides';
      const currentSlides = prev.hero[field] || [];
      return {
        ...prev,
        hero: {
          ...prev.hero,
          [field]: currentSlides.map((s) => (s.id === id ? { ...s, url } : s)),
        },
      };
    });
  };

  const removeSlide = (id: string, isMobile = false) => {
    updateDraft((prev) => {
      const field = isMobile ? 'slides_mobile' : 'slides';
      const currentSlides = prev.hero[field] || [];
      return {
        ...prev,
        hero: {
          ...prev.hero,
          [field]: currentSlides.filter((s) => s.id !== id),
        },
      };
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-dark-purple mb-2">Judul</label>
        <input
          type="text"
          value={hero.title}
          onChange={(e) => setField('title', e.target.value)}
          className="w-full bg-card-bg rounded-xl px-4 py-3 text-dark-purple border-2 border-transparent focus:border-primary-purple focus:outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-dark-purple mb-2">Subjudul</label>
        <textarea
          value={hero.subtitle}
          onChange={(e) => setField('subtitle', e.target.value)}
          rows={2}
          className="w-full bg-card-bg rounded-xl px-4 py-3 text-dark-purple border-2 border-transparent focus:border-primary-purple focus:outline-none transition-all resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-dark-purple mb-2">Teks Tombol</label>
        <input
          type="text"
          value={hero.buttonText}
          onChange={(e) => setField('buttonText', e.target.value)}
          className="w-full bg-card-bg rounded-xl px-4 py-3 text-dark-purple border-2 border-transparent focus:border-primary-purple focus:outline-none transition-all"
        />
      </div>

      {/* AREA GRID 2 KOLOM UNTUK SLIDESHOW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 border-t border-dark-purple/10 pt-5 mt-5">
        
        {/* KOLOM KIRI: DESKTOP */}
        <div>
          <div className="flex flex-col mb-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-dark-purple">Gambar Slideshow (Desktop)</label>
              <button
                onClick={() => addSlide(false)}
                className="flex items-center gap-1.5 text-sm text-primary-purple hover:text-primary-purple/80 font-medium"
              >
                <Plus size={16} /> Tambah
              </button>
            </div>
            <span className="text-[11px] text-dark-purple/50">Tampil di layar komputer/laptop (Lanskap)</span>
          </div>
          
          <div className="space-y-3">
            {hero.slides.map((slide) => (
              <div key={slide.id} className="flex items-center gap-3 bg-card-bg rounded-xl p-2.5">
                {slide.url ? (
                  <img
                    src={slide.url}
                    alt=""
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0 bg-white"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg flex-shrink-0 bg-white border border-dashed border-dark-purple/20" />
                )}
                <input
                  type="text"
                  value={slide.url}
                  onChange={(e) => updateSlide(slide.id, e.target.value, false)}
                  placeholder="/images/hero.jpg"
                  className="flex-1 min-w-0 bg-white rounded-lg px-3 py-2 text-xs text-dark-purple border border-transparent focus:border-primary-purple focus:outline-none"
                />
                <button
                  onClick={() => removeSlide(slide.id, false)}
                  className="text-red-400 hover:text-red-500 p-1 flex-shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* KOLOM KANAN: MOBILE */}
        <div>
          <div className="flex flex-col mb-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-dark-purple">Gambar Slideshow (Mobile)</label>
              <button
                onClick={() => addSlide(true)}
                className="flex items-center gap-1.5 text-sm text-primary-purple hover:text-primary-purple/80 font-medium"
              >
                <Plus size={16} /> Tambah
              </button>
            </div>
            <span className="text-[11px] text-dark-purple/50">Tampil di layar HP (Potrait/Tegak)</span>
          </div>
          
          <div className="space-y-3">
            {(hero.slides_mobile || []).map((slide) => (
              <div key={slide.id} className="flex items-center gap-3 bg-card-bg rounded-xl p-2.5">
                {slide.url ? (
                  <img
                    src={slide.url}
                    alt=""
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0 bg-white"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg flex-shrink-0 bg-white border border-dashed border-dark-purple/20" />
                )}
                <input
                  type="text"
                  value={slide.url}
                  onChange={(e) => updateSlide(slide.id, e.target.value, true)}
                  placeholder="/images/hero-mobile.jpg"
                  className="flex-1 min-w-0 bg-white rounded-lg px-3 py-2 text-xs text-dark-purple border border-transparent focus:border-primary-purple focus:outline-none"
                />
                <button
                  onClick={() => removeSlide(slide.id, true)}
                  className="text-red-400 hover:text-red-500 p-1 flex-shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {(hero.slides_mobile || []).length === 0 && (
              <div className="text-[11px] text-dark-purple/50 italic bg-white/50 p-4 rounded-xl border border-dashed border-dark-purple/20 text-center">
                Belum ada gambar mobile.<br/>Website akan otomatis menggunakan gambar Desktop.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}