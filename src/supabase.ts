import { createClient } from '@supabase/supabase-js';

/* ============================================
   KONFIGURASI SUPABASE
   Mengambil dari Vercel Environment Variables
   (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY)
   ============================================ */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    '⚠️ Supabase env vars tidak ditemukan! Pastikan sudah ditambahkan di Vercel Environment Variables atau buat file .env.local'
  );
}

export const supabase = createClient(SUPABASE_URL || '', SUPABASE_ANON_KEY || '');

const TABLE_NAME = 'site_data';
const ROW_KEY = 'main';

/** Ambil data dari Supabase */
export async function fetchSiteData(): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('data')
      .eq('key', ROW_KEY)
      .single();
    if (error) {
      console.warn('Fetch error:', error.message);
      return null;
    }
    return data?.data ?? null;
  } catch (err) {
    console.warn('Fetch exception:', err);
    return null;
  }
}

/** Simpan data ke Supabase */
export async function saveSiteData(payload: any): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(TABLE_NAME)
      .upsert(
        { key: ROW_KEY, data: payload, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      );
    if (error) {
      console.error('Save error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Save exception:', err);
    return false;
  }
}

/** Subscribe perubahan real-time */
export function subscribeToChanges(callback: (newData: any) => void) {
  const channel = supabase
    .channel('site_data_changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: TABLE_NAME, filter: `key=eq.${ROW_KEY}` },
      (payload: any) => {
        if (payload.new?.data) callback(payload.new.data);
      }
    )
    .subscribe();
  return () => {
    supabase.removeChannel(channel);
  };
}