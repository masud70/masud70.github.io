/**
 * parseMarkdown.js
 *
 * Strict parser per spec §3:
 *   # FORMAT
 *   <JSON schema>
 *
 *   # DATA
 *   <JSON data>
 *
 * All fields optional. Invalid JSON → skip. Empty data → skip.
 *
 * The schema may optionally include a top-level "section" hint
 * (e.g. "section": "bio" or "section": "skills") which the renderer uses
 * to pick a specialized layout. Unknown hints fall back to the default
 * timeline card layout — so the site never breaks on unrecognized schemas.
 */

const HEADING_RE = /^\s*#\s+([A-Za-z]+)\s*$/;

function stripFence(s) {
  const trimmed = s.trim();
  const m = trimmed.match(/^```(?:json|JSON)?\s*\n([\s\S]*?)\n```\s*$/);
  return m ? m[1] : trimmed;
}

function splitSections(raw) {
  const lines = raw.split(/\r?\n/);
  const sections = {};
  let key = null;
  let buf = [];
  const flush = () => {
    if (key !== null) sections[key] = buf.join('\n');
  };
  for (const line of lines) {
    const m = line.match(HEADING_RE);
    if (m) {
      flush();
      key = m[1].toUpperCase();
      buf = [];
    } else if (key !== null) {
      buf.push(line);
    }
  }
  flush();
  return sections;
}

export function parseMarkdown(raw) {
  if (typeof raw !== 'string' || raw.length === 0) return null;
  let sections;
  try {
    sections = splitSections(raw);
  } catch {
    return null;
  }
  if (sections.FORMAT === undefined || sections.DATA === undefined) return null;

  let schema, data;
  try {
    schema = JSON.parse(stripFence(sections.FORMAT));
    data = JSON.parse(stripFence(sections.DATA));
  } catch {
    return null;
  }

  if (data === null || data === undefined) return null;
  if (Array.isArray(data) && data.length === 0) return null;
  if (typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length === 0) {
    return null;
  }

  return { schema, data };
}

export function titleFromPath(filePath) {
  const base = (filePath.split('/').pop() || filePath).replace(/\.md$/i, '');
  // Strip numeric ordering prefix like "01-" or "02_"
  const cleaned = base.replace(/^\d+[-_]/, '');
  return cleaned
    .replace(/[-_]+/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
