import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    Github,
    Linkedin,
    Mail,
    GraduationCap,
    Twitter,
    FileText,
    Images,
    Menu,
    X,
    Newspaper,
    FlaskConical,
    BookOpen,
    Briefcase,
    FolderGit2,
    Trophy,
    Wrench,
    Send,
    Home,
    HandHeart,
} from "lucide-react";
import { asset } from "../lib/useContent.js";
import ThemeSwitcher from "./ThemeSwitcher.jsx";

/** Icon shown beside each nav entry, keyed by section id. */
const NAV_ICONS = {
    profile: Home,
    news: Newspaper,
    research: FlaskConical,
    publications: BookOpen,
    education: GraduationCap,
    experience: Briefcase,
    service: HandHeart,
    projects: FolderGit2,
    achievements: Trophy,
    skills: Wrench,
    contact: Send,
};

export default function Sidebar({ profile, sections, activeId, hasGallery }) {
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const onGallery = location.pathname.startsWith("/gallery");

    useEffect(() => setMounted(true), []);
    useEffect(() => setOpen(false), [location.pathname]);

    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener("keydown", onKey);
        };
    }, [open]);

    /**
     * Scroll to a section.
     *
     * Plain `href="#id"` anchors cannot be used here: HashRouter owns the URL
     * hash, so writing `#news` into it reads as the route "/news", which has no
     * match and redirects to "/" — that was the "always jumps to the top" bug.
     * Instead we scroll imperatively and leave the hash alone.
     */
    const goToSection = useCallback(
        (id) => {
            setOpen(false);
            const scroll = () => {
                // Home means the very top of the document.
                if (id === "profile") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    return;
                }
                const el = document.getElementById(id);
                if (!el) return;
                // Align the section's top edge — the rule that closes the previous
                // section — with the top of the viewport. Only the mobile sticky bar
                // needs clearing; the desktop sidebar overlays nothing.
                const headerOffset = window.matchMedia("(min-width: 768px)")
                    .matches
                    ? 0
                    : 64;
                const top =
                    el.getBoundingClientRect().top +
                    window.scrollY -
                    headerOffset;
                window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
            };
            if (onGallery) {
                navigate("/");
                // Wait for the home route to mount before measuring the target.
                setTimeout(scroll, 80);
            } else {
                scroll();
            }
        },
        [onGallery, navigate],
    );

    const p = profile || {};
    const links = p.links || {};

    const socials = [
        links.github && {
            label: "GitHub",
            Icon: Github,
            href: /^https?:/.test(links.github)
                ? links.github
                : `https://github.com/${links.github}`,
        },
        links.linkedin && {
            label: "LinkedIn",
            Icon: Linkedin,
            href: /^https?:/.test(links.linkedin)
                ? links.linkedin
                : `https://linkedin.com/in/${links.linkedin}`,
        },
        links.scholar && {
            label: "Google Scholar",
            Icon: GraduationCap,
            href: links.scholar,
        },
        links.twitter && {
            label: "Twitter",
            Icon: Twitter,
            href: /^https?:/.test(links.twitter)
                ? links.twitter
                : `https://twitter.com/${String(links.twitter).replace(/^@/, "")}`,
        },
        p.email && { label: "Email", Icon: Mail, href: `mailto:${p.email}` },
    ].filter(Boolean);

    const navRow =
        "group flex w-full items-center gap-3 rounded-md px-3 py-2 text-[15px] transition-colors";

    const navItems = (
        <ul className="space-y-0.5">
            <li>
                <button
                    type="button"
                    onClick={() => goToSection("profile")}
                    aria-current={
                        !onGallery && activeId === "profile"
                            ? "true"
                            : undefined
                    }
                    className={[
                        navRow,
                        !onGallery && activeId === "profile"
                            ? "bg-accent/10 font-medium text-accent"
                            : "text-inkSoft hover:bg-surfaceAlt hover:text-ink",
                    ].join(" ")}
                >
                    <Home
                        size={17}
                        className={
                            !onGallery && activeId === "profile"
                                ? "shrink-0"
                                : "shrink-0 opacity-60 group-hover:opacity-100"
                        }
                    />
                    Home
                </button>
            </li>
            {sections.map((s) => {
                const Icon = NAV_ICONS[s.id] || FileText;
                const active = !onGallery && activeId === s.id;
                return (
                    <li key={s.id}>
                        <button
                            type="button"
                            onClick={() => goToSection(s.id)}
                            aria-current={active ? "true" : undefined}
                            className={[
                                navRow,
                                active
                                    ? "bg-accent/10 font-medium text-accent"
                                    : "text-inkSoft hover:bg-surfaceAlt hover:text-ink",
                            ].join(" ")}
                        >
                            <Icon
                                size={17}
                                className={
                                    active
                                        ? "shrink-0"
                                        : "shrink-0 opacity-60 group-hover:opacity-100"
                                }
                            />
                            {s.label || s.title || s.id}
                        </button>
                    </li>
                );
            })}

            {hasGallery && (
                <li>
                    <Link
                        to="/gallery"
                        onClick={() => setOpen(false)}
                        className={[
                            navRow,
                            onGallery
                                ? "bg-accent/10 font-medium text-accent"
                                : "text-inkSoft hover:bg-surfaceAlt hover:text-ink",
                        ].join(" ")}
                    >
                        <Images
                            size={17}
                            className={
                                onGallery
                                    ? "shrink-0"
                                    : "shrink-0 opacity-60 group-hover:opacity-100"
                            }
                        />
                        Gallery
                    </Link>
                </li>
            )}

            {p.cv && (
                <li>
                    <a
                        href={asset(p.cv)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setOpen(false)}
                        className={`${navRow} text-inkSoft hover:bg-surfaceAlt hover:text-ink`}
                    >
                        <FileText
                            size={17}
                            className="shrink-0 opacity-60 group-hover:opacity-100"
                        />
                        Curriculum Vitae
                    </a>
                </li>
            )}
        </ul>
    );

    const identity = (
        <div className="text-center">
            {p.photo && (
                <button
                    type="button"
                    onClick={() => goToSection("profile")}
                    className="mx-auto block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-2xl"
                    aria-label="Back to top"
                >
                    <img
                        src={asset(p.photo)}
                        alt={p.name || "Profile photo"}
                        className="h-32 w-32 rounded-2xl object-cover ring-1 ring-line shadow-soft transition-shadow hover:shadow-lift"
                    />
                </button>
            )}

            <h1 className="mt-4 font-serif text-[27px] font-bold leading-tight text-ink">
                {p.name}
            </h1>

            {p.status && (
                <p className="mt-1.5 text-[16px] font-medium leading-snug text-accent">
                    {p.status}
                </p>
            )}

            {p.affiliation && (
                <p className="mt-1 text-sm leading-snug text-inkMute">
                    {p.affiliationUrl ? (
                        <a
                            href={p.affiliationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-accent"
                        >
                            {p.affiliation}
                        </a>
                    ) : (
                        p.affiliation
                    )}
                </p>
            )}

            {p.email && (
                <a
                    href={`mailto:${p.email}`}
                    className="mt-3 block break-all rounded-md border border-accent/25 bg-accent/5 px-2.5 py-2 font-mono text-[15px] font-medium text-accent transition-colors hover:bg-accent hover:text-accentInk"
                >
                    {p.email}
                </a>
            )}

            {socials.length > 0 && (
                <div className="mt-4 flex items-center justify-center gap-2">
                    {socials.map(({ label, Icon, href }) => (
                        <a
                            key={label}
                            href={href}
                            target={
                                href.startsWith("http") ? "_blank" : undefined
                            }
                            rel={
                                href.startsWith("http")
                                    ? "noopener noreferrer"
                                    : undefined
                            }
                            aria-label={label}
                            title={label}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-line text-inkSoft transition-all hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:text-accentInk"
                        >
                            <Icon size={19} />
                        </a>
                    ))}
                </div>
            )}
        </div>
    );

    // The identity block and the theme picker stay put; only the link list
    // scrolls, so the photo and contact details are always on screen.
    const panelBody = (
        <div className="flex h-full flex-col">
            <div className="shrink-0 px-6 pt-6 pb-4">{identity}</div>

            <nav className="min-h-0 flex-1 overflow-y-auto border-t border-line px-6 py-4">
                {navItems}
            </nav>

            <div className="shrink-0 border-t border-line px-6 py-4">
                <ThemeSwitcher />
            </div>
        </div>
    );

    const drawer = (
        <>
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm md:hidden"
                />
            )}
            <aside
                className={[
                    "fixed inset-y-0 right-0 z-50 w-[84vw] max-w-sm border-l border-line bg-surface shadow-lift md:hidden",
                    "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    open ? "translate-x-0" : "translate-x-full",
                ].join(" ")}
                aria-hidden={!open}
            >
                <div className="flex items-center justify-between border-b border-line px-5 py-3">
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-inkMute">
                        Menu
                    </span>
                    <button
                        onClick={() => setOpen(false)}
                        aria-label="Close menu"
                        className="p-1 text-inkSoft hover:text-accent"
                    >
                        <X size={22} />
                    </button>
                </div>
                <div className="h-[calc(100%-3rem)]">{panelBody}</div>
            </aside>
        </>
    );

    return (
        <>
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-[20rem] border-r border-line bg-surface md:block">
                {panelBody}
            </aside>

            <header className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-surface/90 px-5 py-3 backdrop-blur md:hidden">
                <button
                    type="button"
                    onClick={() => goToSection("profile")}
                    className="flex min-w-0 items-center gap-2.5"
                >
                    {p.photo && (
                        <img
                            src={asset(p.photo)}
                            alt=""
                            className="h-9 w-9 shrink-0 rounded-lg object-cover ring-1 ring-line"
                        />
                    )}
                    <span className="truncate font-serif text-[22px] font-bold text-ink">
                        {p.name}
                    </span>
                </button>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setOpen(true)}
                        aria-label="Open menu"
                        className="p-1 text-inkSoft hover:text-accent"
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </header>

            {mounted && createPortal(drawer, document.body)}
        </>
    );
}
