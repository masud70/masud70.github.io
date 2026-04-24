import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ExternalLink, FileText } from 'lucide-react';
import { resolveAsset } from '../lib/useContent.js';
import { getIcon, DummyIcon } from '../lib/icons.js';

const KNOWN = new Set([
  'title', 'subtitle', 'description', 'date',
  'image', 'images', 'icon', 'link', 'pdf', 'tags',
]);

function nonEmpty(v) {
  if (v === null || v === undefined) return false;
  if (typeof v === 'string') return v.trim().length > 0;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === 'object') return Object.keys(v).length > 0;
  return true;
}
function formatLabel(k) {
  return k.replace(/[_-]+/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\b\w/g, (c) => c.toUpperCase());
}
function scalar(v) {
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  try { return JSON.stringify(v); } catch { return String(v); }
}

/**
 * Gallery — horizontally scrolling slideshow (right-to-left reveal) with
 * arrow controls and dot indicators. No auto-advance (user requested it be
 * "controllable"); arrows and dots are the control surface.
 */
function Gallery({ images }) {
  const [idx, setIdx] = useState(0);
  const count = images.length;

  const go = useCallback((delta) => {
    setIdx((i) => (i + delta + count) % count);
  }, [count]);

  useEffect(() => {
    if (count <= 1) return;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, count]);

  return (
    <div className="relative aspect-[16/9] bg-ink-800 overflow-hidden rounded-xl border border-ink-500">
      <AnimatePresence initial={false} mode="wait">
        <motion.img
          key={idx}
          src={resolveAsset(images[idx])}
          alt=""
          initial={{ x: '8%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '-8%', opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      </AnimatePresence>

      {count > 1 && (
        <>
          <button
            onClick={() => go(-1)}
            aria-label="Previous image"
            className="
              absolute left-2 top-1/2 -translate-y-1/2
              w-9 h-9 rounded-full
              bg-ink-900/70 backdrop-blur text-fog-100
              border border-em-500/40
              hover:bg-em-500 hover:text-ink-900 hover:border-em-500
              flex items-center justify-center
              transition-colors
            "
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next image"
            className="
              absolute right-2 top-1/2 -translate-y-1/2
              w-9 h-9 rounded-full
              bg-ink-900/70 backdrop-blur text-fog-100
              border border-em-500/40
              hover:bg-em-500 hover:text-ink-900 hover:border-em-500
              flex items-center justify-center
              transition-colors
            "
          >
            <ChevronRight size={18} />
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Go to image ${i + 1}`}
                className={[
                  'h-1.5 rounded-full transition-all',
                  i === idx ? 'w-6 bg-em-400' : 'w-1.5 bg-fog-100/40 hover:bg-fog-100/70',
                ].join(' ')}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * CardModal — renders when `item` is non-null. Shows full details including
 * all known fields + any custom fields, with an optional image gallery.
 *
 * Controls:
 *  • Esc or backdrop click closes
 *  • Left/Right arrows navigate gallery
 */
export default function CardModal({ item, onClose }) {
  // Lock scroll while open
  useEffect(() => {
    if (!item) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [item]);

  // Close on Esc
  useEffect(() => {
    if (!item) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [item, onClose]);

  const present = !!item;

  return (
    <AnimatePresence>
      {present && (
        <>
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-ink-900/80 backdrop-blur-md"
          />
          <div
            key="modal-shell"
            className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4 md:p-8 pointer-events-none"
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="
                pointer-events-auto relative
                w-full max-w-3xl max-h-[90vh]
                bg-ink-800 border border-em-500/40
                rounded-2xl shadow-emGlowStrong
                overflow-hidden flex flex-col
              "
            >
              <ModalBody item={item} onClose={onClose} />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function ModalBody({ item, onClose }) {
  if (!item) return null;
  const { title, subtitle, description, date, image, images, icon, link, pdf, tags } = item;
  const extras = Object.entries(item).filter(([k, v]) => !KNOWN.has(k) && nonEmpty(v));

  // Build gallery: prefer images[] array; fall back to single image
  const galleryImages = Array.isArray(images) ? images.filter(nonEmpty) : [];
  if (galleryImages.length === 0 && nonEmpty(image)) galleryImages.push(image);

  const IconComp = nonEmpty(icon) ? (getIcon(icon) || DummyIcon) : null;

  return (
    <>
      {/* Header */}
      <div className="relative px-6 md:px-8 py-5 border-b border-ink-500 flex items-start gap-4">
        {IconComp && (
          <div className="shrink-0 w-11 h-11 rounded-xl bg-em-500/10 border border-em-500/40 flex items-center justify-center text-em-400">
            <IconComp size={22} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          {nonEmpty(date) && (
            <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-em-400 mb-1">
              {scalar(date)}
            </div>
          )}
          {nonEmpty(title) && (
            <h2 className="font-display text-xl md:text-2xl font-bold text-fog-100 leading-tight">
              {scalar(title)}
            </h2>
          )}
          {nonEmpty(subtitle) && (
            <div className="mt-1 text-sm text-em-400/90 font-medium">{scalar(subtitle)}</div>
          )}
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="shrink-0 text-fog-300 hover:text-em-400 p-1 -mr-1 -mt-1"
        >
          <X size={22} />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="overflow-y-auto flex-1 px-6 md:px-8 py-6 space-y-6">
        {galleryImages.length > 0 && <Gallery images={galleryImages} />}

        {nonEmpty(description) && (
          <p className="text-[15px] text-fog-200 leading-relaxed whitespace-pre-line">
            {scalar(description)}
          </p>
        )}

        {nonEmpty(tags) && Array.isArray(tags) && (
          <div className="flex flex-wrap gap-1.5">
            {tags.filter(nonEmpty).map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium font-mono bg-em-500/10 text-em-400 border border-em-500/30"
              >
                {scalar(tag)}
              </span>
            ))}
          </div>
        )}

        {extras.length > 0 && (
          <dl className="grid grid-cols-[max-content,1fr] gap-x-6 gap-y-2 text-sm pt-2 border-t border-ink-500/70">
            {extras.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="font-mono text-xs uppercase tracking-wider text-fog-400 py-1">
                  {formatLabel(k)}
                </dt>
                <dd className="text-fog-200 break-words py-1">{scalar(v)}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      {/* Footer with links */}
      {(nonEmpty(link) || nonEmpty(pdf)) && (
        <div className="px-6 md:px-8 py-4 border-t border-ink-500 flex flex-wrap gap-3 bg-ink-700/50">
          {nonEmpty(link) && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-em-500 text-ink-900 font-semibold text-sm hover:bg-em-400 transition-colors"
            >
              View <ExternalLink size={14} />
            </a>
          )}
          {nonEmpty(pdf) && (
            <a
              href={resolveAsset(pdf)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-em-500/40 text-em-400 font-semibold text-sm hover:bg-em-500/10 hover:border-em-500 transition-colors"
            >
              PDF <FileText size={14} />
            </a>
          )}
        </div>
      )}
    </>
  );
}
