import React from 'react';
import { motion } from 'framer-motion';
import { resolveAsset } from '../lib/useContent.js';
import { getIcon, DummyIcon } from '../lib/icons.js';

/**
 * InfoCard — one card per row, anchored to the timeline.
 *
 * Feature set:
 *   • Recognized fields get first-class rendering: title, subtitle, description,
 *     date, image, icon, link, pdf, tags.
 *   • images[] array: picked up too (first image used as thumbnail, gallery in modal).
 *   • Unknown fields render as key/value rows at the bottom of the card.
 *   • If neither `icon` nor `image` is provided, a dummy sparkle icon is shown
 *     on the top-left avatar slot so no card looks visually naked.
 *   • Animation: single tween from right to final, no delay stagger (prevents
 *     the "quick jump after a few milliseconds" effect the user reported).
 *   • Click opens the modal via the onOpen callback.
 */

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

/** Truncate long descriptions on the card; full text lives in the modal. */
function clip(text, maxChars = 240) {
  if (!text || typeof text !== 'string') return text;
  if (text.length <= maxChars) return text;
  const cut = text.slice(0, maxChars);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 120 ? cut.slice(0, lastSpace) : cut) + '…';
}

export default function InfoCard({ item, index = 0, onOpen }) {
  if (!item || typeof item !== 'object') return null;

  const { title, subtitle, description, date, image, images, icon, link, pdf, tags } = item;

  // Thumbnail: images[0] if array given, else image field
  const thumb = (() => {
    if (Array.isArray(images) && images.length > 0 && nonEmpty(images[0])) return images[0];
    if (nonEmpty(image)) return image;
    return null;
  })();

  const IconComp = nonEmpty(icon) ? (getIcon(icon) || DummyIcon) : null;
  const showAvatarIcon = !thumb; // only show icon avatar when no image

  const extras = Object.entries(item).filter(([k, v]) => !KNOWN.has(k) && nonEmpty(v));

  const hasContent =
    nonEmpty(title) || nonEmpty(subtitle) || nonEmpty(description) || nonEmpty(date) ||
    !!thumb || nonEmpty(icon) || nonEmpty(link) || nonEmpty(pdf) || nonEmpty(tags) ||
    extras.length > 0;
  if (!hasContent) return null;

  const handleOpen = () => { if (onOpen) onOpen(item); };
  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOpen(); }
  };

  // FIX FOR "QUICK JUMP" ANIMATION:
  // • Only apply on-scroll reveal after the first viewport of cards.
  //   The top cards animate on mount via `animate` (no whileInView).
  // • Use linear index-based delay but capped, and a longer duration so
  //   movement is smoothly visible end-to-end.
  const useViewport = index >= 2;      // first 2 cards: animate immediately
  const delay = Math.min(index, 4) * 0.1;
  const duration = 0.7;
  const motionProps = useViewport
    ? {
        initial: { opacity: 0, x: 40 },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true, margin: '-10% 0px -10% 0px' },
      }
    : {
        initial: { opacity: 0, x: 40 },
        animate: { opacity: 1, x: 0 },
      };

  return (
    <motion.article
      {...motionProps}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      onClick={handleOpen}
      onKeyDown={onKeyDown}
      role="button"
      tabIndex={0}
      aria-label={typeof title === 'string' ? `Open details for ${title}` : 'Open details'}
      className="
        group relative cursor-pointer
        bg-ink-700/80 backdrop-blur-sm
        border border-ink-500
        rounded-2xl overflow-hidden
        shadow-card
        transition-all duration-300
        hover:border-em-500/60 hover:shadow-emGlow
        hover:-translate-y-0.5
        focus:outline-none focus-visible:border-em-500 focus-visible:shadow-emGlow
      "
    >
      {/* Timeline connector line (horizontal, pointing back to the spine) */}
      <span
        aria-hidden
        className="hidden md:block absolute left-0 top-10 -translate-x-full w-8 h-px bg-gradient-to-l from-em-500/80 to-em-500/0"
      />
      <span
        aria-hidden
        className="absolute top-0 right-0 w-24 h-24 rounded-full bg-em-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      />

      <div className="md:flex">
        {thumb && (
          <div className="md:w-2/5 md:max-w-[340px] shrink-0">
            <div className="relative aspect-[16/10] md:aspect-auto md:h-full bg-ink-600 overflow-hidden">
              <img
                src={resolveAsset(thumb)}
                alt={typeof title === 'string' ? title : ''}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-ink-700/80 md:to-ink-700" />
            </div>
          </div>
        )}

        <div className="p-6 md:p-7 flex-1 flex flex-col gap-2 min-w-0">
          {/* Top row: icon avatar (only when no thumbnail) + date */}
          <div className="flex items-center gap-3">
            {showAvatarIcon && (
              <div className="shrink-0 w-10 h-10 rounded-xl bg-em-500/10 border border-em-500/40 flex items-center justify-center text-em-400">
                {IconComp ? <IconComp size={18} /> : <DummyIcon size={18} />}
              </div>
            )}
            {nonEmpty(date) && (
              <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.15em] text-em-400">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-em-400 animate-pulseSlow" />
                {scalar(date)}
              </div>
            )}
          </div>

          {nonEmpty(title) && (
            <h3 className="font-display text-xl md:text-2xl font-semibold text-fog-100 leading-tight mt-1">
              {scalar(title)}
            </h3>
          )}

          {nonEmpty(subtitle) && (
            <div className="text-sm font-medium text-em-400/90">{scalar(subtitle)}</div>
          )}

          {nonEmpty(description) && (
            <p className="text-[15px] text-fog-200/90 leading-relaxed mt-1 whitespace-pre-line text-justify">
              {clip(scalar(description))}
            </p>
          )}

          {nonEmpty(tags) && Array.isArray(tags) && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {tags.filter(nonEmpty).map((tag, i) => (
                <span
                  key={`${i}-${String(tag)}`}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium font-mono bg-em-500/10 text-em-400 border border-em-500/30"
                >
                  {scalar(tag)}
                </span>
              ))}
            </div>
          )}

          {/* Custom fields shown on the card (compact). Full version in modal. */}
          {extras.length > 0 && (
            <dl className="mt-4 grid grid-cols-[max-content,1fr] gap-x-4 gap-y-1.5 text-xs">
              {extras.slice(0, 3).map(([k, v]) => (
                <React.Fragment key={k}>
                  <dt className="font-mono uppercase tracking-wider text-fog-400">
                    {formatLabel(k)}
                  </dt>
                  <dd className="text-fog-200 break-words">{scalar(v)}</dd>
                </React.Fragment>
              ))}
              {extras.length > 3 && (
                <div className="col-span-2 text-[11px] font-mono text-fog-400 pt-1">
                  +{extras.length - 3} more
                </div>
              )}
            </dl>
          )}

          <div className="flex items-center justify-between mt-5 pt-4 border-t border-ink-500/70">
            <span className="text-xs font-mono text-em-400 inline-flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
              View details
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
            {/* External-action links live in the modal footer, not the card,
                so the card has a single predictable click target. */}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
