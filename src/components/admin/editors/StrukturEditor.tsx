import { Plus, Trash2 } from 'lucide-react';
import type { SiteContent } from '../../../types';
import { generateId } from '../../../useContent';

interface Props {
  draft: SiteContent;
  updateDraft: (updater: (prev: SiteContent) => SiteContent) => void;
}

export default function StrukturEditor({ draft, updateDraft }: Props) {
  // Menambah jabatan baru
  const addRole = () => {
    updateDraft((prev) => ({
      ...prev,
      struktur: [
        ...prev.struktur,
        { id: generateId('st'), role: '', members: [''] }, // Mulai dengan 1 nama kosong
      ],
    }));
  };

  // Menghapus jabatan beserta anggotanya
  const removeRole = (id: string) => {
    updateDraft((prev) => ({
      ...prev,
      struktur: prev.struktur.filter((item) => item.id !== id),
    }));
  };

  // Mengubah nama jabatan
  const updateRole = (id: string, value: string) => {
    updateDraft((prev) => ({
      ...prev,
      struktur: prev.struktur.map((item) =>
        item.id === id ? { ...item, role: value } : item
      ),
    }));
  };

  // Menambah nama anggota di jabatan tertentu
  const addMember = (roleId: string) => {
    updateDraft((prev) => ({
      ...prev,
      struktur: prev.struktur.map((item) =>
        item.id === roleId ? { ...item, members: [...item.members, ''] } : item
      ),
    }));
  };

  // Mengubah nama anggota
  const updateMember = (roleId: string, index: number, value: string) => {
    updateDraft((prev) => ({
      ...prev,
      struktur: prev.struktur.map((item) => {
        if (item.id === roleId) {
          const newMembers = [...item.members];
          newMembers[index] = value;
          return { ...item, members: newMembers };
        }
        return item;
      }),
    }));
  };

  // Menghapus nama anggota
  const removeMember = (roleId: string, index: number) => {
    updateDraft((prev) => ({
      ...prev,
      struktur: prev.struktur.map((item) => {
        if (item.id === roleId) {
          const newMembers = item.members.filter((_, i) => i !== index);
          // Pastikan minimal ada 1 kolom kosong agar tidak error
          return { ...item, members: newMembers.length > 0 ? newMembers : [''] };
        }
        return item;
      }),
    }));
  };

  // Fungsi untuk mendeteksi tombol Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, roleId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Mencegah form ter-submit
      addMember(roleId);  // Tambah kolom baru
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-dark-purple/60">Daftar jabatan KKN</p>
        <button
          onClick={addRole}
          className="flex items-center gap-1.5 text-sm text-primary-purple hover:text-primary-purple/80 font-medium"
        >
          <Plus size={16} /> Tambah Jabatan
        </button>
      </div>

      {draft.struktur.map((item) => (
        <div key={item.id} className="flex items-start gap-3 bg-card-bg rounded-xl p-4 border border-bubble-light">
          
          {/* Kolom Kiri: Nama Jabatan */}
          <div className="w-1/3 flex items-start gap-2">
            <input
              type="text"
              value={item.role}
              onChange={(e) => updateRole(item.id, e.target.value)}
              placeholder="Nama jabatan (cth: Ketua)"
              className="w-full bg-white rounded-lg px-3 py-2 text-sm text-dark-purple border border-transparent focus:border-primary-purple focus:outline-none"
            />
            <button
              onClick={() => removeRole(item.id)}
              className="text-red-400 hover:text-red-500 p-1 mt-1"
              title="Hapus Jabatan"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* Kolom Kanan: Daftar Nama Anggota */}
          <div className="flex-1 space-y-2">
            {item.members.map((member, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={member}
                  onChange={(e) => updateMember(item.id, index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, item.id)}
                  placeholder={`Nama anggota ${index + 1}`}
                  className="w-full bg-white rounded-lg px-3 py-2 text-sm text-dark-purple border border-transparent focus:border-primary-purple focus:outline-none"
                />
                {item.members.length > 1 && (
                  <button
                    onClick={() => removeMember(item.id, index)}
                    className="text-red-400 hover:text-red-500 p-1"
                    title="Hapus Nama"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
            
            {/* Tombol Tambah Nama Manual */}
            <button
              onClick={() => addMember(item.id)}
              className="text-xs text-primary-purple hover:text-primary-purple/80 font-medium flex items-center gap-1 mt-1"
            >
              <Plus size={14} /> Tambah Nama
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}