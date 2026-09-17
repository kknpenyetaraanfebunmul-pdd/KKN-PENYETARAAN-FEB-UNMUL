import { useState, useRef } from 'react';
import type { SiteData } from './types';
import { DEFAULT_DATA } from './data';

export const ADMIN_PASSCODE = '110106';

export default function AdminPanel({
  data,
  onSave,
  onReset,
}: {
  data: SiteData;
  onSave: (d: SiteData) => Promise<void>;
  onReset: () => Promise<void>;
}) {
  const [draft, setDraft] = useState<SiteData>(data);
  const [tab, setTab] = useState<'hero' | 'struktur' | 'program' | 'gallery' | 'contact' | 'partners'>('hero');
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);

  const update = (partial: Partial<SiteData>) => setDraft({ ...draft, ...partial });

  const saveAll = async () => {
    setSaving(true);
    await onSave(draft);
    setSaving(false);
    setToast('Semua data tersimpan!');
    setTimeout(() => setToast(''), 2000);
  };

  const hasChanges = JSON.stringify(draft) !== JSON.stringify(data);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#f0ecf7] flex flex-col font-[Poppins,sans-serif]">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#2b1c3d] to-[#7b5ea7] text-white px-4 sm:px-8 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="text-lg sm:text-2xl font-extrabold tracking-widest">KKN. Admin</div>
          <span className="hidden sm:inline text-xs opacity-80 border-l border-white/30 pl-3 tracking-widest uppercase">Control Panel</span>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-widest bg-yellow-400 text-[#2b1c3d] px-3 py-2 rounded-xl">
              ⚠️ Ada perubahan belum disimpan
            </span>
          )}
          <button
            onClick={saveAll}
            disabled={saving}
            className="px-4 sm:px-6 py-2.5 rounded-xl bg-white text-[#2b1c3d] text-xs font-bold uppercase tracking-widest hover:bg-[#ece6f5] transition disabled:opacity-60 flex items-center gap-2 shadow-md"
          >
            {saving ? (
              <><span className="w-3 h-3 border-2 border-[#7b5ea7] border-t-transparent rounded-full animate-spin" /> Menyimpan...</>
            ) : (
              <>💾 Save All</>
            )}
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
        <div className="sm:w-56 bg-white border-b sm:border-b-0 sm:border-r border-[#7b5ea7]/10 overflow-x-auto sm:overflow-y-auto flex sm:flex-col p-2 sm:p-3 gap-1" style={{ scrollbarWidth: 'none' }}>
          {[
            { id: 'hero', icon: '🏠', label: 'Hero' },
            { id: 'struktur', icon: '👥', label: 'Struktur' },
            { id: 'program', icon: '📋', label: 'Program' },
            { id: 'gallery', icon: '🖼️', label: 'Gallery' },
            { id: 'contact', icon: '✉️', label: 'Contact' },
            { id: 'partners', icon: '🤝', label: 'Partners' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-xs font-bold uppercase tracking-wide whitespace-nowrap transition ${
                tab === t.id ? 'bg-gradient-to-br from-[#7b5ea7] to-[#2b1c3d] text-white shadow-md' : 'text-[#2b1c3d] hover:bg-[#ece6f5]'
              }`}
            >
              <span className="text-base">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8 pb-28">
          {tab === 'hero' && <HeroPanel draft={draft} update={update} />}
          {tab === 'struktur' && <StrukturPanel draft={draft} update={update} />}
          {tab === 'program' && <ProgramPanel draft={draft} update={update} />}
          {tab === 'gallery' && <GalleryPanel draft={draft} update={update} />}
          {tab === 'contact' && <ContactPanel draft={draft} update={update} />}
          {tab === 'partners' && <PartnersPanel draft={draft} update={update} onReset={onReset} />}
        </div>
      </div>

      {/* FLOATING SAVE ALL BUTTON (muncul saat ada perubahan) */}
      {hasChanges && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[10005]">
          <button
            onClick={saveAll}
            disabled={saving}
            className="px-8 py-4 rounded-2xl bg-gradient-to-br from-[#7b5ea7] to-[#2b1c3d] text-white text-sm font-bold uppercase tracking-widest shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition disabled:opacity-60 flex items-center gap-3"
          >
            {saving ? (
              <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Menyimpan...</>
            ) : (
              <>💾 Save All ({['hero','struktur','program','gallery','contact','partners'].filter(k => JSON.stringify((draft as any)[k]) !== JSON.stringify((data as any)[k])).length} tab berubah)</>
            )}
          </button>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl bg-green-500 text-white text-sm font-bold shadow-2xl z-[10010] animate-pulse">
          ✓ {toast}
        </div>
      )}
    </div>
  );
}

/* ============ HERO PANEL ============ */
function HeroPanel({ draft, update }: { draft: SiteData; update: (p: Partial<SiteData>) => void }) {
  const [loadingIdx, setLoadingIdx] = useState<number | null>(null);
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  const setSlide = (i: number, url: string) => {
    const arr = [...draft.hero.slideshow];
    arr[i] = url;
    update({ hero: { ...draft.hero, slideshow: arr } });
  };

  const addSlide = () => update({ hero: { ...draft.hero, slideshow: [...draft.hero.slideshow, ''] } });

  const removeSlide = (i: number) => {
    if (draft.hero.slideshow.length <= 1) { alert('Minimal 1 foto!'); return; }
    update({ hero: { ...draft.hero, slideshow: draft.hero.slideshow.filter((_, x) => x !== i) } });
  };

  const compress = (file: File): Promise<string> => new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        let { width, height } = img;
        if (width > 1400) { height = (height * 1400) / width; width = 1400; }
        c.width = width; c.height = height;
        const ctx = c.getContext('2d'); if (!ctx) return rej('error');
        ctx.drawImage(img, 0, 0, width, height);
        res(c.toDataURL('image/jpeg', 0.75));
      };
      img.onerror = () => rej('error');
      img.src = e.target?.result as string;
    };
    r.onerror = () => rej('error');
    r.readAsDataURL(file);
  });

  const upload = async (i: number, file: File) => {
    if (!file.type.startsWith('image/')) return alert('Harus gambar!');
    if (file.size > 5 * 1024 * 1024) return alert('Maks 5MB!');
    setLoadingIdx(i);
    try { setSlide(i, await compress(file)); } catch { alert('Gagal upload'); }
    setLoadingIdx(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#2b1c3d] mb-1">Hero Section</h1>
      <p className="text-xs text-gray-500 mb-6">Edit teks & background slideshow. Klik Save All untuk simpan.</p>

      <Card title="📝 Teks">
        <Input label="Judul Baris 1" value={draft.hero.line1} onChange={(v) => update({ hero: { ...draft.hero, line1: v } })} />
        <Input label="Judul Baris 2" value={draft.hero.line2} onChange={(v) => update({ hero: { ...draft.hero, line2: v } })} />
        <Input label="Deskripsi" value={draft.hero.description} onChange={(v) => update({ hero: { ...draft.hero, description: v } })} multiline />
      </Card>

      <Card title="🖼️ Background Slideshow (Foto Hero)">
        <p className="text-xs text-gray-500 mb-4">Foto bergantian otomatis. Upload foto atau paste URL.</p>
        {draft.hero.slideshow.map((img, i) => (
          <div key={i} className="mb-4 p-4 rounded-2xl border-2 border-[#ece6f5] bg-[#f7f5fb]">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#7b5ea7] text-white text-[11px] font-bold flex items-center justify-center">{i + 1}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#7b5ea7]">Foto {i + 1}</div>
              </div>
              {draft.hero.slideshow.length > 1 && (
                <button onClick={() => removeSlide(i)} className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 text-[10px] font-bold uppercase hover:bg-red-500 hover:text-white transition">🗑️ Hapus</button>
              )}
            </div>
            {img && (
              <div className="mb-3 rounded-xl overflow-hidden bg-black h-40">
                <img src={img} className="w-full h-full object-cover" alt="" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
            )}
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7b5ea7] mb-1.5">🔗 URL Gambar</label>
            <input
              type="text"
              value={img.startsWith('data:') ? '(dari upload file)' : img}
              onChange={(e) => { if (!img.startsWith('data:')) setSlide(i, e.target.value); }}
              disabled={img.startsWith('data:')}
              placeholder="https://contoh.com/foto.jpg"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-[#ece6f5] bg-white text-xs outline-none focus:border-[#7b5ea7] disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed mb-3"
            />
            <div className="text-center text-[10px] text-gray-400 font-bold uppercase mb-1.5">— atau —</div>
            <div
              onClick={() => fileRefs.current[i]?.click()}
              className="cursor-pointer rounded-xl border-2 border-dashed border-[#7b5ea7]/40 bg-white hover:bg-[#ece6f5] p-4 text-center transition"
            >
              {loadingIdx === i ? (
                <div className="text-xs font-bold text-[#7b5ea7]">⏳ Memproses...</div>
              ) : (
                <>
                  <div className="text-2xl mb-1">📤</div>
                  <div className="text-xs font-bold text-[#7b5ea7]">Klik untuk Upload Foto</div>
                  <div className="text-[10px] text-gray-400 mt-1">JPG/PNG, Maks 5MB</div>
                </>
              )}
            </div>
            <input
              ref={(el) => { fileRefs.current[i] = el; }}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(i, f); e.target.value = ''; }}
            />
          </div>
        ))}
        <button onClick={addSlide} className="w-full py-3 rounded-xl bg-[#ece6f5] border-2 border-dashed border-[#7b5ea7] text-[#7b5ea7] text-xs font-bold uppercase hover:bg-[#7b5ea7] hover:text-white transition">
          + Tambah Foto Background
        </button>
      </Card>
    </div>
  );
}

/* ============ STRUKTUR ============ */
function StrukturPanel({ draft, update }: { draft: SiteData; update: (p: Partial<SiteData>) => void }) {
  const setItem = (i: number, key: 'jabatan' | 'deskripsi', v: string) => {
    const arr = [...draft.struktur];
    arr[i] = { ...arr[i], [key]: v };
    update({ struktur: arr });
  };
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#2b1c3d] mb-6">Struktur KKN</h1>
      {draft.struktur.map((s, i) => (
        <Card key={i} title={`Item ${i + 1}`}>
          <div className="flex justify-end -mt-10 mb-2">
            <button onClick={() => update({ struktur: draft.struktur.filter((_, x) => x !== i) })} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition">✕</button>
          </div>
          <Input label="Jabatan" value={s.jabatan} onChange={(v) => setItem(i, 'jabatan', v)} />
          <Input label="Deskripsi" value={s.deskripsi} onChange={(v) => setItem(i, 'deskripsi', v)} />
        </Card>
      ))}
      <button onClick={() => update({ struktur: [...draft.struktur, { id: crypto.randomUUID(), jabatan: 'Jabatan Baru', deskripsi: 'Deskripsi' }] })} className="w-full py-3 rounded-xl bg-[#ece6f5] border-2 border-dashed border-[#7b5ea7] text-[#7b5ea7] text-xs font-bold uppercase hover:bg-[#7b5ea7] hover:text-white transition">+ Tambah Struktur</button>
    </div>
  );
}

/* ============ PROGRAM ============ */
function ProgramPanel({ draft, update }: { draft: SiteData; update: (p: Partial<SiteData>) => void }) {
  const setItem = (i: number, key: string, v: any) => {
    const arr = [...draft.program];
    arr[i] = { ...arr[i], [key]: v };
    update({ program: arr });
  };
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#2b1c3d] mb-6">Program Kerja</h1>
      {draft.program.map((p, i) => (
        <Card key={i} title={`${p.icon} ${p.title}`}>
          <div className="flex justify-end -mt-10 mb-2">
            <button onClick={() => update({ program: draft.program.filter((_, x) => x !== i) })} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition">✕</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Icon" value={p.icon} onChange={(v) => setItem(i, 'icon', v)} />
            <Input label="Judul" value={p.title} onChange={(v) => setItem(i, 'title', v)} />
          </div>
          <Input label="Deskripsi Singkat" value={p.shortDesc} onChange={(v) => setItem(i, 'shortDesc', v)} multiline />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Kategori" value={p.category} onChange={(v) => setItem(i, 'category', v)} />
            <Input label="Subtitle" value={p.subtitle} onChange={(v) => setItem(i, 'subtitle', v)} />
          </div>
          <Input label="Deskripsi Panjang" value={p.description} onChange={(v) => setItem(i, 'description', v)} multiline />
          <Input label="Kegiatan (1 per baris)" value={p.activities} onChange={(v) => setItem(i, 'activities', v)} multiline />
          <Input label="Info (Label|Value, 1 per baris)" value={p.info} onChange={(v) => setItem(i, 'info', v)} multiline />
        </Card>
      ))}
      <button onClick={() => update({ program: [...draft.program, { id: crypto.randomUUID(), icon: '📌', title: 'Program Baru', shortDesc: 'Deskripsi', category: 'Bidang', subtitle: 'Subtitle', description: 'Deskripsi panjang', activities: 'Kegiatan 1', info: 'Sasaran|-' }] })} className="w-full py-3 rounded-xl bg-[#ece6f5] border-2 border-dashed border-[#7b5ea7] text-[#7b5ea7] text-xs font-bold uppercase hover:bg-[#7b5ea7] hover:text-white transition">+ Tambah Program</button>
    </div>
  );
}

/* ============ GALLERY ============ */
function GalleryPanel({ draft, update }: { draft: SiteData; update: (p: Partial<SiteData>) => void }) {
  const setItem = (i: number, key: string, v: any) => {
    const arr = [...draft.gallery];
    arr[i] = { ...arr[i], [key]: v };
    update({ gallery: arr });
  };
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#2b1c3d] mb-6">Gallery</h1>
      {draft.gallery.map((g, i) => (
        <Card key={i} title={`${g.type === 'video' ? '🎬' : '🖼️'} ${g.title}`}>
          <div className="flex justify-end -mt-10 mb-2">
            <button onClick={() => update({ gallery: draft.gallery.filter((_, x) => x !== i) })} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition">✕</button>
          </div>
          <div className="mb-4">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7b5ea7] mb-2">Tipe</label>
            <select value={g.type} onChange={(e) => setItem(i, 'type', e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-[#ece6f5] bg-[#f7f5fb] text-sm outline-none focus:border-[#7b5ea7]">
              <option value="img">Foto</option>
              <option value="video">Video</option>
            </select>
          </div>
          <Input label="URL Sumber" value={g.src} onChange={(v) => setItem(i, 'src', v)} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Judul" value={g.title} onChange={(v) => setItem(i, 'title', v)} />
            <Input label="Deskripsi" value={g.desc} onChange={(v) => setItem(i, 'desc', v)} />
          </div>
        </Card>
      ))}
      <button onClick={() => update({ gallery: [...draft.gallery, { id: crypto.randomUUID(), type: 'img', src: '', title: 'Foto Baru', desc: '' }] })} className="w-full py-3 rounded-xl bg-[#ece6f5] border-2 border-dashed border-[#7b5ea7] text-[#7b5ea7] text-xs font-bold uppercase hover:bg-[#7b5ea7] hover:text-white transition">+ Tambah Media</button>
    </div>
  );
}

/* ============ CONTACT ============ */
function ContactPanel({ draft, update }: { draft: SiteData; update: (p: Partial<SiteData>) => void }) {
  const setC = (key: string, v: string) => update({ contact: { ...draft.contact, [key]: v } });
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#2b1c3d] mb-6">Contact</h1>
      <Card title="📱 Sosial Media">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="IG Username" value={draft.contact.instagramUsername} onChange={(v) => setC('instagramUsername', v)} />
          <Input label="IG URL" value={draft.contact.instagramUrl} onChange={(v) => setC('instagramUrl', v)} />
          <Input label="TikTok Username" value={draft.contact.tiktokUsername} onChange={(v) => setC('tiktokUsername', v)} />
          <Input label="TikTok URL" value={draft.contact.tiktokUrl} onChange={(v) => setC('tiktokUrl', v)} />
        </div>
        <Input label="Email" value={draft.contact.email} onChange={(v) => setC('email', v)} />
      </Card>
    </div>
  );
}

/* ============ PARTNERS ============ */
function PartnersPanel({ draft, update, onReset }: { draft: SiteData; update: (p: Partial<SiteData>) => void; onReset: () => Promise<void> }) {
  const setP = (type: 'support' | 'sponsor', i: number, key: 'name' | 'logo', v: string) => {
    const arr = [...draft.partners[type]];
    arr[i] = { ...arr[i], [key]: v };
    update({ partners: { ...draft.partners, [type]: arr } });
  };
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#2b1c3d] mb-6">Support & Sponsor</h1>
      <Card title="🤝 Support By">
        {draft.partners.support.map((p, i) => (
          <div key={i} className="flex flex-col sm:flex-row gap-3 mb-3 items-start sm:items-end">
            <div className="flex-1 w-full"><Input label="Nama" value={p.name} onChange={(v) => setP('support', i, 'name', v)} /></div>
            <div className="flex-1 w-full"><Input label="URL Logo" value={p.logo} onChange={(v) => setP('support', i, 'logo', v)} /></div>
            <div className="pb-4"><button onClick={() => update({ partners: { ...draft.partners, support: draft.partners.support.filter((_, x) => x !== i) } })} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition">✕</button></div>
          </div>
        ))}
        <button onClick={() => update({ partners: { ...draft.partners, support: [...draft.partners.support, { id: crypto.randomUUID(), name: 'Nama', logo: '' }] } })} className="w-full py-3 rounded-xl bg-[#ece6f5] border-2 border-dashed border-[#7b5ea7] text-[#7b5ea7] text-xs font-bold uppercase hover:bg-[#7b5ea7] hover:text-white transition">+ Tambah Support</button>
      </Card>
      <Card title="💰 Sponsor By">
        {draft.partners.sponsor.map((p, i) => (
          <div key={i} className="flex flex-col sm:flex-row gap-3 mb-3 items-start sm:items-end">
            <div className="flex-1 w-full"><Input label="Nama" value={p.name} onChange={(v) => setP('sponsor', i, 'name', v)} /></div>
            <div className="flex-1 w-full"><Input label="URL Logo" value={p.logo} onChange={(v) => setP('sponsor', i, 'logo', v)} /></div>
            <div className="pb-4"><button onClick={() => update({ partners: { ...draft.partners, sponsor: draft.partners.sponsor.filter((_, x) => x !== i) } })} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition">✕</button></div>
          </div>
        ))}
        <button onClick={() => update({ partners: { ...draft.partners, sponsor: [...draft.partners.sponsor, { id: crypto.randomUUID(), name: 'Nama', logo: '' }] } })} className="w-full py-3 rounded-xl bg-[#ece6f5] border-2 border-dashed border-[#7b5ea7] text-[#7b5ea7] text-xs font-bold uppercase hover:bg-[#7b5ea7] hover:text-white transition">+ Tambah Sponsor</button>
      </Card>
      <button onClick={() => { if (confirm('Reset semua data ke default?')) onReset(); }} className="px-6 py-3 rounded-xl bg-red-500/10 text-red-500 border-2 border-red-500/20 text-xs font-bold uppercase hover:bg-red-500 hover:text-white transition">🔄 Reset</button>
    </div>
  );
}

/* ============ REUSABLE ============ */
function Input({ label, value, onChange, multiline }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  return (
    <div className="mb-4">
      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7b5ea7] mb-2">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl border-2 border-[#ece6f5] bg-[#f7f5fb] text-sm outline-none focus:border-[#7b5ea7] focus:bg-white resize-y" />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-[#ece6f5] bg-[#f7f5fb] text-sm outline-none focus:border-[#7b5ea7] focus:bg-white" />
      )}
    </div>
  );
}

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-7 mb-4 shadow-sm border border-[#7b5ea7]/10">
      {title && <div className="text-sm font-extrabold text-[#2b1c3d] uppercase tracking-wider mb-4">{title}</div>}
      {children}
    </div>
  );
}