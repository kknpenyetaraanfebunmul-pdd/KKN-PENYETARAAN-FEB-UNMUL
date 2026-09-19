import { useState, useEffect, useCallback } from 'react';
import type { SiteContent, StrukturMember } from './types';
import { defaultContent } from './defaultContent';
import { supabase } from './lib/supabase';

const STORAGE_KEY = 'kkn-penyetaraan-content';
export const ADMIN_SESSION_KEY = 'kkn-admin-session';
export const ADMIN_PASSCODE = '110106';

// ============================================
// FUNGSI MIGRASI: Mengubah data lama ke format baru
// ============================================

// Deteksi apakah data masih format lama (role/description)
function isOldStrukturFormat(struktur: any[]): boolean {
  if (!Array.isArray(struktur) || struktur.length === 0) return false;
  const first = struktur[0];
  return 'role' in first || 'description' in first;
}

// Deteksi apakah members masih berupa string[] (bukan objek)
function isOldMembersFormat(members: any[]): boolean {
  if (!Array.isArray(members) || members.length === 0) return false;
  return typeof members[0] === 'string';
}

// Migrasi struktur ke format baru
function migrateStruktur(struktur: any[]): any[] {
  if (!Array.isArray(struktur)) return defaultContent.struktur;
  
  return struktur.map((item, idx) => {
    // Handle format sangat lama (role + description)
    if ('role' in item) {
      return {
        id: item.id || `st_${idx}`,
        jabatan: item.role || '',
        members: [{ name: item.description || '', nim: '', photo: '' }],
        urutan: item.urutan || idx + 1,
      };
    }
    
    // Handle format menengah (jabatan + members: string[])
    let newMembers: StrukturMember[] = [];
    if (Array.isArray(item.members)) {
      if (isOldMembersFormat(item.members)) {
        // Ubah string[] -> StrukturMember[]
        newMembers = item.members.map((name: string) => ({
          name: name || '',
          nim: '',
          photo: '',
        }));
      } else {
        // Sudah format baru, tapi pastikan propertinya lengkap
        newMembers = item.members.map((m: any) => ({
          name: m?.name || '',
          nim: m?.nim || '',
          photo: m?.photo || '',
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

// Sanitasi konten secara keseluruhan
function sanitizeContent(content: Partial<SiteContent>): SiteContent {
  const struktur = content.struktur 
    ? migrateStruktur(content.struktur as any[])
    : defaultContent.struktur;

  return {
    ...defaultContent,
    ...content,
    hero: { ...defaultContent.hero, ...content.hero },
    footer: { ...defaultContent.footer, ...content.footer },
    struktur,
    programs: content.programs || defaultContent.programs,
    gallery: content.gallery || defaultContent.gallery,
    contacts: content.contacts || defaultContent.contacts,
    supportBy: content.supportBy || defaultContent.supportBy,
    sponsorBy: content.sponsorBy || defaultContent.sponsorBy,
  } as SiteContent;
}

// ============================================
// CACHE MANAGEMENT
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
    // ignore write errors
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
          setLoading(false);
          return;
        }

        if (data?.content) {
          // SANITASI: Migrasi data lama ke format baru secara otomatis
          const sanitized = sanitizeContent(data.content as Partial<SiteContent>);
          setContent(sanitized);
          cacheContent(sanitized);
        }
      } catch (err) {
        console.error('Failed to load content:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateContent = useCallback((updater: (prev: SiteContent) => SiteContent) => {
    setContent((prev) => {
      const next = updater(prev);
      cacheContent(next);

      supabase
        .from('site_content')
        .update({ content: next })
        .eq('id', 1)
        .then(({ error }) => {
          if (error) console.error('Failed to save content to Supabase:', error);
        });

      return next;
    });
  }, []);

  const resetContent = useCallback(() => {
    setContent((prev) => {
      const next = defaultContent;
      cacheContent(next);

      supabase
        .from('site_content')
        .update({ content: next })
        .eq('id', 1)
        .then(({ error }) => {
          if (error) console.error('Failed to reset content in Supabase:', error);
        });

      return next;
    });
  }, []);

  return { content, updateContent, resetContent, loading };
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