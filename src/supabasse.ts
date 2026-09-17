import { createClient } from '@supabase/supabase-js';
import type { SiteData } from './types';
import { DEFAULT_DATA } from './data';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const LOCAL_KEY = 'kkn_local_data_v2';

export function getLocalData(): SiteData {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) return { ...DEFAULT_DATA, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_DATA;
}

export function setLocalData(data: SiteData) {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(data)); } catch {}
}

export async function loadData(): Promise<SiteData> {
  const [heroR, strukturR, programR, galleryR, contactR, partnerR] = await Promise.all([
    supabase.from('hero').select('*').eq('id', 1).single(),
    supabase.from('struktur').select('*').order('sort_order'),
    supabase.from('programs').select('*').order('sort_order'),
    supabase.from('gallery').select('*').order('sort_order'),
    supabase.from('contact').select('*').eq('id', 1).single(),
    supabase.from('partners').select('*').order('sort_order'),
  ]);

  const h = heroR.data;
  const c = contactR.data;
  const parts = partnerR.data || [];

  return {
    hero: {
      line1: h?.line1 ?? DEFAULT_DATA.hero.line1,
      line2: h?.line2 ?? DEFAULT_DATA.hero.line2,
      description: h?.description ?? DEFAULT_DATA.hero.description,
      slideshow: Array.isArray(h?.slideshow) && h.slideshow.length
        ? h.slideshow
        : DEFAULT_DATA.hero.slideshow,
    },
    struktur: (strukturR.data || []).map((s: any) => ({
      id: s.id, jabatan: s.jabatan, deskripsi: s.deskripsi,
    })),
    program: (programR.data || []).map((p: any) => ({
      id: p.id, icon: p.icon, title: p.title, shortDesc: p.short_desc,
      category: p.category, subtitle: p.subtitle, description: p.description,
      activities: p.activities, info: p.info,
    })),
    gallery: (galleryR.data || []).map((g: any) => ({
      id: g.id, type: g.type, src: g.src, title: g.title, desc: g.desc,
    })),
    contact: {
      instagramUsername: c?.instagram_username ?? DEFAULT_DATA.contact.instagramUsername,
      instagramUrl: c?.instagram_url ?? DEFAULT_DATA.contact.instagramUrl,
      tiktokUsername: c?.tiktok_username ?? DEFAULT_DATA.contact.tiktokUsername,
      tiktokUrl: c?.tiktok_url ?? DEFAULT_DATA.contact.tiktokUrl,
      email: c?.email ?? DEFAULT_DATA.contact.email,
    },
    partners: {
      support: parts.filter((p: any) => p.partner_type === 'support')
        .map((p: any) => ({ id: p.id, name: p.name, logo: p.logo })),
      sponsor: parts.filter((p: any) => p.partner_type === 'sponsor')
        .map((p: any) => ({ id: p.id, name: p.name, logo: p.logo })),
    },
  };
}

export async function saveData(data: SiteData): Promise<boolean> {
  try {
    await supabase.from('hero').upsert({
      id: 1,
      line1: data.hero.line1,
      line2: data.hero.line2,
      description: data.hero.description,
      slideshow: data.hero.slideshow,
    });

    await supabase.from('contact').upsert({
      id: 1,
      instagram_username: data.contact.instagramUsername,
      instagram_url: data.contact.instagramUrl,
      tiktok_username: data.contact.tiktokUsername,
      tiktok_url: data.contact.tiktokUrl,
      email: data.contact.email,
    });

    const wipe = '00000000-0000-0000-0000-000000000000';

    await supabase.from('struktur').delete().neq('id', wipe);
    if (data.struktur.length) {
      await supabase.from('struktur').insert(
        data.struktur.map((s, i) => ({ jabatan: s.jabatan, deskripsi: s.deskripsi, sort_order: i }))
      );
    }

    await supabase.from('programs').delete().neq('id', wipe);
    if (data.program.length) {
      await supabase.from('programs').insert(
        data.program.map((p, i) => ({
          icon: p.icon, title: p.title, short_desc: p.shortDesc,
          category: p.category, subtitle: p.subtitle, description: p.description,
          activities: p.activities, info: p.info, sort_order: i,
        }))
      );
    }

    await supabase.from('gallery').delete().neq('id', wipe);
    if (data.gallery.length) {
      await supabase.from('gallery').insert(
        data.gallery.map((g, i) => ({
          type: g.type, src: g.src, title: g.title, desc: g.desc, sort_order: i,
        }))
      );
    }

    await supabase.from('partners').delete().neq('id', wipe);
    const allP = [
      ...data.partners.support.map((p, i) => ({ partner_type: 'support', name: p.name, logo: p.logo, sort_order: i })),
      ...data.partners.sponsor.map((p, i) => ({ partner_type: 'sponsor', name: p.name, logo: p.logo, sort_order: i })),
    ];
    if (allP.length) await supabase.from('partners').insert(allP);

    return true;
  } catch (err) {
    console.error('saveData error:', err);
    return false;
  }
}

export function subscribeToData(cb: (data: SiteData) => void): () => void {
  const channel = supabase
    .channel('kkn_realtime')
    .on('postgres_changes', { event: '*', schema: 'public' }, async () => {
      cb(await loadData());
    })
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}