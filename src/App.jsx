import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Nav from './components/Nav.jsx';
import DynamicPage from './pages/DynamicPage.jsx';
import { useContent } from './lib/useContent.js';

export default function App() {
  const { loading, error, pages } = useContent();

  // Pull footer contact info from the bio section if present, so it stays in
  // sync with whatever the user puts in their Markdown (no hardcoding).
  const bioSection = pages
    .flatMap((p) => p.sections)
    .find((s) => s.schema?.section?.toLowerCase?.() === 'bio');
  const bioData = bioSection
    ? (Array.isArray(bioSection.data) ? bioSection.data[0] : bioSection.data)
    : null;
  const contact = {
    name: bioData?.name || '',
    email: bioData?.email || '',
    github: bioData?.github || '',
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-ink-900 text-fog-200 font-sans antialiased relative">
        {/* Ambient background — fixed, behind everything */}
        <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[36rem] h-[36rem] rounded-full bg-em-500/10 blur-[120px] animate-floatSlow" />
          <div className="absolute top-1/3 -right-40 w-[32rem] h-[32rem] rounded-full bg-em-500/5 blur-[120px] animate-floatSlow" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-0 left-1/4 w-[28rem] h-[28rem] rounded-full bg-em-500/5 blur-[120px] animate-floatSlow" style={{ animationDelay: '4s' }} />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <Nav pages={pages} />

          <main className="flex-1">
            {loading && (
              <div className="max-w-7xl mx-auto px-6 md:px-10 py-24 text-center">
                <div className="inline-flex items-center gap-3 text-fog-300">
                  <span className="w-2 h-2 rounded-full bg-em-400 animate-pulseDot" />
                  <span className="font-mono text-sm">Loading content…</span>
                </div>
              </div>
            )}

            {!loading && error && (
              <div className="max-w-7xl mx-auto px-6 md:px-10 py-24 text-center">
                <h2 className="font-display text-2xl font-bold text-fog-100 mb-2">
                  Couldn't load content
                </h2>
                <p className="text-fog-400 text-sm">{error.message || 'Unknown error'}</p>
              </div>
            )}

            {!loading && !error && (
              <Routes>
                {pages.map((p) => (
                  <Route
                    key={p.route}
                    path={p.route}
                    element={<DynamicPage page={p} />}
                  />
                ))}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            )}
          </main>

          <footer className="border-t border-ink-500/50 mt-10">
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-fog-400">
              <span className="font-mono">
                © {new Date().getFullYear()} {contact.name || 'Portfolio'}
              </span>
              <div className="flex items-center gap-x-5 gap-y-1 flex-wrap justify-center">
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="hover:text-em-400 transition-colors"
                  >
                    {contact.email}
                  </a>
                )}
                {contact.email && contact.github && <span className="text-ink-500">·</span>}
                {contact.github && (
                  <a
                    href={
                      /^https?:\/\//.test(contact.github)
                        ? contact.github
                        : `https://github.com/${contact.github}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-em-400 transition-colors"
                  >
                    github.com/{contact.github.replace(/^https?:\/\/github\.com\//, '')}
                  </a>
                )}
              </div>
            </div>
          </footer>
        </div>
      </div>
    </HashRouter>
  );
}
