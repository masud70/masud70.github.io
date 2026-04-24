#!/usr/bin/env node
/**
 * generate-manifest.js
 *
 * Scans /home, copies .md files and /home/assets into public/home,
 * and writes public/manifest.json describing pages and ordering.
 *
 * Ordering rules for files inside a page:
 *   1. If a file has a numeric prefix (e.g. "01-BIO.md", "02-EDUCATION.md"),
 *      it is sorted by that prefix.
 *   2. Otherwise, sorted alphabetically.
 *
 * The numeric-prefix convention lets you control which sections appear first
 * on each page (per spec §16: no hardcoded content).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const SRC_HOME = path.join(ROOT, 'home');
const PUBLIC_DIR = path.join(ROOT, 'public');
const DEST_HOME = path.join(PUBLIC_DIR, 'home');
const MANIFEST_PATH = path.join(PUBLIC_DIR, 'manifest.json');

const ASSET_EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg',
  '.pdf', '.mp4', '.webm', '.mp3',
]);

function rmrf(target) {
  if (fs.existsSync(target)) fs.rmSync(target, { recursive: true, force: true });
}

function copyTree(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyTree(s, d);
    } else if (entry.isFile()) {
      const lower = entry.name.toLowerCase();
      const ext = path.extname(lower);
      if (lower.endsWith('.md') || ASSET_EXTENSIONS.has(ext)) {
        fs.copyFileSync(s, d);
      }
    }
  }
}

function orderKey(filename) {
  const m = filename.match(/^(\d+)[-_]/);
  return m ? parseInt(m[1], 10) : 9999;
}

function sortFiles(filenames) {
  return [...filenames].sort((a, b) => {
    const ka = orderKey(path.basename(a));
    const kb = orderKey(path.basename(b));
    if (ka !== kb) return ka - kb;
    return a.localeCompare(b);
  });
}

function prettifyName(slug) {
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildManifest() {
  if (!fs.existsSync(SRC_HOME)) return { pages: [] };

  const pages = [];

  // Homepage files (directly under /home, excluding assets folder)
  const rootFiles = fs
    .readdirSync(SRC_HOME, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.md'))
    .map((e) => `home/${e.name}`);

  pages.push({ route: '/', name: 'Home', files: sortFiles(rootFiles) });

  // Subfolders (skip 'assets' - reserved for static files)
  const subdirs = fs
    .readdirSync(SRC_HOME, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name.toLowerCase() !== 'assets')
    .map((e) => e.name)
    .sort();

  for (const dir of subdirs) {
    const dirPath = path.join(SRC_HOME, dir);
    const files = [];
    (function walk(cur, rel) {
      for (const entry of fs.readdirSync(cur, { withFileTypes: true })) {
        const abs = path.join(cur, entry.name);
        const nextRel = `${rel}/${entry.name}`;
        if (entry.isDirectory()) {
          walk(abs, nextRel);
        } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
          files.push(`home/${nextRel}`);
        }
      }
    })(dirPath, dir);

    pages.push({
      route: `/${dir}`,
      name: prettifyName(dir),
      files: sortFiles(files),
    });
  }

  return { pages };
}

// Main
rmrf(DEST_HOME);
if (fs.existsSync(SRC_HOME)) copyTree(SRC_HOME, DEST_HOME);
fs.mkdirSync(PUBLIC_DIR, { recursive: true });
const manifest = buildManifest();
fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
fs.writeFileSync(path.join(PUBLIC_DIR, '.nojekyll'), '');

const total = manifest.pages.reduce((n, p) => n + p.files.length, 0);
console.log(`[manifest] ${manifest.pages.length} page(s), ${total} markdown file(s) indexed.`);
