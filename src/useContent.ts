import { useState, useEffect, useCallback } from 'react';
import type { SiteContent } from './types';
import { defaultContent } from './defaultContent';
import { supabase } from './lib/supabase';

const STORAGE_KEY = 'kkn-penyetaraan-content';
export const ADMIN_SESSION_KEY = 'kkn-admin-session';
export const ADMIN_PASSCODE = '110106';

function loadFromCache(): SiteContent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SiteContent>;
    return {
      ...defaultContent,
      ...parsed,
      hero: { ...defaultContent.hero, ...parsed.hero },
      footer: { ...defaultContent.footer, ...parsed.footer },
    };
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
          const dbContent = data.content as SiteContent;
          const merged: SiteContent = {
            ...defaultContent,
            ...dbContent,
            hero: { ...defaultContent.hero, ...dbContent.hero },
            footer: { ...defaultContent.footer, ...dbContent.footer },
          };
          setContent(merged);
          cacheContent(merged);
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

export function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
