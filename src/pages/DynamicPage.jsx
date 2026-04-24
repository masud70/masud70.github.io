import { useState } from 'react';
import { motion } from 'framer-motion';
import Timeline from '../components/Timeline.jsx';
import BioHero from '../components/BioHero.jsx';
import SkillsGrid from '../components/SkillsGrid.jsx';
import CardModal from '../components/CardModal.jsx';

/**
 * DynamicPage — routes sections to specialized renderers.
 *
 * Homepage truncation (spec #3):
 *   Sections can declare in their FORMAT block:
 *     "truncateOnHome": 2      // limit to N items when shown on "/"
 *     "seeMoreLink": "/projects"  // link target for the "See all" button
 *   Truncation is applied ONLY on the homepage route and ONLY when the
 *   section has MORE items than the limit. On the dedicated subpage,
 *   the full list renders.
 */
export default function DynamicPage({ page }) {
  const [modalItem, setModalItem] = useState(null);

  if (!page) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 text-center text-fog-400">
        Page not found.
      </div>
    );
  }

  const renderable = page.sections.filter((section) => {
    const items = Array.isArray(section.data) ? section.data : [section.data];
    return items.some((it) => it && typeof it === 'object' && Object.keys(it).length > 0);
  });

  if (renderable.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 text-center">
        <h1 className="font-display text-3xl font-bold text-fog-100 mb-2">{page.name}</h1>
        <p className="text-fog-400">No content yet.</p>
      </div>
    );
  }

  const isHome = page.route === '/';
  const isSubpage = !isHome;

  const singleMatchingSection =
    isSubpage &&
    renderable.length === 1 &&
    renderable[0].title.toLowerCase() === page.name.toLowerCase();

  const startsWithBio = renderable[0]?.schema?.section?.toLowerCase?.() === 'bio';

  return (
    <>
      {startsWithBio && <BioHero data={renderable[0].data} />}

      {/* Subpage header — only the big heading, no breadcrumb anymore (spec #5) */}
      {isSubpage && (
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto px-6 md:px-10 pt-14 md:pt-20 pb-8"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold text-fog-100 tracking-tight">
            {page.name}
          </h1>
          <div className="mt-4 h-px w-20 bg-em-500 shadow-emGlow" />
        </motion.header>
      )}

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col pb-20">
          {renderable.map((section, sIdx) => {
            if (sIdx === 0 && startsWithBio) return null;

            const hint = section.schema?.section?.toLowerCase?.();
            const items = Array.isArray(section.data) ? section.data : [section.data];
            const validItems = items.filter(
              (it) => it && typeof it === 'object' && Object.keys(it).length > 0
            );
            if (validItems.length === 0) return null;

            const isFirstVisible =
              (startsWithBio && sIdx === 1) || (!startsWithBio && sIdx === 0);

            const showTitle = !(singleMatchingSection && sIdx === 0);

            // Truncation logic (spec #3)
            const limit = Number(section.schema?.truncateOnHome);
            const seeMoreLink = section.schema?.seeMoreLink || null;
            const shouldTruncate =
              isHome && Number.isFinite(limit) && limit > 0 && validItems.length > limit;
            const displayItems = shouldTruncate ? validItems.slice(0, limit) : validItems;
            const seeMore = shouldTruncate && seeMoreLink
              ? { to: seeMoreLink, label: `See all ${section.title.toLowerCase()} (${validItems.length})` }
              : null;

            let content;
            if (hint === 'skills') {
              content = (
                <SkillsGrid
                  data={section.data}
                  showHeading={showTitle}
                />
              );
            } else {
              content = (
                <Timeline
                  items={displayItems}
                  sectionTitle={showTitle ? section.title : null}
                  sectionFile={section.file}
                  onOpen={setModalItem}
                  seeMore={seeMore}
                />
              );
            }

            return (
              <div key={section.file} className={isFirstVisible ? 'pt-10 md:pt-14' : ''}>
                {!isFirstVisible && <SectionSeparator />}
                {content}
              </div>
            );
          })}
        </div>
      </div>

      <CardModal item={modalItem} onClose={() => setModalItem(null)} />
    </>
  );
}

function SectionSeparator() {
  return (
    <div className="relative py-14 md:py-20 flex items-center justify-center" aria-hidden>
      <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-em-500/40 to-transparent" />
      <div className="relative flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-em-500/60" />
        <span className="w-2 h-2 rotate-45 bg-em-500 shadow-emGlow" />
        <span className="w-1.5 h-1.5 rounded-full bg-em-500/60" />
      </div>
    </div>
  );
}
