import { useState, useRef } from 'react';
import type { SiteData } from './types';
import { DEFAULT_DATA, ADMIN_PASSCODE } from './data';

/* ============== LOGIN MODAL ============== */
export function AdminLogin({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  const submit = () => {
    if (code.trim() === ADMIN_PASSCODE) {
      setCode('');
      setError(false);
      onSuccess();
    } else {
      setError(true);
      setCode('');
      setTimeout(() => setError(false), 600);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[10001] flex items-center justify-center p-5 bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl p-8 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#ece6f5] text-[#2b1c3d] flex items-center justify-center hover:bg-[#7b5ea7] hover:text-white transition"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-[#7b5ea7] to-[#2b1c3d] flex items-center justify-center text-3xl">
          🔒
        </div>
        <h2 className="text-xl font-extrabold text-[#2b1c3d] uppercase tracking-wide mb-2">
          Admin Access
        </h2>
        <p className="text-xs text-gray-500 mb-7">Masukkan passcode untuk melanjutkan</p>
        <input
          type="password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="••••••"
          maxLength={10}
          autoFocus
          className={`w-full px-5 py-4 text-2xl font-bold text-center tracking-[8px] text-[#2b1c3d] rounded-2xl border-2 outline-none transition ${
            error
              ? 'border-red-500 bg-red-50 animate-shake'
              : 'border-[#ece6f5] bg-[#f7f5fb] focus:border-[#7b5ea7] focus:bg-white focus:ring-4 focus:ring-[#7b5ea7]/15'
          }`}
        />
        <p className="text-red-500 text-xs font-semibold mt-2 h-4">
          {error ? 'Passcode salah. Coba lagi.' : ''}
        </p>
        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-[#ece6f5] text-[#2b1c3d] text-xs font-bold uppercase tracking-widest hover:bg-[#e0d5ef] transition"
          >
            Batal
          </button>
          <button
            onClick={submit}
            className="flex-1 py-3 rounded-xl bg-gradient-to-br from-[#7b5ea7] to-[#2b1c3d] text-white text-xs font-bold uppercase tracking-widest hover:shadow-lg transition"
          >
            Masuk
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============== DASHBOARD ============== */
type Tab = 'hero' | 'struktur' | 'program' | 'gallery' | 'contact' | 'partners';

export function AdminDashboard({
  open,
  onClose,
  data,
  setData,
  onReset,
}: {
  open: boolean;
  onClose: () => void;
  data: SiteData;
  setData: (d: SiteData) => void;
  onReset: () => void;
}) {
  const [tab, setTab] = useState<Tab>('hero');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  };

  const update = (partial: Partial<SiteData>) => {
    const next = { ...data, ...partial };
    setData(next);
  };

  if (!open) return null;

  const tabs: { id: Tab; icon: string; label: string }[] = [
    { id: 'hero', icon: '🏠', label: 'Hero' },
    { id: 'struktur', icon: '👥', label: 'Struktur' },
    { id: 'program', icon: '📋', label: 'Program' },
    { id: 'gallery', icon: '🖼️', label: 'Gallery' },
    { id: 'contact', icon: '✉️', label: 'Contact' },
    { id: 'partners', icon: '🤝', label: 'Partners' },
  ];

  return (
    <div className="fixed inset-0 z-[10002] bg-[#f0ecf7] flex flex-col">
      <div className="bg-gradient-to-r from-[#2b1c3d] to-[#7b5ea7] text-white px-4 sm:px-8 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="text-lg sm:text-2xl font-extrabold tracking-widest">KKN. Admin</div>
          <div className="hidden sm:block text-xs opacity-80 border-l border-white/30 pl-3 tracking-widest uppercase">
            Control Panel
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-2 rounded-xl bg-white/15 border border-white/20 hover:bg-white/25 text-xs font-semibold flex items-center gap-1 transition"
          >
            👁 <span className="hidden sm:inline">Lihat Situs</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
        <div className="sm:w-56 bg-white border-b sm:border-b-0 sm:border-r border-[#7b5ea7]/10 overflow-x-auto sm:overflow-y-auto no-scrollbar flex sm:flex-col p-2 sm:p-3 gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-xs font-bold uppercase tracking-wide whitespace-nowrap transition ${
                tab === t.id
                  ? 'bg-gradient-to-br from-[#7b5ea7] to-[#2b1c3d] text-white shadow-md'
                  : 'text-[#2b1c3d] hover:bg-[#ece6f5]'
              }`}
            >
              <span className="text-base">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          {tab === 'hero' && <HeroPanel data={data} update={update} showToast={showToast} />}
          {tab === 'struktur' && <StrukturPanel data={data} update={update} showToast={showToast} />}
          {tab === 'program' && <ProgramPanel data={data} update={update} showToast={showToast} />}
          {tab === 'gallery' && <GalleryPanel data={data} update={update} showToast={showToast} />}
          {tab === 'contact' && <ContactPanel data={data} update={update} showToast={showToast} />}
          {tab === 'partners' && (
            <PartnersPanel data={data} update={update} showToast={showToast} onReset={onReset} />
          )}
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white text-sm font-bold shadow-2xl animate-toast z-[10010]">
          ✓ {toast}
        </div>
      )}
    </div>
  );
}

/* ============ REUSABLE ============ */
const Input = ({
  label,
  value,
  onChange,
  placeholder,
  multiline,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  type?: string;
}) => (
  <div className="mb-4">
    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7b5ea7] mb-2">
      {label}
    </label>
    {multiline ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full px-4 py-3 rounded-xl border-2 border-[#ece6f5] bg-[#f7f5fb] text-sm text-[#2b1c3d] font-medium outline-none focus:border-[#7b5ea7] focus:bg-white focus:ring-4 focus:ring-[#7b5ea7]/10 transition resize-y"
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border-2 border-[#ece6f5] bg-[#f7f5fb] text-sm text-[#2b1c3d] font-medium outline-none focus:border-[#7b5ea7] focus:bg-white focus:ring-4 focus:ring-[#7b5ea7]/10 transition"
      />
    )}
  </div>
);

const Card = ({ children, title }: { children: React.ReactNode; title?: string }) => (
  <div className="bg-white rounded-2xl p-5 sm:p-7 mb-4 shadow-sm border border-[#7b5ea7]/10">
    {title && <div className="text-sm font-extrabold text-[#2b1c3d] uppercase tracking-wider mb-4">{title}</div>}
    {children}
  </div>
);

const SaveBtn = ({ onClick, label = 'Simpan' }: { onClick: () => void; label?: string }) => (
  <button
    onClick={onClick}
    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-br from-[#7b5ea7] to-[#2b1c3d] text-white text-xs font-bold uppercase tracking-widest hover:shadow-lg transition"
  >
    💾 {label}
  </button>
);

const RemoveBtn = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition text-base"
  >
    ✕
  </button>
);

const AddBtn = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <button
    onClick={onClick}
    className="w-full py-3 rounded-xl bg-[#ece6f5] border-2 border-dashed border-[#7b5ea7] text-[#7b5ea7] text-xs font-bold uppercase tracking-widest hover:bg-[#7b5ea7] hover:text-white transition flex items-center justify-center gap-2"
  >
    + {label}
  </button>
);

/* ============== PANELS ============== */

function HeroPanel({
  data,
  update,
  showToast,
}: {
  data: SiteData;
  update: (p: Partial<SiteData>) => void;
  showToast: (m: string) => void;
}) {
  const [draft, setDraft] = useState(data.hero);
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const save = () => {
    update({ hero: draft });
    showToast('Hero berhasil disimpan!');
  };

  const addBg = () => {
    setDraft({ ...draft, backgroundImages: [...draft.backgroundImages, ''] });
  };

  const removeBg = (i: number) => {
    if (draft.backgroundImages.length <= 1) {
      alert('Minimal harus ada 1 foto background!');
      return;
    }
    setDraft({
      ...draft,
      backgroundImages: draft.backgroundImages.filter((_, idx) => idx !== i),
    });
  };

  const updateBgUrl = (i: number, url: string) => {
    const arr = [...draft.backgroundImages];
    arr[i] = url;
    setDraft({ ...draft, backgroundImages: arr });
  };

  const compressImage = (file: File, maxWidth = 1600, quality = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject('Canvas error');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => reject('Gagal load gambar');
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject('Gagal baca file');
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (i: number, file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar!');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB!');
      return;
    }
    setLoadingIndex(i);
    try {
      const base64 = await compressImage(file);
      updateBgUrl(i, base64);
      showToast(`Foto ${i + 1} berhasil diupload!`);
    } catch (err) {
      alert('Gagal upload gambar: ' + err);
    } finally {
      setLoadingIndex(null);
    }
  };

  const handleDrop = (i: number) => (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(i, file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#2b1c3d] mb-1">Hero Section</h1>
      <p className="text-xs text-gray-500 mb-6">
        Edit judul, deskripsi, dan background foto slideshow hero
      </p>

      <Card title="📝 Teks">
        <Input
          label="Judul Baris 1 (Ungu)"
          value={draft.title1}
          onChange={(v) => setDraft({ ...draft, title1: v })}
        />
        <Input
          label="Judul Baris 2"
          value={draft.title2}
          onChange={(v) => setDraft({ ...draft, title2: v })}
        />
        <Input
          label="Deskripsi"
          value={draft.desc}
          onChange={(v) => setDraft({ ...draft, desc: v })}
          multiline
        />
      </Card>

      <Card title="🖼️ Background Slideshow (Foto Hero)">
        <div className="text-xs text-gray-500 mb-5 leading-relaxed">
          Foto akan bergantian otomatis sebagai slideshow. Kamu bisa:
          <br />• 📋 <b>Paste URL</b> gambar, atau
          <br />• 📤 <b>Upload dari komputer</b> (klik area upload / drag & drop)
          <br />• 🗑️ <b>Hapus</b> foto yang tidak diinginkan
        </div>

        <div className="space-y-4 mb-4">
          {draft.backgroundImages.map((img, i) => (
            <div
              key={i}
              className="rounded-2xl border-2 border-[#ece6f5] bg-[#f7f5fb] p-4 transition hover:border-[#7b5ea7]/40"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#7b5ea7] text-white text-[11px] font-bold flex items-center justify-center">
                    {i + 1}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#7b5ea7]">
                    Foto {i + 1}
                  </div>
                </div>
                {draft.backgroundImages.length > 1 && (
                  <button
                    onClick={() => removeBg(i)}
                    className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-wide hover:bg-red-500 hover:text-white transition"
                  >
                    🗑️ Hapus
                  </button>
                )}
              </div>

              {img && (
                <div className="relative mb-3 rounded-xl overflow-hidden bg-[#2b1c3d] h-40">
                  <img
                    src={img}
                    alt={`Preview ${i + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[9px] font-bold tracking-wider">
                    PREVIEW
                  </div>
                </div>
              )}

              <div className="mb-3">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7b5ea7] mb-1.5">
                  🔗 URL Gambar
                </label>
                <input
                  type="text"
                  value={img.startsWith('data:') ? '(dari upload file)' : img}
                  onChange={(e) => {
                    if (!img.startsWith('data:')) updateBgUrl(i, e.target.value);
                  }}
                  disabled={img.startsWith('data:')}
                  placeholder="https://contoh.com/foto.jpg"
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[#ece6f5] bg-white text-xs text-[#2b1c3d] font-medium outline-none focus:border-[#7b5ea7] focus:ring-4 focus:ring-[#7b5ea7]/10 transition disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                />
              </div>

              <div className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest mb-1.5">
                — atau —
              </div>

              <div
                onDrop={handleDrop(i)}
                onDragOver={handleDragOver}
                onClick={() => fileInputRefs.current[i]?.click()}
                className="cursor-pointer rounded-xl border-2 border-dashed border-[#7b5ea7]/40 bg-white hover:bg-[#ece6f5] hover:border-[#7b5ea7] transition p-4 text-center"
              >
                {loadingIndex === i ? (
                  <div className="text-xs font-bold text-[#7b5ea7]">
                    ⏳ Memproses gambar...
                  </div>
                ) : (
                  <>
                    <div className="text-2xl mb-1">📤</div>
                    <div className="text-xs font-bold text-[#7b5ea7]">
                      Upload / Drag foto ke sini
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1">
                      PNG, JPG, WEBP — Maks 5MB
                    </div>
                  </>
                )}
              </div>

              <input
                ref={(el) => {
                  fileInputRefs.current[i] = el;
                }}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(i, file);
                  e.target.value = '';
                }}
              />
            </div>
          ))}
        </div>

        <AddBtn onClick={addBg} label="Tambah Foto Background" />
      </Card>

      <div className="flex gap-3">
        <SaveBtn onClick={save} label="Simpan Hero" />
      </div>
    </div>
  );
}

