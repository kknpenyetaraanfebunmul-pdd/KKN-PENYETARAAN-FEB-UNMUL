import { Plus, Trash2 } from 'lucide-react';
import type { SiteContent } from '../../../types';
import { generateId } from '../../../useContent';

interface Props {
  draft: SiteContent;
  updateDraft: (updater: (prev: SiteContent) => SiteContent) => void;
}

export default function GalleryEditor({ draft, updateDraft }: Props) {
  const addItem = () => {
    updateDraft((prev) => ({
      ...prev,
      gallery: [
        ...prev.gallery,
        { id: generateId('g'), type: 'photo', url: '', title: '', caption: '' },
      ],
    }));
  };

  const updateItem = (id: string, field: string, value: string) => {
    updateDraft((prev) => ({
      ...prev,
      gallery: prev.gallery.map((item) =>
        item.id === id ? { ...item, [field]: value } as typeof item : item
      ),
    }));
  };

  const removeItem = (id: string) => {
    updateDraft((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((item) => item.id !== id),
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-dark-purple/60">Item gallery</p>
        <button
          onClick={addItem}
          className="flex items-center gap-1.5 text-sm text-primary-purple hover:text-primary-purple/80 font-medium"
        >
          <Plus size={16} /> Tambah Item
        </button>
      </div>

      {draft.gallery.map((item) => (
        <div key={item.id} className="bg-card-bg rounded-xl p-4 space-y-3">
          <div className="flex items-start gap-3">
            {item.url && (
              <img
                src={item.url}
                alt=""
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <select
                  value={item.type}
                  onChange={(e) => updateItem(item.id, 'type', e.target.value)}
                  className="bg-white rounded-lg px-3 py-2 text-sm text-dark-purple border border-transparent focus:border-primary-purple focus:outline-none"
                >
                  <option value="photo">Foto</option>
                  <option value="video">Video</option>
                </select>
                <input
                  type="text"
                  value={item.url}
                  onChange={(e) => updateItem(item.id, 'url', e.target.value)}
                  placeholder="URL gambar/video"
                  className="flex-1 bg-white rounded-lg px-3 py-2 text-sm text-dark-purple border border-transparent focus:border-primary-purple focus:outline-none"
                />
              </div>
              <input
                type="text"
                value={item.title}
                onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                placeholder="Judul"
                className="w-full bg-white rounded-lg px-3 py-2 text-sm text-dark-purple border border-transparent focus:border-primary-purple focus:outline-none"
              />
              <input
                type="text"
                value={item.caption}
                onChange={(e) => updateItem(item.id, 'caption', e.target.value)}
                placeholder="Caption / deskripsi singkat"
                className="w-full bg-white rounded-lg px-3 py-2 text-sm text-dark-purple border border-transparent focus:border-primary-purple focus:outline-none"
              />
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="text-red-400 hover:text-red-500 p-1"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
