import type { SiteContent } from '../../../types';

interface Props {
  draft: SiteContent;
  updateDraft: (updater: (prev: SiteContent) => SiteContent) => void;
}

export default function FooterEditor({ draft, updateDraft }: Props) {
  const update = (field: 'copyright' | 'madeWith', value: string) => {
    updateDraft((prev) => ({
      ...prev,
      footer: { ...prev.footer, [field]: value },
    }));
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-dark-purple mb-2">Teks Copyright</label>
        <input
          type="text"
          value={draft.footer.copyright}
          onChange={(e) => update('copyright', e.target.value)}
          className="w-full bg-card-bg rounded-xl px-4 py-3 text-dark-purple border-2 border-transparent focus:border-primary-purple focus:outline-none transition-all"
        />
        <p className="text-xs text-dark-purple/40 mt-2">
          Catatan: Teks copyright ini juga berfungsi sebagai pintu masuk admin (klik 8x).
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-dark-purple mb-2">Teks "Dibuat dengan"</label>
        <input
          type="text"
          value={draft.footer.madeWith}
          onChange={(e) => update('madeWith', e.target.value)}
          className="w-full bg-card-bg rounded-xl px-4 py-3 text-dark-purple border-2 border-transparent focus:border-primary-purple focus:outline-none transition-all"
        />
      </div>
    </div>
  );
}
