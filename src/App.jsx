import { useEffect, useMemo, useState } from "react";
import {
    HashRouter,
    Routes,
    Route,
    Navigate,
    useLocation,
} from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import BackgroundFX from "./components/BackgroundFX.jsx";
import Gallery from "./pages/Gallery.jsx";
import { renderSection } from "./sections/index.jsx";
import { useContent } from "./lib/useContent.js";
import { ThemeProvider } from "./theme/ThemeProvider.jsx";

/**
 * Scroll-spy: reports which section occupies the upper portion of the
 * viewport. Uses IntersectionObserver with a top-weighted root margin so the
 * active nav item changes when a section's heading reaches reading position.
 */
function useActiveSection(ids, enabled) {
    const [active, setActive] = useState(ids[0] || null);

    useEffect(() => {
        if (!enabled || ids.length === 0) return;

        const visible = new Map();
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting)
                        visible.set(e.target.id, e.intersectionRatio);
                    else visible.delete(e.target.id);
                });
                // Choose the topmost visible section in document order.
                const firstVisible = ids.find((id) => visible.has(id));
                if (firstVisible) setActive(firstVisible);
            },
            { rootMargin: "-10% 0px -70% 0px", threshold: [0, 0.1, 0.5] },
        );

        const nodes = ids
            .map((id) => document.getElementById(id))
            .filter(Boolean);
        nodes.forEach((n) => observer.observe(n));
        return () => observer.disconnect();
    }, [ids, enabled]);

    return active;
}

/**
 * Resets scroll position when the *route* changes (home <-> gallery).
 * Section navigation is handled imperatively in Sidebar and deliberately
 * does not touch the URL, because HashRouter owns the hash.
 */
function RouteScroll() {
    const location = useLocation();
    const [firstRender, setFirstRender] = useState(true);
    useEffect(() => {
        if (firstRender) {
            setFirstRender(false);
            return;
        }
        window.scrollTo({ top: 0, behavior: "instant" });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);
    return null;
}

function Shell({ backgroundAnimation }) {
    const { loading, error, sections, gallery } = useContent();
    const location = useLocation();
    const onHome = location.pathname === "/";

    const profile = useMemo(
        () => sections.find((s) => s.id === "profile")?.data || null,
        [sections],
    );

    // Nav excludes the hero — clicking the name/logo already returns there.
    const navSections = useMemo(
        () => sections.filter((s) => s.id !== "profile"),
        [sections],
    );

    const sectionIds = useMemo(() => sections.map((s) => s.id), [sections]);
    const activeId = useActiveSection(sectionIds, onHome && !loading);

    return (
        <div className="min-h-screen bg-canvas">
            <BackgroundFX enabled={backgroundAnimation} />

            <Sidebar
                profile={profile}
                sections={navSections}
                activeId={activeId}
                hasGallery={gallery.length > 0}
            />
            <div className="md:pl-[20rem]">
                <div className="relative z-10">
                    <div className="mx-auto w-full max-w-5xl px-6 md:px-8 lg:px-10">
                        {loading && (
                            <div className="flex min-h-screen items-center justify-center">
                                <span className="font-mono text-sm text-inkMute">
                                    Loading…
                                </span>
                            </div>
                        )}

                        {!loading && error && (
                            <div className="flex min-h-screen flex-col items-center justify-center text-center">
                                <h2 className="font-serif text-xl font-semibold text-ink">
                                    Couldn't load content
                                </h2>
                                <p className="mt-2 text-sm text-inkMute">
                                    {error.message}
                                </p>
                            </div>
                        )}

                        {!loading && !error && (
                            <Routes>
                                <Route
                                    path="/"
                                    element={<>{sections.map(renderSection)}</>}
                                />
                                <Route
                                    path="/gallery"
                                    element={<Gallery albums={gallery} />}
                                />
                                <Route
                                    path="*"
                                    element={<Navigate to="/" replace />}
                                />
                            </Routes>
                        )}
                    </div>
                </div>

                {!loading && !error && (
                    <footer className="site-footer mt-12 py-10 text-center">
                        <p className="font-serif text-lg font-semibold text-ink">
                            {profile?.name || ""}
                        </p>
                        {profile?.email && (
                            <a
                                href={`mailto:${profile.email}`}
                                className="mt-1 inline-block text-[15px] text-accent hover:underline"
                            >
                                {profile.email}
                            </a>
                        )}
                        <p className="mt-3 font-mono text-[14px] text-inkMute">
                            © {new Date().getFullYear()} {profile?.name || ""}
                        </p>
                    </footer>
                )}
            </div>
        </div>
    );
}

export default function App({ backgroundAnimation = true }) {
    return (
        <ThemeProvider>
            <HashRouter>
                <RouteScroll />
                <Shell backgroundAnimation={backgroundAnimation} />
            </HashRouter>
        </ThemeProvider>
    );
}
