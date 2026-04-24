import { motion } from 'framer-motion';

/**
 * SkillsGrid — specialized renderer for skills.
 * Supports two data shapes (both optional, renders whatever exists):
 *
 * 1) Array of { category, items: string[] }
 * 2) Flat array of strings
 */
export default function SkillsGrid({ data, showHeading = true }) {
  if (!data) return null;
  const items = Array.isArray(data) ? data : [data];
  if (items.length === 0) return null;

  const isCategoryShape = items[0] && typeof items[0] === 'object' && Array.isArray(items[0].items);

  return (
    <section className="pl-10 md:pl-14">
      {showHeading && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-8"
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold text-fog-100 tracking-tight">
            Skills
          </h2>
          <span className="flex-1 h-px bg-gradient-to-r from-em-500/50 via-em-500/20 to-transparent" />
        </motion.div>
      )}

      {isCategoryShape ? (
        <div className="grid sm:grid-cols-2 gap-5">
          {items.map((cat, i) => {
            if (!cat || !Array.isArray(cat.items) || cat.items.length === 0) return null;
            return (
              <motion.div
                key={cat.category || i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="
                  relative p-5 rounded-2xl
                  bg-ink-700/80 border border-ink-500
                  hover:border-em-500/60 hover:shadow-emGlow
                  transition-all duration-300
                "
              >
                {cat.category && (
                  <div className="font-mono text-xs uppercase tracking-[0.15em] text-em-400 mb-3">
                    {cat.category}
                  </div>
                )}
                <div className="flex flex-wrap gap-1.5">
                  {cat.items.map((skill, j) => (
                    <span
                      key={`${i}-${j}`}
                      className="
                        inline-flex items-center px-2.5 py-1 rounded-md
                        text-[13px] font-medium
                        bg-ink-600 text-fog-200
                        border border-ink-500
                        hover:border-em-500/50 hover:text-em-400
                        transition-colors
                      "
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {items.map((s, i) => (
            <span
              key={i}
              className="px-2.5 py-1 rounded-md text-[13px] bg-ink-600 text-fog-200 border border-ink-500"
            >
              {String(s)}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
