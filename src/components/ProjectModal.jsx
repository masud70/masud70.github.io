import { useCallback, useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Github, ExternalLink } from 'lucide-react';
import RichText from '../lib/richText.jsx';
import { asset } from '../lib/useContent.js';

/**
 * Detail view for a single project. Opens when a project card is clicked.
 *
 * Shows the full (untruncated) description, the complete tech stack, any
 * highlight bullets, and an image gallery when the project has one.
 * Closes on Escape, backdrop click, or the X button; arrow keys move
 * through the gallery.
 */
export default function ProjectModal({ project, onClose }) {
  const [idx, setIdx] = useState(0);
  const images = Array.isArray(project?.images) ? project.images : [];

  useEffect(() => setIdx(0), [project]);

  const step = useCallback(
    (delta) => setIdx((i) => (i + delta + images.length) % images.length),
    [images.length]
  );

  useEffect(() => {
    if (!project) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (images.length > 1 && e.key === 'ArrowRight') step(1);
      else if (images.length > 1 && e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [project, onClose, step, images.length]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-ink/70 p-4 backdrop-blur-sm md:items-center md:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl rounded-xl border border-line bg-surface shadow-lift"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 rounded-full p-2 text-inkMute transition-colors hover:bg-surfaceAlt hover:text-ink"
        >
          <X size={20} />
        </button>

        <div className="p-6 md:p-8">
          <div className="pr-10">
            <div className="flex flex-wrap items-baseline gap-x-3">
              <h3 className="font-serif text-2xl font-semibold text-ink md:text-3xl">
                {project.title}
              </h3>
              {project.year && (
                <span className="font-mono text-sm text-inkMute">{project.year}</span>
              )}
            </div>
            {project.subtitle && (
              <p className="mt-1.5 text-[17px] text-accent">{project.subtitle}</p>
            )}
          </div>

          {images.length > 0 && (
            <div className="mt-6">
              <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-line bg-surfaceAlt">
                <img
                  src={asset(images[idx])}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => step(-1)}
                      aria-label="Previous image"
                      className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-canvas/85 p-2 text-ink shadow-soft transition-colors hover:bg-canvas"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() => step(1)}
                      aria-label="Next image"
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-canvas/85 p-2 text-ink shadow-soft transition-colors hover:bg-canvas"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="mt-3 flex justify-center gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIdx(i)}
                      aria-label={`Image ${i + 1}`}
                      className={[
                        'h-1.5 rounded-full transition-all',
                        i === idx ? 'w-6 bg-accent' : 'w-1.5 bg-line hover:bg-inkMute',
                      ].join(' ')}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {project.description && (
            <RichText
              as="div"
              className="mt-6 text-[17px] leading-[1.7] text-inkSoft prose-justify"
            >
              {project.description}
            </RichText>
          )}

          {Array.isArray(project.highlights) && project.highlights.length > 0 && (
            <ul className="mt-5 space-y-2">
              {project.highlights.map((h, i) => (
                <li key={i} className="flex gap-2.5 text-[16px] leading-relaxed text-inkSoft">
                  <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70" />
                  <RichText>{h}</RichText>
                </li>
              ))}
            </ul>
          )}

          {Array.isArray(project.stack) && project.stack.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 font-mono text-[12px] uppercase tracking-[0.18em] text-inkMute">
                Built with
              </p>
              <div className="flex flex-wrap gap-1.5">
                {project.stack.map((s, i) => (
                  <span
                    key={i}
                    className="rounded border border-line bg-surfaceAlt px-2.5 py-1 font-mono text-[13px] text-inkSoft"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(project.role || project.url) && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
              {project.role ? (
                <span className="text-[15px] text-inkMute">{project.role}</span>
              ) : <span />}
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-[15px] font-medium text-accentInk transition-opacity hover:opacity-90"
                >
                  {project.url.includes('github.com') ? <Github size={16} /> : <ExternalLink size={16} />}
                  View repository
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