function StrukturPanel({
  data,
  update,
  showToast,
}: {
  data: SiteData;
  update: (p: Partial<SiteData>) => void;
  showToast: (m: string) => void;
}) {
  const [draft, setDraft] = useState(data.struktur);

  const save = () => {
    update({ struktur: draft });
    showToast('Struktur berhasil disimpan!');
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#2b1c3d] mb-1">Struktur KKN</h1>
      <p className="text-xs text-gray-500 mb-6">Edit jabatan dan deskripsi struktur organisasi</p>

      {draft.map((item, i) => (
        <Card key={i} title={`Item ${i + 1}`}>
          <div className="flex justify-end -mt-10 mb-2">
            <RemoveBtn onClick={() => setDraft(draft.filter((_, idx) => idx !== i))} />
          </div>
          <Input
            label="Jabatan"
            value={item.title}
            onChange={(v) => {
              const arr = [...draft];
              arr[i] = { ...arr[i], title: v };
              setDraft(arr);
            }}
          />
          <Input
            label="Deskripsi"
            value={item.subtitle}
            onChange={(v) => {
              const arr = [...draft];
              arr[i] = { ...arr[i], subtitle: v };
              setDraft(arr);
            }}
          />
        </Card>
      ))}

      <div className="mb-4">
        <AddBtn
          onClick={() => setDraft([...draft, { title: 'Jabatan Baru', subtitle: 'Deskripsi' }])}
          label="Tambah Struktur"
        />
      </div>
      <SaveBtn onClick={save} label="Simpan Struktur" />
    </div>
  );
}

