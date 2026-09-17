import { createClient } from '@supabase/supabase-js';
import type { SiteData } from './types';
import { DEFAULT_DATA } from './data';

const supabaseUrl = 'https://pncpkgnehujdlomvgnfs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuY3BrZ25laHVqZGxvbXZnbmZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2NDMxNTAsImV4cCI6MjEwNTIxOTE1MH0._AUAJkR_aHB2fW7jyCG9K__5WmylcdKte8CIZ8ZIS9Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: { params: { eventsPerSecond: 2 } },
});

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
