import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { SiteContent } from '../../../types';
import { generateId } from '../../../useContent';

interface Props {
  draft: SiteContent;
  updateDraft: (updater: (prev: SiteContent) => SiteContent) => void;
}

export default function ProgramEditor({ draft, updateDraft }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const addProgram = () => {
    const id = generateId('p');
    updateDraft((prev) => ({
      ...prev,
      programs: [
        ...prev.programs,
        {
          id,
          icon: '✨',
          title: '',
          shortDesc: '',
          fullDesc: '',
          activities: [],
          info: { sasaran: '', jadwal: '', lokasi: '', target: '' },
        },
      ],
    }));
    setExpanded(id);
  };

  const updateProgram = (id: string, field: string, value: unknown) => {
    updateDraft((prev) => ({
      ...prev,
      programs: prev.programs.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      ),
    }));
  };

  const updateInfo = (id: string, field: string, value: string) => {
    updateDraft((prev) => ({
      ...prev,
      programs: prev.programs.map((p) =>
        p.id === id ? { ...p, info: { ...p.info, [field]: value } } : p
      ),
    }));
  };

  const updateActivity = (id: string, idx: number, value: string) => {
    updateDraft((prev) => ({
      ...prev,
      programs: prev.programs.map((p) =>
        p.id === id
          ? { ...p, activities: p.activities.map((a, i) => (i === idx ? value : a)) }
          : p
      ),
    }));
  };

  const addActivity = (id: string) => {
    updateDraft((prev) => ({
      ...prev,
      programs: prev.programs.map((p) =>
        p.id === id ? { ...p, activities: [...p.activities, ''] } : p
      ),
    }));
  };

  const removeActivity = (id: string, idx: number) => {
    updateDraft((prev) => ({
      ...prev,
      programs: prev.programs.map((p) =>
        p.id === id
          ? { ...p, activities: p.activities.filter((_, i) => i !== idx) }
          : p
      ),
    }));
  };

  const removeProgram = (id: string) => {
    updateDraft((prev) => ({
      ...prev,
      programs: prev.programs.filter((p) => p.id !== id),
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-dark-purple/60">Daftar program kerja</p>
        <button
          onClick={addProgram}
          className="flex items-center gap-1.5 text-sm text-primary-purple hover:text-primary-purple/80 font-medium"
        >
          <Plus size={16} /> Tambah Program
        </button>
      </div>

      {draft.programs.map((program) => (
        <div key={program.id} className="bg-card-bg rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 p-4">
            <input
              type="text"
              value={program.icon}
              onChange={(e) => updateProgram(program.id, 'icon', e.target.value)}
              className="w-14 text-center text-2xl bg-white rounded-lg px-2 py-2 border border-transparent focus:border-primary-purple focus:outline-none"
            />
            <input
              type="text"
              value={program.title}
              onChange={(e) => updateProgram(program.id, 'title', e.target.value)}
              placeholder="Judul program"
              className="flex-1 bg-white rounded-lg px-3 py-2 text-sm font-semibold text-dark-purple border border-transparent focus:border-primary-purple focus:outline-none"
            />
            <button
              onClick={() => setExpanded(expanded === program.id ? null : program.id)}
              className="text-dark-purple/60 hover:text-dark-purple p-1"
            >
              {expanded === program.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            <button
              onClick={() => removeProgram(program.id)}
              className="text-red-400 hover:text-red-500 p-1"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {expanded === program.id && (
            <div className="px-4 pb-4 space-y-4 border-t border-white/20 pt-4">
              <div>
                <label className="block text-xs font-semibold text-dark-purple/70 mb-1.5">Deskripsi Singkat</label>
                <input
                  type="text"
                  value={program.shortDesc}
                  onChange={(e) => updateProgram(program.id, 'shortDesc', e.target.value)}
                  className="w-full bg-white rounded-lg px-3 py-2 text-sm text-dark-purple border border-transparent focus:border-primary-purple focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-dark-purple/70 mb-1.5">Deskripsi Lengkap</label>
                <textarea
                  value={program.fullDesc}
                  onChange={(e) => updateProgram(program.id, 'fullDesc', e.target.value)}
                  rows={4}
                  className="w-full bg-white rounded-lg px-3 py-2 text-sm text-dark-purple border border-transparent focus:border-primary-purple focus:outline-none resize-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-dark-purple/70">Kegiatan Utama</label>
                  <button
                    onClick={() => addActivity(program.id)}
                    className="flex items-center gap-1 text-xs text-primary-purple font-medium"
                  >
                    <Plus size={14} /> Tambah
                  </button>
                </div>
                <div className="space-y-2">
                  {program.activities.map((activity, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs text-dark-purple/40 w-5">{idx + 1}.</span>
                      <input
                        type="text"
                        value={activity}
                        onChange={(e) => updateActivity(program.id, idx, e.target.value)}
                        className="flex-1 bg-white rounded-lg px-3 py-2 text-sm text-dark-purple border border-transparent focus:border-primary-purple focus:outline-none"
                      />
                      <button
                        onClick={() => removeActivity(program.id, idx)}
                        className="text-red-400 hover:text-red-500 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'sasaran', label: 'Sasaran' },
                  { key: 'jadwal', label: 'Jadwal' },
                  { key: 'lokasi', label: 'Lokasi' },
                  { key: 'target', label: 'Peserta/Target/Layanan' },
                ].map((info) => (
                  <div key={info.key}>
                    <label className="block text-xs font-semibold text-dark-purple/70 mb-1.5">{info.label}</label>
                    <input
                      type="text"
                      value={program.info[info.key as keyof typeof program.info]}
                      onChange={(e) => updateInfo(program.id, info.key, e.target.value)}
                      className="w-full bg-white rounded-lg px-3 py-2 text-sm text-dark-purple border border-transparent focus:border-primary-purple focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
