#!/usr/bin/env node
/**
 * generate-manifest.js
 *
 * Scans /home, copies content + assets into /public/home, and writes
 * /public/manifest.json.
 *
 * Content model
 * -------------
 *   home/NN-NAME.json   → one section of the single-page site, ordered by NN
 *   home/gallery/*.json → gallery albums (rendered on the separate /gallery route)
 *   home/assets/*       → images, PDFs, anything referenced from content
 *
 * Adding a new section = adding a new numbered JSON file. No code changes.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'home');
const PUBLIC = path.join(ROOT, 'public');
const DEST = path.join(PUBLIC, 'home');
const MANIFEST = path.join(PUBLIC, 'manifest.json');

const COPY_EXT = new Set([
  '.json', '.md',
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif',
  '.pdf', '.mp4', '.webm',
]);

function rmrf(t) {
  if (fs.existsSync(t)) fs.rmSync(t, { recursive: true, force: true });
}

function copyTree(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name);
    const d = path.join(dest, e.name);
    if (e.isDirectory()) copyTree(s, d);
    else if (e.isFile() && COPY_EXT.has(path.extname(e.name).toLowerCase())) {
      fs.copyFileSync(s, d);
    }
  }
}

/** Numeric prefix controls section order; unprefixed files sort last. */
function orderOf(name) {
  const m = name.match(/^(\d+)[-_]/);
  return m ? parseInt(m[1], 10) : 9999;
}

function readSectionMeta(absPath) {
  try {
    const obj = JSON.parse(fs.readFileSync(absPath, 'utf8'));
    const fmt = obj.format || {};
    return {
      section: fmt.section || null,
      label: fmt.label || null,
      title: fmt.title || null,
    };
  } catch {
    return null; // invalid JSON — skipped, site still builds
  }
}

function build() {
  if (!fs.existsSync(SRC)) return { sections: [], gallery: [] };

  const sections = fs
    .readdirSync(SRC, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.json'))
    .sort((a, b) => orderOf(a.name) - orderOf(b.name) || a.name.localeCompare(b.name))
    .map((e) => {
      const meta = readSectionMeta(path.join(SRC, e.name));
      if (!meta || !meta.section) {
        console.warn(`[manifest] skipping ${e.name} (no format.section or invalid JSON)`);
        return null;
      }
      return {
        file: `home/${e.name}`,
        id: meta.section,
        label: meta.label,
        title: meta.title,
      };
    })
    .filter(Boolean);

  const galleryDir = path.join(SRC, 'gallery');
  const gallery = fs.existsSync(galleryDir)
    ? fs
        .readdirSync(galleryDir, { withFileTypes: true })
        .filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.json'))
        .sort((a, b) => orderOf(a.name) - orderOf(b.name) || a.name.localeCompare(b.name))
        .map((e) => `home/gallery/${e.name}`)
    : [];

  return { sections, gallery };
}

rmrf(DEST);
if (fs.existsSync(SRC)) copyTree(SRC, DEST);
fs.mkdirSync(PUBLIC, { recursive: true });

const manifest = build();
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
fs.writeFileSync(path.join(PUBLIC, '.nojekyll'), '');

console.log(
  `[manifest] ${manifest.sections.length} section(s), ${manifest.gallery.length} gallery file(s).`
);
