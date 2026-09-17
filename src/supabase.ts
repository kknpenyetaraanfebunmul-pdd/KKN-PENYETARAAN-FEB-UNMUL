import { createClient } from '@supabase/supabase-js';
import type { SiteData } from './types';
import { DEFAULT_DATA } from './data';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'ENV MISSING: VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY kosong. ' +
    `Got URL=${supabaseUrl ? 'set' : 'empty'}, KEY=${supabaseAnonKey ? 'set' : 'empty'}. ` +
    'Pastikan env var diset di Vercel project settings (bukan .env local saja).'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: { params: { eventsPerSecond: 2 } },
});

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

const TABLE = 'site_data';
const KEY = 'main';
const STORAGE_KEY = 'kkn_site_data_v1';

export function getLocalData(): SiteData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as SiteData;
  } catch {
    // ignore
  }
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

export function setLocalData(data: SiteData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export async function loadData(): Promise<SiteData> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('content')
    .eq('key', KEY)
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    const initial = JSON.parse(JSON.stringify(DEFAULT_DATA));
    await saveData(initial);
    return initial;
  }
  return data.content as SiteData;
}

export async function saveData(content: SiteData): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .upsert({ key: KEY, content }, { onConflict: 'key' });
  if (error) throw error;
  setLocalData(content);
}

export function subscribeToData(
  onUpdate: (data: SiteData) => void
): () => void {
  const channel = supabase
    .channel(`site_data_changes`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: TABLE, filter: `key=eq.${KEY}` },
      (payload) => {
        const row = payload.new as { content: SiteData } | null;
        if (row?.content) onUpdate(row.content);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
