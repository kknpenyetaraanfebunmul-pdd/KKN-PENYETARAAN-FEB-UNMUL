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
    field: 'name' | 'logo',
    value: string
  ) => {
    updateDraft((prev) => ({
      ...prev,
      [section]: prev[section].map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    }));
  };

  const addPartner = (section: 'supportBy' | 'sponsorBy') => {
    updateDraft((prev) => ({
      ...prev,
      [section]: [...prev[section], { id: generateId('pt'), name: '', logo: '' }],
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
          <div key={partner.id} className="flex items-center gap-3 bg-card-bg rounded-xl p-3">
            {partner.logo && (
              <img
                src={partner.logo}
                alt=""
                className="w-12 h-12 rounded-lg object-contain bg-white flex-shrink-0"
              />
            )}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={partner.name}
                onChange={(e) => updatePartner(section, partner.id, 'name', e.target.value)}
                placeholder="Nama partner"
                className="bg-white rounded-lg px-3 py-2 text-sm text-dark-purple border border-transparent focus:border-primary-purple focus:outline-none"
              />
              <input
                type="text"
                value={partner.logo}
                onChange={(e) => updatePartner(section, partner.id, 'logo', e.target.value)}
                placeholder="URL logo"
                className="bg-white rounded-lg px-3 py-2 text-sm text-dark-purple border border-transparent focus:border-primary-purple focus:outline-none"
              />
            </div>
            <button
              onClick={() => removePartner(section, partner.id)}
              className="text-red-400 hover:text-red-500 p-1"
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
