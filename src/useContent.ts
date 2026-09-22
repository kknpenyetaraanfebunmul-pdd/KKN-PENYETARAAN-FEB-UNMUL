import { useState, useEffect, useCallback } from 'react';
import type { SiteContent, StrukturMember, PartnerRow, ProgramRow } from './types';
import { defaultContent } from './defaultContent';
import { supabase } from './lib/supabase';

const STORAGE_KEY = 'kkn-penyetaraan-content';
export const ADMIN_SESSION_KEY = 'kkn-admin-session';
export const ADMIN_PASSCODE = '110106';

// ============================================
// FUNGSI MIGRASI
// ============================================

function isOldMembersFormat(members: any[]): boolean {
  if (!Array.isArray(members) || members.length === 0) return false;
  return typeof members[0] === 'string';
}

function migrateStruktur(struktur: any[]): any[] {
  if (!Array.isArray(struktur)) return defaultContent.struktur;

  return struktur.map((item, idx) => {
    if ('role' in item) {
      return {
        id: item.id || `st_${idx}`,
        jabatan: item.role || '',
        members: [{ name: item.description || '', nim: '', photo: '' }],
        urutan: item.urutan || idx + 1,
      };
    }

    let newMembers: StrukturMember[] = [];
    if (Array.isArray(item.members)) {
      if (isOldMembersFormat(item.members)) {
        newMembers = item.members.map((name: string) => ({
          name: name || '', nim: '', photo: '',
        }));
      } else {
        newMembers = item.members.map((m: any) => ({
          name: m?.name || '', nim: m?.nim || '', photo: m?.photo || '',
        }));
      }
    }

    return {
      id: item.id || `st_${idx}`,
      jabatan: item.jabatan || '',
      members: newMembers.length > 0 ? newMembers : [{ name: '', nim: '', photo: '' }],
      urutan: item.urutan || idx + 1,
    };
  });
}

// === MIGRASI PROGRAM (BARU) ===
function migratePrograms(programs: any[]): ProgramRow[] {
  if (!Array.isArray(programs)) return defaultContent.programs;

  return programs.map((p, idx) => ({
    id: p.id || `p_${idx}`,
    key: p.key || `program_${idx}`,
    icon: p.icon || '📌',
    judul: p.judul || p.title || '',
    subjudul: p.subjudul || p.shortDesc || '',
    deskripsi_lengkap: p.deskripsi_lengkap || p.fullDesc || '',
    kegiatan: Array.isArray(p.kegiatan) ? p.kegiatan : (Array.isArray(p.activities) ? p.activities : []),
    info: p.info && typeof p.info === 'object'
      ? {
          sasaran: p.info.sasaran || '',
          jadwal: p.info.jadwal || '',
          lokasi: p.info.lokasi || '',
          target: p.info.target || '',
        }
      : { sasaran: '', jadwal: '', lokasi: '', target: '' },
    urutan: p.urutan || idx + 1,
  }));
}

function migratePartners(partners: any[], grup: 'support' | 'sponsor'): PartnerRow[] {
  if (!Array.isArray(partners)) return [];
  return partners.map((p, idx) => ({
    id: p.id || `p_${idx}`,
    grup: p.grup || grup,
    nama: p.nama || p.name || '',
    logo_url: p.logo_url || p.logo || '',
    urutan: p.urutan || idx + 1,
  }));
}

function sanitizeContent(content: Partial<SiteContent>): SiteContent {
  const struktur = content.struktur
    ? migrateStruktur(content.struktur as any[])
    : defaultContent.struktur;

  const programs = content.programs
    ? migratePrograms(content.programs as any[])
    : defaultContent.programs;

  const supportBy = content.supportBy
    ? migratePartners(content.supportBy as any[], 'support')
    : defaultContent.supportBy;

  const sponsorBy = content.sponsorBy
    ? migratePartners(content.sponsorBy as any[], 'sponsor')
    : defaultContent.sponsorBy;

  return {
    ...defaultContent,
    ...content,
    hero: { ...defaultContent.hero, ...content.hero },
    footer: { ...defaultContent.footer, ...content.footer },
    struktur,
    programs,
    supportBy,
    sponsorBy,
    gallery: content.gallery || defaultContent.gallery,
    contacts: content.contacts || defaultContent.contacts,
  } as SiteContent;
}

// ============================================
// CACHE
// ============================================

function loadFromCache(): SiteContent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SiteContent>;
    return sanitizeContent(parsed);
  } catch {
    return null;
  }
}

function cacheContent(content: SiteContent) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  } catch {
    // ignore
  }
}

// ============================================
// HOOK UTAMA
// ============================================

export function useContent() {
  const [content, setContent] = useState<SiteContent>(() => {
    if (typeof window === 'undefined') return defaultContent;
    return loadFromCache() ?? defaultContent;
  });
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { data, error } = await supabase
          .from('site_content')
          .select('content')
          .eq('id', 1)
          .maybeSingle();

        if (cancelled) return;

        if (error) {
          console.error('Failed to load content from Supabase:', error);
          setSyncError(`Gagal load dari server: ${error.message}`);
          setLoading(false);
          return;
        }

        if (data?.content) {
          const sanitized = sanitizeContent(data.content as Partial<SiteContent>);
          setContent(sanitized);
          cacheContent(sanitized);
        } else {
          console.warn('Supabase row kosong, auto-create dengan default content');
          await supabase
            .from('site_content')
            .upsert({ id: 1, content: defaultContent });
        }
      } catch (err) {
        console.error('Failed to load content:', err);
        setSyncError('Gagal terhubung ke server');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateContent = useCallback(async (updater: (prev: SiteContent) => SiteContent) => {
    let nextContent: SiteContent | null = null;

    setContent((prev) => {
      nextContent = updater(prev);
      cacheContent(nextContent);
      return nextContent;
    });

    if (nextContent) {
      const { error } = await supabase
        .from('site_content')
        .upsert({ id: 1, content: nextContent }, { onConflict: 'id' });

      if (error) {
        console.error('❌ Gagal simpan ke Supabase:', error);
        setSyncError(`Gagal simpan: ${error.message}`);
        alert(`⚠️ GAGAL SIMPAN KE SERVER!\n\n${error.message}`);
      } else {
        setSyncError(null);
      }
    }
  }, []);

  const resetContent = useCallback(async () => {
    setContent(defaultContent);
    cacheContent(defaultContent);

    const { error } = await supabase
      .from('site_content')
      .upsert({ id: 1, content: defaultContent }, { onConflict: 'id' });

    if (error) {
      console.error('❌ Gagal reset di Supabase:', error);
      setSyncError(`Gagal reset: ${error.message}`);
      alert(`⚠️ GAGAL RESET DI SERVER!\n\n${error.message}`);
    } else {
      setSyncError(null);
    }
  }, []);

  const forceSyncToServer = useCallback(async () => {
    const cached = loadFromCache();
    if (!cached) {
      alert('Tidak ada data di cache browser.');
      return;
    }

    const { error } = await supabase
      .from('site_content')
      .upsert({ id: 1, content: cached }, { onConflict: 'id' });

    if (error) {
      alert(`Gagal force sync: ${error.message}`);
    } else {
      alert('✅ Berhasil sync data lokal ke server!');
    }
  }, []);

  return {
    content,
    updateContent,
    resetContent,
    loading,
    syncError,
    forceSyncToServer,
  };
}

// ============================================
// UTILITIES
// ============================================

export function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}