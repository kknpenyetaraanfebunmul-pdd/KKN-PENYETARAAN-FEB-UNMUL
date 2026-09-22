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
        {
          id: generateId('g'),
          tipe: 'photo',
          url: '',
          judul: '',
          deskripsi: '',
          urutan: prev.gallery.length + 1,
        },
      ],
    }));
  };

  const updateItem = (id: string, field: string, value: string) => {
    updateDraft((prev) => ({
      ...prev,
      gallery: prev.gallery.map((item) =>
        item.id === id ? ({ ...item, [field]: value } as typeof item) : item
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
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-bubble-light">
                {item.tipe === 'video' ? (
                  <video
                    src={item.url}
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={item.url}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.opacity = '0.3';
                    }}
                  />
                )}
              </div>
            )}
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <select
                  value={item.tipe}
                  onChange={(e) => updateItem(item.id, 'tipe', e.target.value)}
                  className="bg-white rounded-lg px-3 py-2 text-sm text-dark-purple border border-transparent focus:border-primary-purple focus:outline-none"
                >
                  <option value="photo">Foto</option>
                  <option value="video">Video</option>
                </select>
                <input
                  type="text"
                  value={item.url}
                  onChange={(e) => updateItem(item.id, 'url', e.target.value)}
                  placeholder="URL gambar/video (https://...)"
                  className="flex-1 bg-white rounded-lg px-3 py-2 text-sm text-dark-purple border border-transparent focus:border-primary-purple focus:outline-none"
                />
              </div>
              <input
                type="text"
                value={item.judul}
                onChange={(e) => updateItem(item.id, 'judul', e.target.value)}
                placeholder="Judul (cth: Bimbingan Belajar)"
                className="w-full bg-white rounded-lg px-3 py-2 text-sm text-dark-purple border border-transparent focus:border-primary-purple focus:outline-none"
              />
              <input
                type="text"
                value={item.deskripsi}
                onChange={(e) => updateItem(item.id, 'deskripsi', e.target.value)}
                placeholder="Deskripsi singkat"
                className="w-full bg-white rounded-lg px-3 py-2 text-sm text-dark-purple border border-transparent focus:border-primary-purple focus:outline-none"
              />
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="text-red-400 hover:text-red-500 p-1"
              title="Hapus"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}