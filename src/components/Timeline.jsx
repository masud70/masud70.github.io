import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import InfoCard from './InfoCard.jsx';

/**
 * Timeline — vertical neon spine with pulsing dots, one card per row.
 *
 * `seeMore` (optional): { to, label } renders a button at the end of the
 * timeline that links to the dedicated subpage. Used on the homepage when
 * a section declares `truncateOnHome` in its schema.
 */
export default function Timeline({ items, sectionTitle, sectionFile, onOpen, seeMore }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <section className="relative">
      {sectionTitle && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-8 pl-10 md:pl-14"
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold text-fog-100 tracking-tight">
            {sectionTitle}
          </h2>
          <span className="flex-1 h-px bg-gradient-to-r from-em-500/50 via-em-500/20 to-transparent" />
        </motion.div>
      )}

      <div className="relative pl-10 md:pl-14">
        {/* Neon spine — height now shrinks to card rows only, not the See-more button */}
        <div
          aria-hidden
          className="absolute top-2 bottom-2 left-3 md:left-4 w-px bg-gradient-to-b from-em-500/0 via-em-500/70 to-em-500/0"
        />
        <div
          aria-hidden
          className="absolute top-2 bottom-2 left-3 md:left-4 w-px bg-em-500 blur-[6px] opacity-40 animate-pulseSlow"
        />

        <div className="flex flex-col gap-8">
          {items.map((item, i) => (
            <div key={`${sectionFile || 'sec'}-${i}`} className="relative">
              <span
                aria-hidden
                className="
                  absolute left-0 top-8 -translate-x-[calc(2.5rem-0.375rem)] md:-translate-x-[calc(3.5rem-0.375rem)]
                  w-3 h-3 rounded-full bg-em-400 ring-4 ring-em-500/20 animate-pulseDot
                "
              />
              <InfoCard item={item} index={i} onOpen={onOpen} />
            </div>
          ))}
        </div>

        {seeMore && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mt-8 flex"
          >
            <Link
              to={seeMore.to}
              className="
                group inline-flex items-center gap-2
                px-5 py-3 rounded-xl
                bg-ink-700/80 border border-em-500/40
                text-em-400 font-semibold text-sm
                hover:bg-em-500/10 hover:border-em-500 hover:shadow-emGlow
                transition-all
              "
            >
              {seeMore.label}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
