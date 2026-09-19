import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { asset } from '../lib/useContent.js';

/**
 * Gallery lives on its own route so the personal material stays clear of the
 * academic sections. Albums render as masonry-ish grids; clicking a photo
 * opens a keyboard-navigable lightbox.
 */
export default function Gallery({ albums }) {
  // lightbox = { images: string[], index: number } | null
  const [lightbox, setLightbox] = useState(null);

  const close = useCallback(() => setLightbox(null), []);
  const step = useCallback((delta) => {
    setLightbox((lb) => {
      if (!lb) return lb;
      const n = lb.images.length;
      return { ...lb, index: (lb.index + delta + n) % n };
    });
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [lightbox, close, step]);

  const groups = albums.flatMap((g) => (Array.isArray(g.data) ? g.data : []));
  const intro = albums[0]?.format?.intro;
  const title = albums[0]?.format?.title || 'Photo Gallery';

  return (
    <div className="py-14 md:py-20">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-mono text-inkMute transition-colors hover:text-accent"
      >
        <ArrowLeft size={13} />
        Back to portfolio
      </Link>

      <header className="mt-6 mb-12">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          {title}
        </h1>
        <div className="mt-3 h-px w-12 bg-accent" />
        {intro && <p className="mt-4 max-w-prose text-inkSoft">{intro}</p>}
      </header>

      {groups.length === 0 && (
        <p className="text-inkMute">
          No albums yet. Add a JSON file under <code className="font-mono text-accent">home/gallery/</code>.
        </p>
      )}

      <div className="space-y-14">
        {groups.map((album, ai) => (
          <section key={ai}>
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4">
              <h2 className="font-serif text-xl font-semibold text-ink">{album.album}</h2>
              <span className="font-mono text-xs text-inkMute">{album.year}</span>
            </div>
            {album.caption && (
              <p className="mb-5 max-w-prose text-sm text-inkSoft">{album.caption}</p>
            )}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {(album.images || []).map((src, i) => (
                <button
                  key={i}
                  onClick={() => setLightbox({ images: album.images, index: i })}
                  className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-line bg-surfaceAlt focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  aria-label={`Open image ${i + 1} of ${album.album}`}
                >
                  <img
                    src={asset(src)}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.currentTarget.closest('button').style.display = 'none'; }}
                  />
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <button
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full p-2 text-canvas/80 transition-colors hover:text-canvas"
          >
            <X size={24} />
          </button>

          {lightbox.images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); step(-1); }}
                aria-label="Previous image"
                className="absolute left-3 rounded-full bg-canvas/10 p-2.5 text-canvas transition-colors hover:bg-canvas/25 md:left-8"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); step(1); }}
                aria-label="Next image"
                className="absolute right-3 rounded-full bg-canvas/10 p-2.5 text-canvas transition-colors hover:bg-canvas/25 md:right-8"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          <img
            src={asset(lightbox.images[lightbox.index])}
            alt=""
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-lift"
          />

          {lightbox.images.length > 1 && (
            <span className="absolute bottom-5 font-mono text-xs text-canvas/70">
              {lightbox.index + 1} / {lightbox.images.length}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
