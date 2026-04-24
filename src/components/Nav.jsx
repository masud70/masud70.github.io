import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

/**
 * Nav — top bar + right-side mobile drawer.
 *
 * The drawer is portalled to document.body so it isn't trapped inside the
 * header's sticky/backdrop-filter stacking context (which caused an earlier
 * transparency bug where the page showed through the drawer).
 */
export default function Nav({ pages }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const location = useLocation();

  // Only portal once mounted (avoid SSR / first-paint issues)
  useEffect(() => { setMounted(true); }, []);

  // Close drawer on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Body scroll lock while drawer is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  // Close on Esc
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const drawer = (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[90] bg-ink-900/80 backdrop-blur-sm md:hidden"
          />
          <motion.aside
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="
              fixed top-0 right-0 bottom-0 z-[100]
              w-[78vw] max-w-xs
              bg-ink-800
              border-l border-em-500/30
              shadow-[0_0_60px_rgba(0,0,0,0.8)]
              md:hidden
              flex flex-col
            "
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-ink-500 bg-ink-800">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-em-400">
                Navigation
              </span>
              <button
                onClick={() => setOpen(false)}
                className="text-fog-300 hover:text-em-400 p-1"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>
            <ul className="flex-1 bg-ink-800 px-3 py-4 flex flex-col gap-1">
              {pages.map((p, i) => (
                <motion.li
                  key={p.route}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.05 + i * 0.04 }}
                >
                  <NavLink
                    to={p.route}
                    end
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      [
                        'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                        isActive
                          ? 'bg-em-500/10 text-em-400 font-semibold border border-em-500/30'
                          : 'text-fog-200 hover:bg-ink-700 border border-transparent',
                      ].join(' ')
                    }
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-em-500/70" />
                    {p.name}
                  </NavLink>
                </motion.li>
              ))}
            </ul>
            <div className="px-6 py-4 border-t border-ink-500 bg-ink-800 text-xs text-fog-400 font-mono">
              © {new Date().getFullYear()} Masud
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <header className="sticky top-0 z-30 bg-ink-900/85 backdrop-blur-md border-b border-ink-500/60">
        <nav className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between gap-6">
          <NavLink
            to="/"
            className="font-display text-lg font-bold tracking-tight flex items-center gap-2 group relative z-10"
          >
            <span className="w-8 h-8 rounded-lg bg-em-500 text-ink-900 font-display font-bold text-sm flex items-center justify-center shadow-emGlow group-hover:shadow-emGlowStrong transition-shadow">
              M
            </span>
            <span className="text-fog-100 group-hover:text-em-400 transition-colors">
              Masud<span className="text-em-500">.</span>
            </span>
          </NavLink>

          <ul className="hidden md:flex items-center gap-7 text-sm">
            {pages.map((p) => (
              <li key={p.route}>
                <NavLink
                  to={p.route}
                  end
                  className={({ isActive }) =>
                    [
                      'relative py-1 transition-colors',
                      isActive ? 'text-em-400 font-semibold' : 'text-fog-300 hover:text-fog-100',
                    ].join(' ')
                  }
                >
                  {({ isActive }) => (
                    <>
                      {p.name}
                      {isActive && (
                        <span className="absolute left-0 right-0 -bottom-1 h-px bg-em-500 shadow-emGlow" />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <button
            className="md:hidden text-fog-200 hover:text-em-400 p-1 relative z-10"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </nav>
      </header>

      {mounted && createPortal(drawer, document.body)}
    </>
  );
}
