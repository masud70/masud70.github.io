# Masud Mazumder — Personal Portfolio

A dark-themed, Markdown-driven personal portfolio. Drop `.md` files into `/home`, rebuild, and the site updates. No backend, no database — ready for GitHub Pages.

**Stack:** Vite · React · React Router · TailwindCSS · Framer Motion.
**Theme:** Deep navy with emerald-green neon accents and a glowing timeline.

---

## 1. Quick start

```bash
npm install
npm run dev
```

Visit the URL Vite prints. The `predev` / `prebuild` hooks regenerate `public/manifest.json` automatically on every run.

---

## 2. Content model

All content lives under `/home`.

```
/home
├── assets/                     static files (images, your CV PDF, etc.)
│   ├── portrait.jpg
│   └── MasudCV.pdf
├── 01-BIO.md                   homepage hero (section: "bio")
├── 02-EDUCATION.md             timeline
├── 03-PUBLICATIONS.md          timeline
├── 04-PROJECTS.md              timeline (homepage preview)
├── 05-ACHIEVEMENTS.md          timeline
├── 06-SKILLS.md                skill grid (section: "skills")
├── projects/
│   └── PROJECTS.md             dedicated /projects page
└── achievements/
    └── ACHIEVEMENTS.md         dedicated /achievements page
```

### File format

Every `.md` file has two sections:

````markdown
# FORMAT
{
  "section": "bio",       // optional hint — see "Special sections" below
  "type": "array",
  "items": { "title": "string", "subtitle": "string" }
}

# DATA
[
  { "title": "Something", "subtitle": "Done well" }
]
````

Rules (from the spec):

- Both `# FORMAT` and `# DATA` sections required.
- Each section's body is **strict JSON** (or a ` ```json … ``` ` fence around strict JSON).
- **No field is required.** Missing fields are omitted from the UI, never shown as placeholders.
- Invalid JSON → file is skipped silently. The site never crashes.
- Unknown custom fields (e.g. `placement`, `GPA`, `role`) render automatically as labelled rows in the card.

### File ordering

Filenames prefixed with a number (e.g. `01-BIO.md`) are sorted by that prefix. This controls what appears first on a page. Unprefixed files sort alphabetically after prefixed ones.

### Special sections

The `FORMAT` schema may include an optional `"section"` hint to pick a specialized renderer. Recognized values:

| Hint        | Rendering                                                           |
|-------------|---------------------------------------------------------------------|
| `"bio"`     | Hero layout: large name, role, tagline, portrait, CV button, socials |
| `"skills"`  | Skill grid with category chips                                      |
| _(missing)_ | Default: **timeline** of `InfoCard` components                       |

Unknown hints fall back to the timeline. You'll never break the site by adding a hint the renderer doesn't know.

### Recognized item fields (all optional)

`title`, `subtitle`, `description`, `date`, `image`, `link`, `pdf`, `tags`. Everything else is rendered as a key/value row.

For bio data (section: `"bio"`): `name`, `role`, `tagline`, `description`, `location`, `email`, `phone`, `image`, `resume`, `github`, `linkedin`, `scholar`, `twitter`.

### Assets

Anything inside `/home/assets/` is copied verbatim into the built site. Reference it from markdown using a path relative to `/home`, e.g. `"image": "assets/portrait.jpg"`. Absolute URLs (`https://…`) pass through unchanged.

---

## 3. Adding a new page

Create a subfolder of `/home` and drop `.md` files in it.

```
/home/publications/
   PAPERS.md
```

After the next build, the nav gets a **Publications** link and `/#/publications` renders those files. No code changes.

---

## 4. Layout features

- **Hero / bio** with animated gradient name, terminal-style role line with blinking cursor, portrait framed by emerald corner accents, and a glowing CV download button.
- **Timeline sections** — one card per row, anchored to a vertical neon spine with pulsing emerald dots. Soft blurred glow behind the line.
- **Ambient background** — slow-floating emerald glow blobs behind the entire site.
- **On-scroll reveal** — cards fade and slide in as they enter the viewport.
- **Hover states** — borders transition to emerald, cards lift slightly, cornerspot glow appears.
- **Responsive** — two-column hero collapses, cards reflow, spine position adjusts.

---

## 5. GitHub Pages deployment

### Option A — `gh-pages` branch

```bash
# If your repo is at username.github.io/repo-name:
export BASE_PATH="/repo-name/"
npm run deploy
```

Then in GitHub → Settings → Pages, select the `gh-pages` branch as the source.

For `username.github.io` (user/org site) or a custom domain, leave `BASE_PATH` unset.

### Option B — GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run build
        env:
          BASE_PATH: /${{ github.event.repository.name }}/
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Then set Settings → Pages → Source to **GitHub Actions**.

### Why hash routing?

URLs use `/#/projects` rather than `/projects` so direct navigation and page refresh work on GitHub Pages without a 404-redirect hack. If you move to Netlify/Vercel later, you can switch to `BrowserRouter` in `src/App.jsx`.

---

## 6. Deferred features (per spec §14)

Not built yet — tell me when you want any of them:

- Search
- Filtering / sorting by date
- Tag grouping
- Blog-style posts

---

## 7. File map

```
portfolio/
├── home/                                 your content
├── public/                               auto-populated at build time
├── scripts/generate-manifest.js          scans /home, emits manifest
├── src/
│   ├── components/
│   │   ├── BioHero.jsx                   hero layout for the bio section
│   │   ├── InfoCard.jsx                  generic card for any item shape
│   │   ├── Nav.jsx                       auto-generated nav
│   │   ├── SkillsGrid.jsx                specialized skills renderer
│   │   └── Timeline.jsx                  neon vertical spine + dots
│   ├── lib/
│   │   ├── parseMarkdown.js              strict FORMAT/DATA parser
│   │   └── useContent.js                 runtime manifest + .md loader
│   ├── pages/DynamicPage.jsx             dispatches sections to renderers
│   ├── App.jsx                           routing + ambient background
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```
