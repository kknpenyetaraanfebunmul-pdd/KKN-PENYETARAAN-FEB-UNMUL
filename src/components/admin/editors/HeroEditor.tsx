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

  const addSlide = () => {
    updateDraft((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        slides: [...prev.hero.slides, { id: generateId('s'), url: '' }],
      },
    }));
  };

  const updateSlide = (id: string, url: string) => {
    updateDraft((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        slides: prev.hero.slides.map((s) => (s.id === id ? { ...s, url } : s)),
      },
    }));
  };

  const removeSlide = (id: string) => {
    updateDraft((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        slides: prev.hero.slides.filter((s) => s.id !== id),
      },
    }));
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

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-dark-purple">Gambar Slideshow</label>
          <button
            onClick={addSlide}
            className="flex items-center gap-1.5 text-sm text-primary-purple hover:text-primary-purple/80 font-medium"
          >
            <Plus size={16} /> Tambah
          </button>
        </div>
        <div className="space-y-3">
          {hero.slides.map((slide) => (
            <div key={slide.id} className="flex items-center gap-3 bg-card-bg rounded-xl p-3">
              {slide.url && (
                <img
                  src={slide.url}
                  alt=""
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
              )}
              <input
                type="text"
                value={slide.url}
                onChange={(e) => updateSlide(slide.id, e.target.value)}
                placeholder="URL gambar"
                className="flex-1 bg-white rounded-lg px-3 py-2 text-sm text-dark-purple border border-transparent focus:border-primary-purple focus:outline-none"
              />
              <button
                onClick={() => removeSlide(slide.id)}
                className="text-red-400 hover:text-red-500 p-1"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


