import { Plus, Trash2 } from 'lucide-react';
import type { SiteContent, StrukturMember } from '../../../types';
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
        {
          id: generateId('st'),
          jabatan: '',
          members: [{ name: '', nim: '', photo: '' }],
          urutan: prev.struktur.length + 1,
        },
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
        item.id === id ? { ...item, jabatan: value } : item
      ),
    }));
  };

  // Menambah anggota di jabatan tertentu
  const addMember = (roleId: string) => {
    updateDraft((prev) => ({
      ...prev,
      struktur: prev.struktur.map((item) =>
        item.id === roleId
          ? {
              ...item,
              members: [...item.members, { name: '', nim: '', photo: '' }],
            }
          : item
      ),
    }));
  };

  // Mengubah field anggota (name, nim, atau photo)
  const updateMember = (
    roleId: string,
    index: number,
    field: keyof StrukturMember,
    value: string
  ) => {
    updateDraft((prev) => ({
      ...prev,
      struktur: prev.struktur.map((item) => {
        if (item.id === roleId) {
          const newMembers = [...item.members];
          newMembers[index] = { ...newMembers[index], [field]: value };
          return { ...item, members: newMembers };
        }
        return item;
      }),
    }));
  };

  // Menghapus anggota
  const removeMember = (roleId: string, index: number) => {
    updateDraft((prev) => ({
      ...prev,
      struktur: prev.struktur.map((item) => {
        if (item.id === roleId) {
          const newMembers = item.members.filter((_, i) => i !== index);
          return {
            ...item,
            members:
              newMembers.length > 0
                ? newMembers
                : [{ name: '', nim: '', photo: '' }],
          };
        }
        return item;
      }),
    }));
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
        <div
          key={item.id}
          className="bg-card-bg rounded-xl p-4 border border-bubble-light space-y-4"
        >
          {/* Bagian Atas: Nama Jabatan */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={item.jabatan || ''}
              onChange={(e) => updateRole(item.id, e.target.value)}
              placeholder="Nama jabatan (cth: Ketua)"
              className="flex-1 bg-white rounded-lg px-3 py-2 text-sm font-semibold text-dark-purple border border-transparent focus:border-primary-purple focus:outline-none"
            />
            <button
              onClick={() => removeRole(item.id)}
              className="text-red-400 hover:text-red-500 p-1"
              title="Hapus Jabatan"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* Bagian Bawah: Daftar Anggota */}
          <div className="space-y-3 pl-2 border-l-2 border-primary-purple/20">
            {item.members.map((member, index) => (
              <div
                key={index}
                className="bg-white/50 rounded-lg p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-dark-purple/50">
                    Anggota {index + 1}
                  </span>
                  {item.members.length > 1 && (
                    <button
                      onClick={() => removeMember(item.id, index)}
                      className="text-red-400 hover:text-red-500 p-0.5"
                      title="Hapus Anggota"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  value={member.name || ''}
                  onChange={(e) =>
                    updateMember(item.id, index, 'name', e.target.value)
                  }
                  placeholder="Nama lengkap"
                  className="w-full bg-white rounded-lg px-3 py-2 text-sm text-dark-purple border border-transparent focus:border-primary-purple focus:outline-none"
                />
                <input
                  type="text"
                  value={member.nim || ''}
                  onChange={(e) =>
                    updateMember(item.id, index, 'nim', e.target.value)
                  }
                  placeholder="NIM (cth: H071231001)"
                  className="w-full bg-white rounded-lg px-3 py-2 text-sm text-dark-purple border border-transparent focus:border-primary-purple focus:outline-none"
                />
                <input
                  type="text"
                  value={member.photo || ''}
                  onChange={(e) =>
                    updateMember(item.id, index, 'photo', e.target.value)
                  }
                  placeholder="URL Foto (opsional)"
                  className="w-full bg-white rounded-lg px-3 py-2 text-sm text-dark-purple border border-transparent focus:border-primary-purple focus:outline-none"
                />
              </div>
            ))}

            <button
              onClick={() => addMember(item.id)}
              className="text-xs text-primary-purple hover:text-primary-purple/80 font-medium flex items-center gap-1"
            >
              <Plus size={14} /> Tambah Anggota
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}