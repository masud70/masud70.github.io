import { useState } from "react";
import {
    Mail,
    FileText,
    ArrowUpRight,
    MapPin,
    Clock,
    Award,
    ExternalLink,
    Github,
    Sparkles,
    AtSign,
    GraduationCap,
    Brain,
    Code2,
    Globe,
    Database,
    Wrench,
    Cpu,
} from "lucide-react";
import ProjectModal from "../components/ProjectModal.jsx";
import { techIcon } from "../lib/techIcons.jsx";
import RichText from "../lib/richText.jsx";
import { asset } from "../lib/useContent.js";

/* ───────────────────────── shared shells ───────────────────────── */

/**
 * Standard section shell. The hero opts out via `bare` because it manages its
 * own full-viewport layout; every other section sizes to its content with
 * generous vertical rhythm.
 */
export function Section({ id, title, intro, children, className = "" }) {
    return (
        <section
            id={id}
            className={`scroll-mt-24 border-b border-line/70 py-16 md:py-20 ${className}`}
        >
            {title && (
                <header className="mb-8">
                    <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                        {title}
                    </h2>
                    <div className="mt-3 h-px w-12 bg-accent" />
                    {intro && (
                        <RichText
                            as="p"
                            className="mt-4 text-[17px] text-inkSoft leading-relaxed prose-justify"
                        >
                            {intro}
                        </RichText>
                    )}
                </header>
            )}
            {children}
        </section>
    );
}

function Card({ children, className = "", ...rest }) {
    return (
        <div
            className={`rounded-lg border border-line bg-surface p-5 transition-all hover:shadow-soft ${className}`}
            {...rest}
        >
            {children}
        </div>
    );
}

/** Icon for a skills category, matched on a keyword in its name. */
const SKILL_ICONS = [
    [/\bai\b|ml|machine|learning/i, Brain],
    [/language|programming/i, Code2],
    [/web|mobile|frontend|frameworks?/i, Globe],
    [/database|data\b|storage/i, Database],
    [/tool|workflow|devops/i, Wrench],
];
function skillIcon(category) {
    const hit = SKILL_ICONS.find(([re]) => re.test(category || ""));
    return hit ? hit[1] : Cpu;
}

function Chip({ children }) {
    const label = typeof children === "string" ? children : "";
    const hit = techIcon(label);
    const Icon = hit?.[0];
    const color = hit?.[1];
    return (
        <span className="inline-flex items-center gap-1.5 rounded border border-line bg-surfaceAlt px-2.5 py-1 font-mono text-[13px] text-inkSoft">
            {Icon && (
                <Icon
                    size={14}
                    style={{ color }}
                    className="shrink-0"
                    aria-hidden
                />
            )}
            {children}
        </span>
    );
}

/* ───────────────────────── 1. Profile / hero ───────────────────────── */

