# Academic Portfolio — Md. Masud Mazumder

Single-page academic portfolio with anchor navigation, a fixed left sidebar, four switchable colour palettes, and a separate photo gallery route. All content lives in JSON files; adding a section requires no code changes.

**Stack:** Vite · React · React Router · TailwindCSS · lucide-react

---

## Quick start

```bash
npm install
npm run dev
```

`predev` and `prebuild` regenerate `public/manifest.json` automatically, so new content files are picked up on every run.

---

## Content model

Everything lives under `home/`.

```
home/
├── 01-PROFILE.json        hero + sidebar identity
├── 02-NEWS.json           dated activity feed
├── 03-RESEARCH.json       statement, interests, thesis
├── 04-PUBLICATIONS.json   academic citation format
├── 05-EDUCATION.json
├── 06-EXPERIENCE.json     work + academic service
├── 07-PROJECTS.json
├── 08-ACHIEVEMENTS.json
├── 09-SKILLS.json         skills + certifications
├── 10-CONTACT.json
├── gallery/
│   └── 01-ALBUMS.json     photo albums (separate /gallery route)
└── assets/                images, CV PDF, anything referenced above
```

### File shape

Every content file has the same two top-level keys:

```json
{
  "format": {
    "section": "projects",
    "label": "Projects",
    "title": "Projects"
  },
  "data": [ ... ]
}
```

| Key | Purpose |
|---|---|
| `format.section` | Which renderer to use. Must match a key in `src/sections/index.jsx`. |
| `format.label` | Text shown in the sidebar nav. |
| `format.title` | Heading shown above the section. |
| `data` | The payload — an object or array, depending on the section. |

**Ordering** comes from the numeric filename prefix (`01-`, `02-`, …). Renumber files to reorder sections; unprefixed files sort last.

A file with invalid JSON or an unrecognised `format.section` is skipped with a console warning — the rest of the site still builds and renders.

### Formatted text

Any text field accepts inline HTML:

```json
"text": "Paper accepted at <strong>MSR 2025</strong>. See the <a href='https://...'>preprint</a>."
```

Allowed: `<a> <b> <strong> <i> <em> <u> <s> <code> <kbd> <mark> <br> <p> <span> <small> <sup> <sub> <ul> <ol> <li> <blockquote>`

Everything else is unwrapped and every attribute outside a short allowlist is stripped, so scripts, event handlers, `javascript:` URLs, and iframes cannot get through. External links automatically gain `target="_blank"` and `rel="noopener noreferrer"`.

### Assets

Reference anything in `home/assets/` with a path relative to `home/`:

```json
"photo": "assets/masud.jpg",
"cv": "assets/MasudCV.pdf"
```

Paths are resolved against the deploy base at runtime, so they work at both `/` and `/repo-name/`.

---

## Themes

Four palettes ship in `src/index.css`, each a block of CSS custom properties:

| id | Name | Character |
|---|---|---|
| `parchment` | Parchment | Warm off-white, deep teal — **default** |
| `slate` | Slate | Cool neutral, indigo |
| `sage` | Sage | Cream, forest green |
| `midnight` | Midnight | Dark navy, emerald |

The visitor's choice persists in `localStorage`.

**To change the default**, edit one line in `src/theme/ThemeProvider.jsx`:

```js
export const DEFAULT_PALETTE = 'parchment';
```

Also update `data-theme` on the `<html>` tag in `index.html` to match, which avoids a flash of the wrong palette on first paint.

**To add a palette:** add a `[data-theme='yourname']` block in `src/index.css` defining all ten `--c-*` variables, then add a matching entry to `PALETTES` in `ThemeProvider.jsx`.

---

## Adding a new section

1. Create `home/11-TALKS.json` with `"format": { "section": "talks", "label": "Talks", "title": "Invited Talks" }`.
2. Add a `Talks` component and register it in `SECTION_COMPONENTS` in `src/sections/index.jsx`.
3. Rebuild. The sidebar nav and scroll-spy pick it up automatically.

Steps 1 and 3 alone are enough if you reuse an existing renderer — e.g. giving a second file `"section": "projects"` renders it with the projects layout.

---

## Deployment

The included workflow at `.github/workflows/deploy.yml` builds and publishes on every push to `main`.

**One-time setup:** repo → **Settings → Pages → Source → GitHub Actions**. If this is set to "Deploy from a branch", GitHub serves your raw source instead of the build, and the browser refuses `main.jsx` with a `text/jsx` MIME error — the classic white screen.

**Base path:** the workflow sets `BASE_PATH: /`, correct for a root user site (`masud70.github.io`). For a project site, change it to:

```yaml
BASE_PATH: /${{ github.event.repository.name }}/
```

**Routing** uses `HashRouter` (`/#/gallery`), so deep links and refreshes work on Pages without a 404 redirect workaround.

---

## Project structure

```
src/
├── App.jsx                    routes, scroll-spy, layout shell
├── main.jsx
├── index.css                  Tailwind + the four palettes
├── components/
│   ├── Sidebar.jsx            identity, nav, CV link, mobile drawer
│   └── ThemeSwitcher.jsx
├── lib/
│   ├── richText.jsx           HTML sanitizer + RichText component
│   └── useContent.js          manifest loader, asset path resolver
├── pages/
│   └── Gallery.jsx            albums + lightbox
├── sections/
│   └── index.jsx              all ten section renderers + registry
└── theme/
    └── ThemeProvider.jsx      palette definitions, context, persistence
```

---

## Content checklist

Placeholders worth replacing before you share the site:

- `home/01-PROFILE.json` — `links.scholar` and `links.orcid` are empty; add them once you have profiles.
- `home/06-EXPERIENCE.json` — the Teaching entry is marked `"placeholder": true` and renders with a dashed border. Replace it with real TA/grader roles as you take them on, and drop the flag.
- `home/04-PUBLICATIONS.json` — add the DOI/arXiv link and a `links` entry (`[{ "label": "PDF", "url": "..." }]`) once the MSR paper is online.
