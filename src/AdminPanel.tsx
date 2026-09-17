import { useState } from 'react';
import type { SiteData, StrukturItem, ProgramItem, GalleryItem, PartnerItem } from './types';

interface AdminPanelProps {
  data: SiteData;
  onSave: (data: SiteData) => Promise<void>;
  onReset: () => void;
}

type PanelTab = 'hero' | 'struktur' | 'program' | 'gallery' | 'contact' | 'partners';

const ADMIN_PASSCODE = '110106';

const SIDEBAR_ITEMS: { key: PanelTab; icon: string; label: string }[] = [
  { key: 'hero', icon: '\u{1F3E8}', label: 'Hero' },
  { key: 'struktur', icon: '\u{1F465}', label: 'Struktur' },
  { key: 'program', icon: '\u{1F4CB}', label: 'Program' },
  { key: 'gallery', icon: '\u{1F5BC}', label: 'Gallery' },
  { key: 'contact', icon: '\u{2709}', label: 'Contact' },
  { key: 'partners', icon: '\u{1F91D}', label: 'Partners' },
];

function genId(): string {
  return 'id_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
}

function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  const bg = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  return (
    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 ${bg} text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg z-[10002] flex items-center gap-2 animate-[fadeInUp_0.3s_ease]`}>
      {type === 'success' ? '\u2714' : '\u26A0'} {message}
    </div>
  );
}

function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-[rgba(20,12,30,0.6)] backdrop-blur-sm z-[10003] flex items-center justify-center p-5" onClick={onCancel}>
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4 text-2xl">{'\u26A0'}</div>
        <h4 className="text-lg font-bold text-[#2b1c3d] mb-2">{title}</h4>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm hover:bg-gray-200 transition">Batal</button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition">Hapus</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-bold uppercase tracking-wider text-[#7b5ea7] mb-2">{label}</label>
      {children}
    </div>
  );
}

const inputClass = 'w-full px-4 py-3 rounded-xl border-2 border-[#e0d9e8] text-sm text-[#2b1c3d] outline-none transition focus:border-[#7b5ea7] focus:shadow-[0_0_0_4px_rgba(123,94,167,0.1)]';
const textareaClass = inputClass + ' resize-vertical min-h-[80px] leading-relaxed';

function ItemCard({ index, title, onRemove, children }: { index: number; title: string; onRemove: () => void; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-5 mb-4 border border-[#eeebf3]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 font-bold text-sm text-[#2b1c3d]">
          <span className="w-7 h-7 rounded-full bg-[#ece6f5] text-[#7b5ea7] text-xs font-bold flex items-center justify-center">{index + 1}</span>
          {title}
        </div>
        <button onClick={onRemove} className="px-4 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-semibold hover:bg-red-100 transition">{'\u{1F5D1}'} Hapus</button>
      </div>
      {children}
    </div>
  );
}

function SaveBar({ onSave, children }: { onSave: () => void; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap justify-end gap-3 mt-6 pt-5 border-t border-[#eeebf3]">
      {children}
      <button onClick={onSave} className="px-6 py-3 rounded-xl bg-gradient-to-br from-[#7b5ea7] to-[#2b1c3d] text-white font-semibold text-sm shadow-md hover:-translate-y-0.5 hover:shadow-lg transition flex items-center gap-2">
        {'\u{1F4BE}'} Simpan
      </button>
    </div>
  );
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} className="w-full py-4 rounded-xl border-2 border-dashed border-[#7b5ea7] bg-[rgba(123,94,167,0.05)] text-[#7b5ea7] font-semibold text-sm hover:bg-[rgba(123,94,167,0.12)] hover:border-[#2b1c3d] transition flex items-center justify-center gap-2 mb-5">
      + {label}
    </button>
  );
}

export default function AdminPanel({ data, onSave, onReset }: AdminPanelProps) {
  const [activePanel, setActivePanel] = useState<PanelTab>('hero');
  const [draft, setDraft] = useState<SiteData>(() => JSON.parse(JSON.stringify(data)));
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [confirm, setConfirm] = useState<{ title: string; msg: string; action: () => void } | null>(null);
  const [saving, setSaving] = useState(false);

  function showToast(msg: string, type: 'success' | 'error' = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await onSave(draft);
      showToast('Semua data berhasil disimpan!');
    } catch {
      showToast('Gagal menyimpan', 'error');
    } finally {
      setSaving(false);
    }
  }

  // --- Hero ---
  function updateHero(field: keyof typeof draft.hero, value: string | string[]) {
    setDraft({ ...draft, hero: { ...draft.hero, [field]: value } });
  }

  // --- Struktur ---
  function updateStruktur(i: number, field: keyof StrukturItem, value: string) {
    const next = [...draft.struktur];
    next[i] = { ...next[i], [field]: value };
    setDraft({ ...draft, struktur: next });
  }
  function addStruktur() {
    setDraft({ ...draft, struktur: [...draft.struktur, { id: genId(), jabatan: 'Jabatan Baru', deskripsi: 'Deskripsi' }] });
  }
  function removeStruktur(i: number) {
    setConfirm({ title: 'Hapus Struktur', msg: 'Apakah Anda yakin ingin menghapus struktur ini?', action: () => { setDraft({ ...draft, struktur: draft.struktur.filter((_, idx) => idx !== i) }); setConfirm(null); } });
  }

  // --- Program ---
  function updateProgram(i: number, field: keyof ProgramItem, value: string) {
    const next = [...draft.program];
    next[i] = { ...next[i], [field]: value };
    setDraft({ ...draft, program: next });
  }
  function addProgram() {
    setDraft({ ...draft, program: [...draft.program, { id: genId(), icon: '\u{1F4CB}', title: 'Program Baru', shortDesc: 'Deskripsi singkat', category: 'Bidang Baru', subtitle: 'Subtitle', description: 'Deskripsi panjang.', activities: 'Kegiatan 1\nKegiatan 2', info: 'Label|Value\nLabel2|Value2' }] });
  }
  function removeProgram(i: number) {
    setConfirm({ title: 'Hapus Program', msg: 'Apakah Anda yakin ingin menghapus program ini?', action: () => { setDraft({ ...draft, program: draft.program.filter((_, idx) => idx !== i) }); setConfirm(null); } });
  }

  // --- Gallery ---
  function updateGallery(i: number, field: keyof GalleryItem, value: string) {
    const next = [...draft.gallery];
    next[i] = { ...next[i], [field]: value } as GalleryItem;
    setDraft({ ...draft, gallery: next });
  }
  function addGallery() {
    setDraft({ ...draft, gallery: [...draft.gallery, { id: genId(), type: 'img', src: '', title: 'Media Baru', desc: 'Deskripsi' }] });
  }
  function removeGallery(i: number) {
    setConfirm({ title: 'Hapus Media', msg: 'Apakah Anda yakin ingin menghapus media ini?', action: () => { setDraft({ ...draft, gallery: draft.gallery.filter((_, idx) => idx !== i) }); setConfirm(null); } });
  }

  // --- Contact ---
  function updateContact(field: keyof typeof draft.contact, value: string) {
    setDraft({ ...draft, contact: { ...draft.contact, [field]: value } });
  }

  // --- Partners ---
  function updatePartner(type: 'support' | 'sponsor', i: number, field: keyof PartnerItem, value: string) {
    const next = { ...draft.partners };
    next[type] = [...next[type]];
    next[type][i] = { ...next[type][i], [field]: value };
    setDraft({ ...draft, partners: next });
  }
  function addPartner(type: 'support' | 'sponsor') {
    const next = { ...draft.partners };
    next[type] = [...next[type], { id: genId(), name: 'Partner Baru', logo: '' }];
    setDraft({ ...draft, partners: next });
  }
  function removePartner(type: 'support' | 'sponsor', i: number) {
    setConfirm({ title: `Hapus ${type === 'support' ? 'Support' : 'Sponsor'}`, msg: 'Apakah Anda yakin ingin menghapus partner ini?', action: () => { const next = { ...draft.partners }; next[type] = next[type].filter((_, idx) => idx !== i); setDraft({ ...draft, partners: next }); setConfirm(null); } });
  }

  function handleReset() {
    setConfirm({ title: 'Reset Semua Data', msg: 'PERINGATAN: Semua data akan dikembalikan ke pengaturan awal. Tindakan ini tidak dapat dibatalkan. Lanjutkan?', action: () => { onReset(); setConfirm(null); showToast('Semua data telah direset!'); } });
  }

  return (
    <div className="fixed inset-0 z-[10001] bg-[#f0eef4] flex flex-col font-[Poppins,sans-serif]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-white shadow-sm shrink-0 z-10">
        <div className="flex items-center gap-4">
          <div className="text-xl font-extrabold bg-gradient-to-r from-[#2b1c3d] to-[#7b5ea7] bg-clip-text text-transparent tracking-wide">KKN. Admin</div>
          <div className="w-px h-6 bg-[#e0d9e8] hidden sm:block" />
          <div className="text-sm font-semibold text-gray-400 uppercase tracking-wide hidden sm:block">Control Panel</div>
        </div>
        <div className="flex gap-2.5">
          {/* SAVE ALL BUTTON */}
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-gradient-to-br from-[#7b5ea7] to-[#2b1c3d] text-white text-xs font-bold shadow-md hover:-translate-y-0.5 hover:shadow-lg transition flex items-center gap-1.5 disabled:opacity-60"
          >
            {saving ? (
              <><span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" /> <span className="hidden sm:inline">Menyimpan...</span></>
            ) : (
              <>{'\u{1F4BE}'} Save All</>
            )}
          </button>
          <button onClick={() => setDraft(JSON.parse(JSON.stringify(data)))} className="px-4 py-2 rounded-xl bg-[#ece6f5] text-[#2b1c3d] text-xs font-semibold hover:bg-[#ded0f0] transition flex items-center gap-1.5">
            {'\u{1F504}'} <span className="hidden sm:inline">Reload</span>
          </button>
          <button onClick={onReset} className="px-4 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-semibold hover:bg-red-100 transition flex items-center gap-1.5">
            {'\u{1F6AA}'} <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-[220px] shrink-0 bg-white border-r border-[#e8e2f0] p-3 overflow-y-auto flex flex-col gap-1 max-[600px]:w-full max-[600px]:flex-row max-[600px]:overflow-x-auto max-[600px]:border-b max-[600px]:border-r-0">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setActivePanel(item.key)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition text-left shrink-0 ${activePanel === item.key ? 'bg-gradient-to-br from-[#7b5ea7] to-[#2b1c3d] text-white shadow-md' : 'text-gray-500 hover:bg-[#ece6f5] hover:text-[#2b1c3d]'}`}
            >
              <span className="text-lg">{item.icon}</span> {item.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 max-[600px]:p-4">
          <div className="max-w-[800px] mx-auto">
            {saving && (
              <div className="fixed top-16 right-6 bg-[#7b5ea7] text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg flex items-center gap-2 z-[10005]">
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Menyimpan...
              </div>
            )}

            {/* HERO PANEL */}
            {activePanel === 'hero' && (
              <div className="animate-[fadeIn_0.3s_ease]">
                <h3 className="text-xl font-extrabold text-[#2b1c3d] mb-6 uppercase tracking-wide flex items-center gap-2">{'\u{1F3E8}'} Hero</h3>
                <Field label="Judul Baris 1"><input className={inputClass} value={draft.hero.line1} onChange={(e) => updateHero('line1', e.target.value)} /></Field>
                <Field label="Judul Baris 2"><input className={inputClass} value={draft.hero.line2} onChange={(e) => updateHero('line2', e.target.value)} /></Field>
                <Field label="Deskripsi"><textarea className={textareaClass} value={draft.hero.description} onChange={(e) => updateHero('description', e.target.value)} /></Field>
                <Field label="Background Slideshow (satu URL per baris)">
                  <textarea className={textareaClass} value={draft.hero.slideshow.join('\n')} onChange={(e) => updateHero('slideshow', e.target.value.split('\n').filter((l) => l.trim()))} />
                </Field>
                <SaveBar onSave={handleSave} />
              </div>
            )}

            {/* STRUKTUR PANEL */}
            {activePanel === 'struktur' && (
              <div className="animate-[fadeIn_0.3s_ease]">
                <h3 className="text-xl font-extrabold text-[#2b1c3d] mb-6 uppercase tracking-wide flex items-center gap-2">{'\u{1F465}'} Struktur</h3>
                {draft.struktur.map((item, i) => (
                  <ItemCard key={item.id} index={i} title={`Struktur ${i + 1}`} onRemove={() => removeStruktur(i)}>
                    <div className="flex gap-4 max-[600px]:flex-col">
                      <Field label="Jabatan"><input className={inputClass} value={item.jabatan} onChange={(e) => updateStruktur(i, 'jabatan', e.target.value)} /></Field>
                      <Field label="Deskripsi"><input className={inputClass} value={item.deskripsi} onChange={(e) => updateStruktur(i, 'deskripsi', e.target.value)} /></Field>
                    </div>
                  </ItemCard>
                ))}
                <AddButton onClick={addStruktur} label="Tambah Struktur" />
                <SaveBar onSave={handleSave} />
              </div>
            )}

            {/* PROGRAM PANEL */}
            {activePanel === 'program' && (
              <div className="animate-[fadeIn_0.3s_ease]">
                <h3 className="text-xl font-extrabold text-[#2b1c3d] mb-6 uppercase tracking-wide flex items-center gap-2">{'\u{1F4CB}'} Program</h3>
                {draft.program.map((p, i) => (
                  <ItemCard key={p.id} index={i} title={p.title} onRemove={() => removeProgram(i)}>
                    <div className="flex gap-4 max-[600px]:flex-col">
                      <Field label="Icon (Emoji)"><input className={inputClass} value={p.icon} onChange={(e) => updateProgram(i, 'icon', e.target.value)} /></Field>
                      <Field label="Judul"><input className={inputClass} value={p.title} onChange={(e) => updateProgram(i, 'title', e.target.value)} /></Field>
                    </div>
                    <Field label="Deskripsi Singkat"><input className={inputClass} value={p.shortDesc} onChange={(e) => updateProgram(i, 'shortDesc', e.target.value)} /></Field>
                    <Field label="Kategori"><input className={inputClass} value={p.category} onChange={(e) => updateProgram(i, 'category', e.target.value)} /></Field>
                    <Field label="Subtitle"><input className={inputClass} value={p.subtitle} onChange={(e) => updateProgram(i, 'subtitle', e.target.value)} /></Field>
                    <Field label="Deskripsi Panjang"><textarea className={textareaClass} value={p.description} onChange={(e) => updateProgram(i, 'description', e.target.value)} /></Field>
                    <Field label="Kegiatan (satu per baris)"><textarea className={textareaClass + ' min-h-[120px]'} value={p.activities} onChange={(e) => updateProgram(i, 'activities', e.target.value)} /></Field>
                    <Field label="Info (format: Label|Value, satu per baris)"><textarea className={textareaClass + ' min-h-[100px]'} value={p.info} onChange={(e) => updateProgram(i, 'info', e.target.value)} /></Field>
                  </ItemCard>
                ))}
                <AddButton onClick={addProgram} label="Tambah Program" />
                <SaveBar onSave={handleSave} />
              </div>
            )}

            {/* GALLERY PANEL */}
            {activePanel === 'gallery' && (
              <div className="animate-[fadeIn_0.3s_ease]">
                <h3 className="text-xl font-extrabold text-[#2b1c3d] mb-6 uppercase tracking-wide flex items-center gap-2">{'\u{1F5BC}'} Gallery</h3>
                {draft.gallery.map((item, i) => (
                  <ItemCard key={item.id} index={i} title={item.title} onRemove={() => removeGallery(i)}>
                    <div className="flex gap-4 max-[600px]:flex-col">
                      <Field label="Tipe">
                        <select className={inputClass + ' cursor-pointer appearance-none bg-white'} value={item.type} onChange={(e) => updateGallery(i, 'type', e.target.value)}>
                          <option value="img">Foto (img)</option>
                          <option value="video">Video (mp4)</option>
                        </select>
                      </Field>
                      <Field label="Judul"><input className={inputClass} value={item.title} onChange={(e) => updateGallery(i, 'title', e.target.value)} /></Field>
                    </div>
                    <Field label="URL Sumber"><input className={inputClass} value={item.src} onChange={(e) => updateGallery(i, 'src', e.target.value)} /></Field>
                    <Field label="Deskripsi"><input className={inputClass} value={item.desc} onChange={(e) => updateGallery(i, 'desc', e.target.value)} /></Field>
                  </ItemCard>
                ))}
                <AddButton onClick={addGallery} label="Tambah Media" />
                <SaveBar onSave={handleSave} />
              </div>
            )}

            {/* CONTACT PANEL */}
            {activePanel === 'contact' && (
              <div className="animate-[fadeIn_0.3s_ease]">
                <h3 className="text-xl font-extrabold text-[#2b1c3d] mb-6 uppercase tracking-wide flex items-center gap-2">{'\u{2709}'} Contact</h3>
                <div className="text-sm font-bold uppercase tracking-wider text-[#2b1c3d] mb-4 pb-2 border-b-2 border-[#ece6f5]">Instagram</div>
                <div className="flex gap-4 max-[600px]:flex-col">
                  <Field label="Username"><input className={inputClass} value={draft.contact.instagramUsername} onChange={(e) => updateContact('instagramUsername', e.target.value)} /></Field>
                  <Field label="URL"><input className={inputClass} value={draft.contact.instagramUrl} onChange={(e) => updateContact('instagramUrl', e.target.value)} /></Field>
                </div>
                <div className="text-sm font-bold uppercase tracking-wider text-[#2b1c3d] mb-4 pb-2 border-b-2 border-[#ece6f5] mt-7">TikTok</div>
                <div className="flex gap-4 max-[600px]:flex-col">
                  <Field label="Username"><input className={inputClass} value={draft.contact.tiktokUsername} onChange={(e) => updateContact('tiktokUsername', e.target.value)} /></Field>
                  <Field label="URL"><input className={inputClass} value={draft.contact.tiktokUrl} onChange={(e) => updateContact('tiktokUrl', e.target.value)} /></Field>
                </div>
                <div className="text-sm font-bold uppercase tracking-wider text-[#2b1c3d] mb-4 pb-2 border-b-2 border-[#ece6f5] mt-7">Email</div>
                <Field label="Email"><input className={inputClass} value={draft.contact.email} onChange={(e) => updateContact('email', e.target.value)} /></Field>
                <SaveBar onSave={handleSave} />
              </div>
            )}

            {/* PARTNERS PANEL */}
            {activePanel === 'partners' && (
              <div className="animate-[fadeIn_0.3s_ease]">
                <h3 className="text-xl font-extrabold text-[#2b1c3d] mb-6 uppercase tracking-wide flex items-center gap-2">{'\u{1F91D}'} Partners</h3>
                <div className="text-sm font-bold uppercase tracking-wider text-[#2b1c3d] mb-4 pb-2 border-b-2 border-[#ece6f5]">Support By</div>
                {draft.partners.support.map((p, i) => (
                  <ItemCard key={p.id} index={i} title={p.name} onRemove={() => removePartner('support', i)}>
                    <div className="flex gap-4 max-[600px]:flex-col">
                      <Field label="Nama"><input className={inputClass} value={p.name} onChange={(e) => updatePartner('support', i, 'name', e.target.value)} /></Field>
                      <Field label="URL Logo (PNG)"><input className={inputClass} value={p.logo} onChange={(e) => updatePartner('support', i, 'logo', e.target.value)} /></Field>
                    </div>
                  </ItemCard>
                ))}
                <AddButton onClick={() => addPartner('support')} label="Tambah Support" />
                <div className="text-sm font-bold uppercase tracking-wider text-[#2b1c3d] mb-4 pb-2 border-b-2 border-[#ece6f5] mt-7">Sponsor By</div>
                {draft.partners.sponsor.map((p, i) => (
                  <ItemCard key={p.id} index={i} title={p.name} onRemove={() => removePartner('sponsor', i)}>
                    <div className="flex gap-4 max-[600px]:flex-col">
                      <Field label="Nama"><input className={inputClass} value={p.name} onChange={(e) => updatePartner('sponsor', i, 'name', e.target.value)} /></Field>
                      <Field label="URL Logo (PNG)"><input className={inputClass} value={p.logo} onChange={(e) => updatePartner('sponsor', i, 'logo', e.target.value)} /></Field>
                    </div>
                  </ItemCard>
                ))}
                <AddButton onClick={() => addPartner('sponsor')} label="Tambah Sponsor" />
                <div className="flex flex-wrap justify-end gap-3 mt-6 pt-5 border-t border-[#eeebf3]">
                  <button onClick={handleReset} className="px-6 py-3 rounded-xl border-2 border-red-200 text-red-500 font-semibold text-sm hover:bg-red-50 hover:border-red-500 transition flex items-center gap-2">
                    {'\u{1F501}'} Reset Semua Data
                  </button>
                  <button onClick={handleSave} className="px-6 py-3 rounded-xl bg-gradient-to-br from-[#7b5ea7] to-[#2b1c3d] text-white font-semibold text-sm shadow-md hover:-translate-y-0.5 hover:shadow-lg transition flex items-center gap-2">
                    {'\u{1F4BE}'} Simpan Partners
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.msg} type={toast.type} />}
      {confirm && <ConfirmModal title={confirm.title} message={confirm.msg} onConfirm={confirm.action} onCancel={() => setConfirm(null)} />}
    </div>
  );
}

export { ADMIN_PASSCODE };