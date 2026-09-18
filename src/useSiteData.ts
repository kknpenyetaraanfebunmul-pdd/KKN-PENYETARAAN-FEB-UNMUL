import { useEffect, useState, useCallback } from 'react';
import { supabase } from './lib/supabase';
import type {
  SiteData,
  HeroData,
  FooterData,
  StrukturRow,
  ProgramRow,
  GalleryRow,
  ContactRow,
  PartnerRow,
} from './types';

const EMPTY_DATA: SiteData = {
  hero: { title: '', subtitle: '', buttonText: '', slides: [] },
  footer: { copyright: '', madeWith: '' },
  struktur: [],
  programs: [],
  gallery: [],
  contacts: [],
  supportBy: [],
  sponsorBy: [],
};

export function useSiteData() {
  const [data, setData] = useState<SiteData>(EMPTY_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setError(null);
      const [
        heroRes,
        footerRes,
        strukturRes,
        programsRes,
        galleryRes,
        contactsRes,
        partnersRes,
      ] = await Promise.all([
        supabase.from('site_settings').select('data').eq('section', 'hero').maybeSingle(),
        supabase.from('site_settings').select('data').eq('section', 'footer').maybeSingle(),
        supabase.from('struktur_kkn').select('*').order('urutan'),
        supabase.from('program_kerja').select('*').order('urutan'),
        supabase.from('gallery_items').select('*').order('urutan'),
        supabase.from('contact_links').select('*').order('urutan'),
        supabase.from('partners').select('*').order('urutan'),
      ]);

      const errors = [heroRes, footerRes, strukturRes, programsRes, galleryRes, contactsRes, partnersRes]
        .filter((r) => r.error)
        .map((r) => r.error!.message);
      if (errors.length > 0) {
        throw new Error(errors.join('; '));
      }

      const hero = heroRes.data?.data as HeroData | undefined;
      const footer = footerRes.data?.data as FooterData | undefined;
      const struktur = strukturRes.data as unknown as StrukturRow[];
      const programs = (programsRes.data as unknown as ProgramRow[]).map((p) => ({
        ...p,
        kegiatan: Array.isArray(p.kegiatan) ? p.kegiatan : [],
        info: p.info ?? { sasaran: '', jadwal: '', lokasi: '', target: '' },
      }));
      const gallery = galleryRes.data as unknown as GalleryRow[];
      const contacts = contactsRes.data as unknown as ContactRow[];
      const allPartners = partnersRes.data as unknown as PartnerRow[];

      setData({
        hero: hero ?? EMPTY_DATA.hero,
        footer: footer ?? EMPTY_DATA.footer,
        struktur: struktur ?? [],
        programs: programs ?? [],
        gallery: gallery ?? [],
        contacts: contacts ?? [],
        supportBy: (allPartners ?? []).filter((p) => p.grup === 'support'),
        sponsorBy: (allPartners ?? []).filter((p) => p.grup === 'sponsor'),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();

    const channel = supabase
      .channel('site-data-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_settings' },
        () => fetchAll()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'struktur_kkn' },
        () => fetchAll()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'program_kerja' },
        () => fetchAll()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'gallery_items' },
        () => fetchAll()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contact_links' },
        () => fetchAll()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'partners' },
        () => fetchAll()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAll]);

  return { data, loading, error, refresh: fetchAll };
}
