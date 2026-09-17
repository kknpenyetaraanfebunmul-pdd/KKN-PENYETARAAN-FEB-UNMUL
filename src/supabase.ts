import { createClient } from '@supabase/supabase-js';

/* ============================================
   KONFIGURASI SUPABASE
   
   Ganti 2 value di bawah dengan milik kamu:
   - SUPABASE_URL: dari Settings → API → Project URL
   - SUPABASE_ANON_KEY: dari Settings → API → anon public key
   ============================================ */

const SUPABASE_URL = 'https://yvxnnvkwmcpgecznpdji.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2eG5udmt3bWNwZ2Vjem5wZGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2MzYxNTYsImV4cCI6MjEwNTIxMjE1Nn0.E-aWsSFgQydd0HoUbYp-eHg-VubAufqs81j942aSUSI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ============================================
   FUNGSI-FUNGSI HELPER UNTUK DATA
   ============================================ */

const TABLE_NAME = 'site_data';
const ROW_KEY = 'main';

/**
 * Ambil data dari Supabase
 * Return null kalau belum ada / error
 */
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

/**
 * Simpan data ke Supabase (upsert)
 * Return true kalau berhasil
 */
export async function saveSiteData(payload: any): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(TABLE_NAME)
      .upsert(
        {
          key: ROW_KEY,
          data: payload,
          updated_at: new Date().toISOString(),
        },
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

/**
 * Subscribe ke perubahan real-time (opsional)
 * Callback akan dipanggil tiap kali data di Supabase berubah
 */
export function subscribeToChanges(callback: (newData: any) => void) {
  const channel = supabase
    .channel('site_data_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: TABLE_NAME,
        filter: `key=eq.${ROW_KEY}`,
      },
      (payload: any) => {
        if (payload.new?.data) {
          callback(payload.new.data);
        }
      }
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
}