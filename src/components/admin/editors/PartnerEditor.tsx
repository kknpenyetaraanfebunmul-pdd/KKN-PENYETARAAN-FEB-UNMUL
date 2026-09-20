import { Plus, Trash2 } from 'lucide-react';
import type { SiteContent } from '../../../types';
import { generateId } from '../../../useContent';

interface Props {
  draft: SiteContent;
  updateDraft: (updater: (prev: SiteContent) => SiteContent) => void;
}

export default function PartnerEditor({ draft, updateDraft }: Props) {
  const updatePartner = (
    section: 'supportBy' | 'sponsorBy',
    id: string,
    field: 'nama' | 'logo_url',
    value: string
  ) => {
    updateDraft((prev) => ({
      ...prev,
      [section]: prev[section].map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      ),
    }));
  };

  const addPartner = (section: 'supportBy' | 'sponsorBy') => {
    updateDraft((prev) => ({
      ...prev,
      [section]: [
        ...prev[section],
        {
          id: generateId('pt'),
          grup: section === 'supportBy' ? 'support' : 'sponsor',
          nama: '',
          logo_url: '',
          urutan: prev[section].length + 1,
        },
      ],
    }));
  };

  const removePartner = (section: 'supportBy' | 'sponsorBy', id: string) => {
    updateDraft((prev) => ({
      ...prev,
      [section]: prev[section].filter((p) => p.id !== id),
    }));
  };

  const renderSection = (
    title: string,
    section: 'supportBy' | 'sponsorBy',
    items: SiteContent['supportBy']
  ) => (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-dark-purple">{title}</h3>
        <button
          onClick={() => addPartner(section)}
          className="flex items-center gap-1.5 text-sm text-primary-purple hover:text-primary-purple/80 font-medium"
        >
          <Plus size={16} /> Tambah
        </button>
      </div>
      <div className="space-y-3">
        {items.map((partner) => (
          <div
            key={partner.id}
            className="flex items-center gap-3 bg-card-bg rounded-xl p-3"
          >
            {/* Preview Logo */}
            <div className="w-14 h-14 rounded-lg bg-white flex items-center justify-center flex-shrink-0 border border-bubble-light overflow-hidden">
              {partner.logo_url ? (
                <img
                  src={partner.logo_url}
                  alt=""
                  className="w-full h-full object-contain p-1"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.opacity = '0.3';
                  }}
                />
              ) : (
                <span className="text-[10px] text-dark-purple/30 font-medium text-center leading-tight">
                  No<br />Logo
                </span>
              )}
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={partner.nama}
                onChange={(e) =>
                  updatePartner(section, partner.id, 'nama', e.target.value)
                }
                placeholder="Nama partner"
                className="bg-white rounded-lg px-3 py-2 text-sm text-dark-purple border border-transparent focus:border-primary-purple focus:outline-none"
              />
              <input
                type="text"
                value={partner.logo_url}
                onChange={(e) =>
                  updatePartner(section, partner.id, 'logo_url', e.target.value)
                }
                placeholder="URL logo (contoh: https://.../logo.png)"
                className="bg-white rounded-lg px-3 py-2 text-sm text-dark-purple border border-transparent focus:border-primary-purple focus:outline-none"
              />
            </div>
            <button
              onClick={() => removePartner(section, partner.id)}
              className="text-red-400 hover:text-red-500 p-1"
              title="Hapus"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {renderSection('Support By', 'supportBy', draft.supportBy)}
      <div className="border-t border-dark-purple/10" />
      {renderSection('Sponsor By', 'sponsorBy', draft.sponsorBy)}
    </div>
  );
}