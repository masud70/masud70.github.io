import { useEffect, useState } from 'react';
import { parseMarkdown, titleFromPath } from './parseMarkdown.js';

function withBase(p) {
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : base + '/';
  return cleanBase + p.replace(/^\/+/, '');
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.text();
}

export function useContent() {
  const [state, setState] = useState({ loading: true, error: null, pages: [] });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const manifest = JSON.parse(await fetchText(withBase('manifest.json')));
        const rawPages = Array.isArray(manifest.pages) ? manifest.pages : [];

        const pages = await Promise.all(
          rawPages.map(async (page) => {
            const files = Array.isArray(page.files) ? page.files : [];
            const sections = await Promise.all(
              files.map(async (filePath) => {
                try {
                  const raw = await fetchText(withBase(filePath));
                  const parsed = parseMarkdown(raw);
                  if (!parsed) return null;
                  return {
                    file: filePath,
                    title: titleFromPath(filePath),
                    schema: parsed.schema,
                    data: parsed.data,
                  };
                } catch {
                  return null;
                }
              })
            );
            return {
              route: page.route,
              name: page.name,
              sections: sections.filter(Boolean),
            };
          })
        );

        if (!cancelled) setState({ loading: false, error: null, pages });
      } catch (err) {
        if (!cancelled) setState({ loading: false, error: err, pages: [] });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

/** Resolve a relative asset path (e.g. "assets/portrait.jpg") to a URL
 *  that works under the current BASE_URL, so authors can reference
 *  /home/assets/* from inside their Markdown without thinking about
 *  deployment paths. Absolute URLs pass through unchanged. */
export function resolveAsset(pathLike) {
  if (!pathLike || typeof pathLike !== 'string') return pathLike;
  if (/^https?:\/\//i.test(pathLike) || pathLike.startsWith('data:')) return pathLike;
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : base + '/';
  const clean = pathLike.replace(/^\/+/, '').replace(/^home\//, '');
  return cleanBase + 'home/' + clean;
}