function ProgramPanel({
  data,
  update,
  showToast,
}: {
  data: SiteData;
  update: (p: Partial<SiteData>) => void;
  showToast: (m: string) => void;
}) {
  const [draft, setDraft] = useState(data.program);

  const save = () => {
    update({ program: draft });
    showToast('Program berhasil disimpan!');
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#2b1c3d] mb-1">Program Kerja</h1>
      <p className="text-xs text-gray-500 mb-6">Edit kartu program dan detailnya</p>

      {draft.map((p, i) => (
        <Card key={i} title={`${p.icon} ${p.title || 'Program ' + (i + 1)}`}>
          <div className="flex justify-end -mt-10 mb-2">
            <RemoveBtn onClick={() => setDraft(draft.filter((_, idx) => idx !== i))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Icon (emoji)"
              value={p.icon}
              onChange={(v) => {
                const arr = [...draft];
                arr[i] = { ...arr[i], icon: v };
                setDraft(arr);
              }}
            />
            <Input
              label="Judul"
              value={p.title}
              onChange={(v) => {
                const arr = [...draft];
                arr[i] = { ...arr[i], title: v };
                setDraft(arr);
              }}
            />
          </div>
          <Input
            label="Deskripsi Singkat (Card)"
            value={p.desc}
            onChange={(v) => {
              const arr = [...draft];
              arr[i] = { ...arr[i], desc: v };
              setDraft(arr);
            }}
            multiline
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Kategori"
              value={p.category}
              onChange={(v) => {
                const arr = [...draft];
                arr[i] = { ...arr[i], category: v };
                setDraft(arr);
              }}
            />
            <Input
              label="Subtitle"
              value={p.subtitle}
              onChange={(v) => {
                const arr = [...draft];
                arr[i] = { ...arr[i], subtitle: v };
                setDraft(arr);
              }}
            />
          </div>
          <Input
            label="Deskripsi Panjang"
            value={p.description}
            onChange={(v) => {
              const arr = [...draft];
              arr[i] = { ...arr[i], description: v };
              setDraft(arr);
            }}
            multiline
          />
          <Input
            label="Kegiatan (1 per baris)"
            value={p.activities.join('\n')}
            onChange={(v) => {
              const arr = [...draft];
              arr[i] = { ...arr[i], activities: v.split('\n') };
              setDraft(arr);
            }}
            multiline
          />
          <Input
            label="Info (format: Label|Value, 1 per baris)"
            value={p.info.map((x) => `${x.label}|${x.value}`).join('\n')}
            onChange={(v) => {
              const arr = [...draft];
              arr[i] = {
                ...arr[i],
                info: v.split('\n').map((line) => {
                  const [label, ...rest] = line.split('|');
                  return { label: label || '', value: rest.join('|') || '' };
                }),
              };
              setDraft(arr);
            }}
            multiline
          />
        </Card>
      ))}

      <div className="mb-4">
        <AddBtn
          onClick={() =>
            setDraft([
              ...draft,
              {
                key: 'program-' + Date.now(),
                icon: '📌',
                title: 'Program Baru',
                desc: 'Deskripsi singkat',
                category: 'Bidang',
                subtitle: 'Subtitle',
                description: 'Deskripsi panjang',
                activities: ['Kegiatan 1'],
                info: [{ label: 'Sasaran', value: '-' }],
              },
            ])
          }
          label="Tambah Program"
        />
      </div>
      <SaveBtn onClick={save} label="Simpan Program" />
    </div>
  );
}

function GalleryPanel({
  data,
  update,
  showToast,
}: {
  data: SiteData;
  update: (p: Partial<SiteData>) => void;
  showToast: (m: string) => void;
}) {
  const [draft, setDraft] = useState(data.gallery);

  const save = () => {
    update({ gallery: draft });
    showToast('Gallery berhasil disimpan!');
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#2b1c3d] mb-1">Gallery</h1>
      <p className="text-xs text-gray-500 mb-6">Kelola foto & video di gallery</p>

      {draft.map((g, i) => (
        <Card key={i} title={`${g.type === 'video' ? '🎬' : '🖼️'} ${g.title || 'Media ' + (i + 1)}`}>
          <div className="flex justify-end -mt-10 mb-2">
            <RemoveBtn onClick={() => setDraft(draft.filter((_, idx) => idx !== i))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="mb-4">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7b5ea7] mb-2">
                Tipe
              </label>
              <select
                value={g.type}
                onChange={(e) => {
                  const arr = [...draft];
                  arr[i] = { ...arr[i], type: e.target.value as 'img' | 'video' };
                  setDraft(arr);
                }}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#ece6f5] bg-[#f7f5fb] text-sm outline-none focus:border-[#7b5ea7] transition"
              >
                <option value="img">Foto (Image)</option>
                <option value="video">Video (MP4)</option>
              </select>
            </div>
          </div>
          <Input
            label="URL Sumber"
            value={g.src}
            onChange={(v) => {
              const arr = [...draft];
              arr[i] = { ...arr[i], src: v };
              setDraft(arr);
            }}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Judul"
              value={g.title}
              onChange={(v) => {
                const arr = [...draft];
                arr[i] = { ...arr[i], title: v };
                setDraft(arr);
              }}
            />
            <Input
              label="Deskripsi"
              value={g.desc}
              onChange={(v) => {
                const arr = [...draft];
                arr[i] = { ...arr[i], desc: v };
                setDraft(arr);
              }}
            />
          </div>
        </Card>
      ))}

      <div className="mb-4">
        <AddBtn
          onClick={() =>
            setDraft([...draft, { type: 'img', src: '', title: 'Foto Baru', desc: 'Deskripsi' }])
          }
          label="Tambah Media"
        />
      </div>
      <SaveBtn onClick={save} label="Simpan Gallery" />
    </div>
  );
}

function ContactPanel({
  data,
  update,
  showToast,
}: {
  data: SiteData;
  update: (p: Partial<SiteData>) => void;
  showToast: (m: string) => void;
}) {
  const [draft, setDraft] = useState(data.contact);

  const save = () => {
    update({ contact: draft });
    showToast('Contact berhasil disimpan!');
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#2b1c3d] mb-1">Contact</h1>
      <p className="text-xs text-gray-500 mb-6">Edit info kontak & sosial media</p>

      <Card title="📱 Sosial Media">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Instagram Username"
            value={draft.instagram}
            onChange={(v) => setDraft({ ...draft, instagram: v })}
          />
          <Input
            label="Instagram URL"
            value={draft.instagramUrl}
            onChange={(v) => setDraft({ ...draft, instagramUrl: v })}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="TikTok Username"
            value={draft.tiktok}
            onChange={(v) => setDraft({ ...draft, tiktok: v })}
          />
          <Input
            label="TikTok URL"
            value={draft.tiktokUrl}
            onChange={(v) => setDraft({ ...draft, tiktokUrl: v })}
          />
        </div>
        <Input label="Email" value={draft.email} onChange={(v) => setDraft({ ...draft, email: v })} />
      </Card>

      <SaveBtn onClick={save} label="Simpan Contact" />
    </div>
  );
}

function PartnersPanel({
  data,
  update,
  showToast,
  onReset,
}: {
  data: SiteData;
  update: (p: Partial<SiteData>) => void;
  showToast: (m: string) => void;
  onReset: () => void;
}) {
  const [draft, setDraft] = useState(data.partners);

  const save = () => {
    update({ partners: draft });
    showToast('Partners berhasil disimpan!');
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#2b1c3d] mb-1">Support & Sponsor</h1>
      <p className="text-xs text-gray-500 mb-6">Kelola logo support & sponsor (PNG transparan)</p>

      <Card title="🤝 Support By">
        {draft.support.map((p, i) => (
          <div key={i} className="flex flex-col sm:flex-row gap-3 mb-3 items-start sm:items-end">
            <div className="flex-1 w-full">
              <Input
                label={`Nama ${i + 1}`}
                value={p.name}
                onChange={(v) => {
                  const arr = [...draft.support];
                  arr[i] = { ...arr[i], name: v };
                  setDraft({ ...draft, support: arr });
                }}
              />
            </div>
            <div className="flex-1 w-full">
              <Input
                label="URL Logo"
                value={p.logo}
                onChange={(v) => {
                  const arr = [...draft.support];
                  arr[i] = { ...arr[i], logo: v };
                  setDraft({ ...draft, support: arr });
                }}
              />
            </div>
            <div className="pb-4">
              <RemoveBtn
                onClick={() => setDraft({ ...draft, support: draft.support.filter((_, x) => x !== i) })}
              />
            </div>
          </div>
        ))}
        <AddBtn
          onClick={() => setDraft({ ...draft, support: [...draft.support, { name: 'Nama', logo: '' }] })}
          label="Tambah Support"
        />
      </Card>

      <Card title="💰 Sponsor By">
        {draft.sponsor.map((p, i) => (
          <div key={i} className="flex flex-col sm:flex-row gap-3 mb-3 items-start sm:items-end">
            <div className="flex-1 w-full">
              <Input
                label={`Nama ${i + 1}`}
                value={p.name}
                onChange={(v) => {
                  const arr = [...draft.sponsor];
                  arr[i] = { ...arr[i], name: v };
                  setDraft({ ...draft, sponsor: arr });
                }}
              />
            </div>
            <div className="flex-1 w-full">
              <Input
                label="URL Logo"
                value={p.logo}
                onChange={(v) => {
                  const arr = [...draft.sponsor];
                  arr[i] = { ...arr[i], logo: v };
                  setDraft({ ...draft, sponsor: arr });
                }}
              />
            </div>
            <div className="pb-4">
              <RemoveBtn
                onClick={() => setDraft({ ...draft, sponsor: draft.sponsor.filter((_, x) => x !== i) })}
              />
            </div>
          </div>
        ))}
        <AddBtn
          onClick={() => setDraft({ ...draft, sponsor: [...draft.sponsor, { name: 'Nama', logo: '' }] })}
          label="Tambah Sponsor"
        />
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <SaveBtn onClick={save} label="Simpan Partners" />
        <button
          onClick={() => {
            if (confirm('Yakin reset semua data ke default? Data yang tersimpan akan hilang.')) {
              onReset();
              setDraft(DEFAULT_DATA.partners);
              showToast('Data berhasil direset ke default');
            }
          }}
          className="px-6 py-3 rounded-xl bg-red-500/10 text-red-500 border-2 border-red-500/20 text-xs font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition"
        >
          🔄 Reset Semua Data
        </button>
      </div>
    </div>
  );
}