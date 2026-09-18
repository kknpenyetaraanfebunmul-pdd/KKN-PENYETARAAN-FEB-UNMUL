import type { SiteContent } from '../../../types';

interface Props {
  draft: SiteContent;
  updateDraft: (updater: (prev: SiteContent) => SiteContent) => void;
}

export default function ContactEditor({ draft, updateDraft }: Props) {
  const updateContact = (id: string, field: 'platform' | 'value' | 'url', value: string) => {
    updateDraft((prev) => ({
      ...prev,
      contacts: prev.contacts.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    }));
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-dark-purple/60 mb-2">Kartu kontak</p>
      {draft.contacts.map((contact) => (
        <div key={contact.id} className="bg-card-bg rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-dark-purple/70 mb-1.5">Platform</label>
              <input
                type="text"
                value={contact.platform}
                onChange={(e) => updateContact(contact.id, 'platform', e.target.value)}
                className="w-full bg-white rounded-lg px-3 py-2 text-sm text-dark-purple border border-transparent focus:border-primary-purple focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-dark-purple/70 mb-1.5">Value</label>
              <input
                type="text"
                value={contact.value}
                onChange={(e) => updateContact(contact.id, 'value', e.target.value)}
                className="w-full bg-white rounded-lg px-3 py-2 text-sm text-dark-purple border border-transparent focus:border-primary-purple focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-dark-purple/70 mb-1.5">URL</label>
              <input
                type="text"
                value={contact.url}
                onChange={(e) => updateContact(contact.id, 'url', e.target.value)}
                className="w-full bg-white rounded-lg px-3 py-2 text-sm text-dark-purple border border-transparent focus:border-primary-purple focus:outline-none"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