function Profile({ data }) {
    const p = data || {};
    return (
        <section
            id="profile"
            className="flex min-h-[calc(100vh-4rem)] scroll-mt-24 flex-col justify-center border-b border-line/70 py-16 lg:min-h-screen"
        >
            <div className="animate-fadeUp">
                {p.seeking && (
                    <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-[15px] font-semibold tracking-wide text-accentInk shadow-soft">
                        <Sparkles size={16} />
                        {p.seeking}
                    </p>
                )}

                <h1 className="font-serif text-[2.75rem] font-semibold leading-[1.08] tracking-tight text-ink md:text-[4.25rem]">
                    {p.firstName ? (
                        <>
                            {p.firstName}{" "}
                            <span className="text-accent">{p.lastName}</span>
                        </>
                    ) : (
                        p.name
                    )}
                </h1>

                <p className="mt-4 text-xl text-inkSoft md:text-2xl">
                    {p.status}
                    {p.affiliation && (
                        <>
                            {" · "}
                            {p.affiliationUrl ? (
                                <a
                                    href={p.affiliationUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent"
                                >
                                    {p.affiliation}
                                </a>
                            ) : (
                                p.affiliation
                            )}
                        </>
                    )}
                </p>

                {p.intro && (
                    <RichText
                        as="div"
                        className="mt-7 text-[16px] leading-[1.7] text-inkSoft text-justify md:text-lg"
                    >
                        {p.intro}
                    </RichText>
                )}

                <div className="mt-9 flex flex-wrap items-center gap-3">
                    {p.email && (
                        <a
                            href={`mailto:${p.email}`}
                            className="inline-flex items-center gap-2.5 rounded-lg bg-accent px-6 py-3.5 text-base font-semibold text-accentInk shadow-soft transition-all hover:bg-transparent hover:text-accent hover:shadow-lift border hover:border-accent md:text-lg"
                        >
                            <Mail size={20} />
                            {p.email}
                        </a>
                    )}
                    {p.cv && (
                        <a
                            href={asset(p.cv)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border border-line px-5 py-3.5 text-base font-medium text-ink transition-colors hover:border-accent hover:text-accent"
                        >
                            <FileText size={18} />
                            Curriculum Vitae
                            <ArrowUpRight size={16} className="opacity-70" />
                        </a>
                    )}
                </div>
            </div>
        </section>
    );
}

/* ───────────────────────── 2. News ───────────────────────── */

function News({ data, format }) {
    const items = Array.isArray(data) ? data : [];
    const sorted = [...items].sort((a, b) =>
        String(b.date || "").localeCompare(String(a.date || "")),
    );
    const limit = Number(format?.limit) || sorted.length;
    const shown = sorted.slice(0, limit);

    return (
        <Section id="news" title={format?.title || "Recent News"}>
            <ol className="space-y-0">
                {shown.map((n, i) => (
                    <li
                        key={i}
                        className="grid gap-1.5 border-b border-line/60 py-4 last:border-0 sm:grid-cols-[7rem_1fr] sm:gap-6"
                    >
                        <span className="pt-1 font-mono text-[13px] uppercase tracking-wider text-inkMute">
                            {n.display || n.date}
                        </span>
                        <RichText
                            as="p"
                            className={`text-[17px] leading-relaxed prose-justify ${n.highlight ? "text-ink" : "text-inkSoft"}`}
                        >
                            {n.text}
                        </RichText>
                    </li>
                ))}
            </ol>
        </Section>
    );
}

/* ───────────────────────── 3. Research ───────────────────────── */

function Research({ data, format }) {
    const d = data || {};
    return (
        <Section id="research" title={format?.title || "Research Interests"}>
            {d.statement && (
                <RichText
                    as="div"
                    className="text-[17px] leading-[1.7] text-inkSoft prose-justify"
                >
                    {d.statement}
                </RichText>
            )}

            {Array.isArray(d.interests) && d.interests.length > 0 && (
                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                    {d.interests.map((it, i) => (
                        <Card key={i}>
                            <h3 className="font-serif text-lg font-semibold text-ink">
                                {it.title}
                            </h3>
                            <RichText
                                as="p"
                                className="mt-1.5 text-[15.5px] leading-relaxed text-inkSoft prose-justify"
                            >
                                {it.text}
                            </RichText>
                        </Card>
                    ))}
                </div>
            )}
        </Section>
    );
}

/* ───────────────────────── 4. Publications ───────────────────────── */

function Publications({ data, format }) {
    const items = Array.isArray(data) ? data : [];
    // Preserve authoring order within each group, groups in first-seen order.
    const groups = [];
    items.forEach((p) => {
        const key = p.group || "Publications";
        let g = groups.find((x) => x.name === key);
        if (!g) {
            g = { name: key, items: [] };
            groups.push(g);
        }
        g.items.push(p);
    });

    return (
        <Section id="publications" title={format?.title || "Publications"}>
            {format?.note && (
                <RichText as="p" className="-mt-4 mb-8 text-sm text-inkMute">
                    {format.note}
                </RichText>
            )}

            {groups.map((g) => (
                <div key={g.name} className="mb-10 last:mb-0">
                    <h3 className="mb-4 font-mono text-[12px] uppercase tracking-[0.18em] text-inkMute">
                        {g.name}
                    </h3>
                    <ol className="space-y-6">
                        {g.items.map((p, i) => (
                            <li
                                key={i}
                                className="border-l-2 border-line pl-4 transition-colors hover:border-accent"
                            >
                                <h4 className="font-serif text-lg font-semibold leading-snug text-ink">
                                    {p.url ? (
                                        <a
                                            href={p.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-accent"
                                        >
                                            {p.title}
                                        </a>
                                    ) : (
                                        p.title
                                    )}
                                </h4>
                                {p.authors && (
                                    <RichText
                                        as="p"
                                        className="mt-1.5 text-[15.5px] text-inkSoft"
                                    >
                                        {p.authors}
                                    </RichText>
                                )}
                                <p className="mt-1 text-[15px] italic text-inkMute">
                                    {p.venue}
                                    {p.year ? `, ${p.year}` : ""}
                                </p>
                                {p.note && (
                                    <p className="mt-1 text-[14px] text-inkMute">
                                        {p.note}
                                    </p>
                                )}
                                {p.summary && (
                                    <RichText
                                        as="p"
                                        className="mt-2 text-[15.5px] leading-relaxed text-inkSoft prose-justify"
                                    >
                                        {p.summary}
                                    </RichText>
                                )}
                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                    {p.status && (
                                        <span className="rounded border border-accent/30 bg-accent/5 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent">
                                            {p.status}
                                        </span>
                                    )}
                                    {Array.isArray(p.links) &&
                                        p.links.map((l, j) => (
                                            <a
                                                key={j}
                                                href={l.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
                                            >
                                                {l.label}
                                                <ExternalLink size={10} />
                                            </a>
                                        ))}
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            ))}
        </Section>
    );
}

/* ───────────────────────── 5. Education ───────────────────────── */

function Education({ data, format }) {
    const items = Array.isArray(data) ? data : [];
    return (
        <Section id="education" title={format?.title || "Education"}>
            <div className="space-y-8">
                {items.map((e, i) => (
                    <div key={i} className="flex gap-4">
                        {e.logo ? (
                            <img
                                src={asset(e.logo)}
                                alt=""
                                className="hidden h-14 w-14 shrink-0 rounded-lg object-cover ring-1 ring-line sm:block"
                                onError={(ev) => {
                                    ev.currentTarget.style.visibility =
                                        "hidden";
                                }}
                            />
                        ) : (
                            <div className="hidden h-14 w-14 shrink-0 rounded-lg bg-surfaceAlt ring-1 ring-line sm:block" />
                        )}
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                                <h3 className="font-serif text-xl font-semibold leading-snug text-ink">
                                    {e.degree}
                                </h3>
                                <span className="font-mono text-[13px] text-inkMute">
                                    {e.period}
                                </span>
                            </div>
                            <p className="mt-0.5 text-[16px] text-accent">
                                {e.institutionUrl ? (
                                    <a
                                        href={e.institutionUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:underline"
                                    >
                                        {e.institution}
                                    </a>
                                ) : (
                                    e.institution
                                )}
                                {e.location && (
                                    <span className="text-inkMute">
                                        {" "}
                                        · {e.location}
                                    </span>
                                )}
                            </p>
                            {e.grade && (
                                <p className="mt-1.5 inline-block rounded border border-line bg-surfaceAlt px-2.5 py-1 font-mono text-[13px] text-inkSoft">
                                    {e.grade}
                                </p>
                            )}
                            {Array.isArray(e.points) && e.points.length > 0 && (
                                <ul className="mt-2.5 space-y-1">
                                    {e.points.map((pt, j) => (
                                        <li
                                            key={j}
                                            className="flex gap-2 text-[16px] leading-relaxed text-inkSoft"
                                        >
                                            <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-accent/60" />
                                            <RichText>{pt}</RichText>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
}

/* ───────────────────────── 6. Experience ───────────────────────── */

function Experience({ data, format }) {
    const groups = data?.groups || [];
    return (
        <Section
            id={format?.section || "experience"}
            title={format?.title || "Experience"}
        >
            <div className="space-y-10">
                {groups.map((g, gi) => (
                    <div key={gi}>
                        {g.heading && (
                            <h3 className="mb-4 font-mono text-[12px] uppercase tracking-[0.18em] text-inkMute">
                                {g.heading}
                            </h3>
                        )}
                        <div className="space-y-6">
                            {(g.items || []).map((it, i) => (
                                <div
                                    key={i}
                                    className={`border-l-2 pl-4 ${it.placeholder ? "border-dashed border-line" : "border-line hover:border-accent transition-colors"}`}
                                >
                                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                                        <h4 className="font-serif text-lg font-semibold text-ink">
                                            {it.role}
                                        </h4>
                                        <span className="font-mono text-[13px] text-inkMute">
                                            {it.period}
                                        </span>
                                    </div>
                                    <p className="mt-0.5 text-[16px] text-accent">
                                        {it.url ? (
                                            <a
                                                href={it.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:underline"
                                            >
                                                {it.org}
                                            </a>
                                        ) : (
                                            it.org
                                        )}
                                    </p>
                                    {it.orgDetail && (
                                        <p className="mt-0.5 text-[14px] text-inkMute">
                                            {it.orgDetail}
                                        </p>
                                    )}
                                    {Array.isArray(it.points) && (
                                        <ul className="mt-2 space-y-1">
                                            {it.points.map((pt, j) => (
                                                <li
                                                    key={j}
                                                    className="flex gap-2 text-[16px] leading-relaxed text-inkSoft"
                                                >
                                                    <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-accent/60" />
                                                    <RichText>{pt}</RichText>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
}

/* ───────────────────────── 7. Projects ───────────────────────── */

function Projects({ data, format }) {
    const items = Array.isArray(data) ? data : [];
    const [selected, setSelected] = useState(null);
    return (
        <Section
            id="projects"
            title={format?.title || "Projects"}
            intro={format?.intro}
        >
            <div className="grid gap-4 md:grid-cols-2">
                {items.map((p, i) => (
                    <Card
                        key={i}
                        className="flex cursor-pointer flex-col hover:border-accent/50"
                        onClick={() => setSelected(p)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setSelected(p);
                            }
                        }}
                    >
                        <div className="flex items-baseline justify-between gap-3">
                            <h3 className="font-serif text-xl font-semibold leading-snug text-ink">
                                {p.title}
                            </h3>
                            <span className="shrink-0 font-mono text-[13px] text-inkMute">
                                {p.year}
                            </span>
                        </div>
                        {p.subtitle && (
                            <p className="mt-1 text-[15.5px] text-accent">
                                {p.subtitle}
                            </p>
                        )}
                        {p.role && (
                            <p className="mt-1 text-[13.5px] text-inkMute">
                                {p.role}
                            </p>
                        )}
                        <RichText
                            as="p"
                            className="mt-3 flex-1 text-[16px] leading-relaxed text-inkSoft prose-justify"
                        >
                            {p.description}
                        </RichText>
                        {Array.isArray(p.stack) && (
                            <div className="mt-4 flex flex-wrap gap-1.5">
                                {p.stack.map((s, j) => (
                                    <Chip key={j}>{s}</Chip>
                                ))}
                            </div>
                        )}
                        <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3">
                            <span className="inline-flex items-center gap-1 text-[14px] font-medium text-accent">
                                Details
                                <ArrowUpRight size={14} />
                            </span>
                            {p.url && (
                                <a
                                    href={p.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    // Stop the click from also opening the detail modal.
                                    onClick={(e) => e.stopPropagation()}
                                    aria-label={`${p.title} on GitHub`}
                                    title="View on GitHub"
                                    className="inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 text-[13px] font-medium text-inkSoft transition-colors hover:border-accent hover:text-accent"
                                >
                                    <Github size={15} />
                                    Code
                                </a>
                            )}
                        </div>
                    </Card>
                ))}
            </div>

            <ProjectModal
                project={selected}
                onClose={() => setSelected(null)}
            />
        </Section>
    );
}

/* ───────────────────────── 8. Achievements ───────────────────────── */

function Achievements({ data, format }) {
    const items = Array.isArray(data) ? data : [];
    return (
        <Section
            id="achievements"
            title={format?.title || "Awards & Achievements"}
        >
            <div className="space-y-5">
                {items.map((a, i) => (
                    <div
                        key={i}
                        className="flex gap-4 border-b border-line/60 pb-5 last:border-0 last:pb-0"
                    >
                        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/25 bg-accent/5 text-accent">
                            <Award size={17} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                                <h3 className="font-serif text-lg font-semibold text-ink">
                                    {a.title}
                                </h3>
                                <span className="font-mono text-[13px] text-inkMute">
                                    {a.year}
                                </span>
                            </div>
                            <p className="mt-0.5 text-[14px] text-inkMute">
                                {a.org}
                            </p>
                            {a.award && (
                                <span className="mt-2 inline-block rounded border border-accent/30 bg-accent/5 px-2.5 py-1 font-mono text-[13px] font-medium text-accent">
                                    {a.award}
                                </span>
                            )}
                            {a.text && (
                                <RichText
                                    as="p"
                                    className="mt-2 text-[16px] leading-relaxed text-inkSoft prose-justify"
                                >
                                    {a.text}
                                </RichText>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
}

/* ───────────────────────── 9. Skills ───────────────────────── */

function Skills({ data, format }) {
    const groups = data?.groups || [];
    const certs = data?.certifications || [];
    return (
        <Section id="skills" title={format?.title || "Skills & Certifications"}>
            <div className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
                {groups.map((g, i) => (
                    <div
                        key={i}
                        className="grid grid-cols-[9rem_1fr] items-start gap-3"
                    >
                        <span className="flex items-center gap-2 pt-1 font-mono text-[12.5px] uppercase tracking-wider text-inkMute">
                            {(() => {
                                const I = skillIcon(g.category);
                                return (
                                    <I
                                        size={15}
                                        className="shrink-0 text-accent"
                                    />
                                );
                            })()}
                            {g.category}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                            {(g.items || []).map((s, j) => (
                                <Chip key={j}>{s}</Chip>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {certs.length > 0 && (
                <div className="mt-10 border-t border-line pt-6">
                    <h3 className="mb-4 font-mono text-[12px] uppercase tracking-[0.18em] text-inkMute">
                        Certifications
                    </h3>
                    <ul className="space-y-3">
                        {certs.map((c, i) => (
                            <li
                                key={i}
                                className="flex flex-wrap items-baseline justify-between gap-x-4"
                            >
                                <div className="min-w-0">
                                    <p className="text-[17px] font-medium text-ink">
                                        {c.title}
                                    </p>
                                    <p className="text-[14px] text-inkMute">
                                        {c.issuer}
                                    </p>
                                </div>
                                <span className="font-mono text-[13px] text-inkMute">
                                    {c.date}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </Section>
    );
}

/* ───────────────────────── 10. Contact ───────────────────────── */

function Contact({ data, format }) {
    const d = data || {};
    const mapSrc = d.mapQuery
        ? `https://maps.google.com/maps?q=${encodeURIComponent(d.mapQuery)}&z=11&output=embed`
        : null;

    return (
        <Section
            id="contact"
            title={format?.title || "Contact"}
            className="border-b-0"
        >
            {d.blurb && (
                <RichText
                    as="p"
                    className="mb-8 text-[17px] leading-relaxed text-inkSoft prose-justify"
                >
                    {d.blurb}
                </RichText>
            )}

            <div className="grid gap-8 md:grid-cols-2">
                <dl className="space-y-5">
                    {d.email && (
                        <div className="flex gap-3">
                            <GraduationCap
                                size={18}
                                className="mt-1 shrink-0 text-accent"
                            />
                            <div className="min-w-0">
                                <dt className="font-mono text-[12px] uppercase tracking-[0.18em] text-inkMute">
                                    Institutional
                                </dt>
                                <dd className="mt-0.5">
                                    <a
                                        href={`mailto:${d.email}`}
                                        className="block break-words text-lg font-semibold text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent md:text-xl"
                                    >
                                        {d.email}
                                    </a>
                                </dd>
                            </div>
                        </div>
                    )}
                    {d.personalEmail && (
                        <div className="flex gap-3">
                            <AtSign
                                size={18}
                                className="mt-1 shrink-0 text-accent"
                            />
                            <div className="min-w-0">
                                <dt className="font-mono text-[12px] uppercase tracking-[0.18em] text-inkMute">
                                    Personal
                                </dt>
                                <dd className="mt-0.5">
                                    <a
                                        href={`mailto:${d.personalEmail}`}
                                        className="block break-words text-lg font-semibold text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent md:text-xl"
                                    >
                                        {d.personalEmail}
                                    </a>
                                </dd>
                            </div>
                        </div>
                    )}
                    {d.address && (
                        <div className="flex gap-3">
                            <MapPin
                                size={16}
                                className="mt-0.5 shrink-0 text-accent"
                            />
                            <div>
                                <dt className="font-mono text-[12px] uppercase tracking-[0.18em] text-inkMute">
                                    Location
                                </dt>
                                <dd className="mt-0.5 text-[17px] text-ink">
                                    {d.address}
                                </dd>
                            </div>
                        </div>
                    )}
                    {d.timezone && (
                        <div className="flex gap-3">
                            <Clock
                                size={16}
                                className="mt-0.5 shrink-0 text-accent"
                            />
                            <div>
                                <dt className="font-mono text-[12px] uppercase tracking-[0.18em] text-inkMute">
                                    Time Zone
                                </dt>
                                <dd className="mt-0.5 text-[17px] text-ink">
                                    {d.timezone}
                                </dd>
                            </div>
                        </div>
                    )}
                    {d.availability && (
                        <div className="rounded-md border border-accent/25 bg-accent/5 p-4">
                            <RichText
                                as="p"
                                className="text-[16px] leading-relaxed text-accent"
                            >
                                {d.availability}
                            </RichText>
                        </div>
                    )}
                </dl>

                {mapSrc && (
                    <div className="overflow-hidden rounded-lg border border-line">
                        <iframe
                            src={mapSrc}
                            title="Location map"
                            loading="lazy"
                            className="h-64 w-full md:h-full"
                            style={{ border: 0 }}
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                )}
            </div>
        </Section>
    );
}

/* ───────────────────────── registry ───────────────────────── */

/**
 * Maps a `format.section` id to its renderer. An unknown id renders nothing
 * rather than throwing, so adding an unrecognised section file can never
 * break the site.
 */
export const SECTION_COMPONENTS = {
    profile: Profile,
    news: News,
    research: Research,
    publications: Publications,
    education: Education,
    experience: Experience,
    service: Experience,
    projects: Projects,
    achievements: Achievements,
    skills: Skills,
    contact: Contact,
};

export function renderSection(section) {
    const Cmp = SECTION_COMPONENTS[section.id];
    if (!Cmp) return null;
    return (
        <Cmp key={section.file} data={section.data} format={section.format} />
    );
}
