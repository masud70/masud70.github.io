import { useEffect, useState } from 'react';

/** Resolve a public-relative path against Vite's configured base. */
export function withBase(p) {
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  return cleanBase + String(p).replace(/^\/+/, '');
}

/**
 * Resolve an asset path written in content (e.g. "assets/masud.jpg") to a URL
 * that works at any deploy base. Absolute URLs and data URIs pass through.
 */
export function asset(p) {
  if (!p || typeof p !== 'string') return p;
  if (/^https?:\/\//i.test(p) || p.startsWith('data:')) return p;
  return withBase(`home/${p.replace(/^\/+/, '').replace(/^home\//, '')}`);
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} fetching ${url}`);
  return res.json();
}

/**
 * Loads manifest.json, then every section file it references.
 *
 * Returns:
 *   sections – ordered array of { id, label, title, format, data }
 *   gallery  – ordered array of the same shape, for the /gallery route
 *
 * A file that fails to load or parse is skipped; the rest of the site renders.
 */
export function useContent() {
  const [state, setState] = useState({
    loading: true,
    error: null,
    sections: [],
    gallery: [],
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const manifest = await fetchJson(withBase('manifest.json'));

        const loadOne = async (entry) => {
          const file = typeof entry === 'string' ? entry : entry.file;
          try {
            const obj = await fetchJson(withBase(file));
            const format = obj.format || {};
            const data = obj.data;
            if (data === null || data === undefined) return null;
            if (Array.isArray(data) && data.length === 0) return null;
            return {
              file,
              id: format.section || (typeof entry === 'object' ? entry.id : null),
              label: format.label || null,
              title: format.title || null,
              format,
              data,
            };
          } catch {
            return null;
          }
        };

        const [sections, gallery] = await Promise.all([
          Promise.all((manifest.sections || []).map(loadOne)),
          Promise.all((manifest.gallery || []).map(loadOne)),
        ]);

        if (!cancelled) {
          setState({
            loading: false,
            error: null,
            sections: sections.filter(Boolean),
            gallery: gallery.filter(Boolean),
          });
        }
      } catch (err) {
        if (!cancelled) {
          setState({ loading: false, error: err, sections: [], gallery: [] });
        }
      }
    })();

    return () => { cancelled = true; };
  }, []);

  return state;
}
