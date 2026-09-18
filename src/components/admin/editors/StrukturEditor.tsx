import { Plus, Trash2 } from 'lucide-react';
import type { SiteContent } from '../../../types';
import { generateId } from '../../../useContent';

interface Props {
  draft: SiteContent;
  updateDraft: (updater: (prev: SiteContent) => SiteContent) => void;
}

export default function StrukturEditor({ draft, updateDraft }: Props) {
  const addItem = () => {
    updateDraft((prev) => ({
      ...prev,
      struktur: [
        ...prev.struktur,
        { id: generateId('st'), role: '', description: '' },
      ],
    }));
  };

  const updateItem = (id: string, field: 'role' | 'description', value: string) => {
    updateDraft((prev) => ({
      ...prev,
      struktur: prev.struktur.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeItem = (id: string) => {
    updateDraft((prev) => ({
      ...prev,
      struktur: prev.struktur.filter((item) => item.id !== id),
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-dark-purple/60">Daftar jabatan KKN</p>
        <button
          onClick={addItem}
          className="flex items-center gap-1.5 text-sm text-primary-purple hover:text-primary-purple/80 font-medium"
        >
          <Plus size={16} /> Tambah Jabatan
        </button>
      </div>
      {draft.struktur.map((item) => (
        <div key={item.id} className="flex items-start gap-3 bg-card-bg rounded-xl p-4">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={item.role}
              onChange={(e) => updateItem(item.id, 'role', e.target.value)}
              placeholder="Nama jabatan"
              className="bg-white rounded-lg px-3 py-2 text-sm text-dark-purple border border-transparent focus:border-primary-purple focus:outline-none"
            />
            <input
              type="text"
              value={item.description}
              onChange={(e) => updateItem(item.id, 'description', e.target.value)}
              placeholder="Deskripsi singkat"
              className="bg-white rounded-lg px-3 py-2 text-sm text-dark-purple border border-transparent focus:border-primary-purple focus:outline-none"
            />
          </div>
          <button
            onClick={() => removeItem(item.id)}
            className="text-red-400 hover:text-red-500 p-1 mt-1"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}
