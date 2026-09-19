/**
 * richText.jsx
 *
 * Content authors can write inline HTML inside any text field:
 *
 *   "description": "Built at <strong>UofM</strong>. See the <a href='...'>repo</a>."
 *
 * Everything is passed through a whitelist sanitizer first. Tags outside the
 * allowlist are unwrapped (their text survives), and every attribute except a
 * short allowlist is dropped — so no scripts, no event handlers, no iframes,
 * no javascript: URLs.
 */

const ALLOWED_TAGS = new Set([
  'a', 'b', 'strong', 'i', 'em', 'u', 's', 'code', 'kbd', 'mark',
  'br', 'p', 'span', 'small', 'sup', 'sub',
  'ul', 'ol', 'li', 'blockquote',
]);

const ALLOWED_ATTRS = {
  a: new Set(['href', 'title', 'target', 'rel']),
  span: new Set(['class']),
  code: new Set(['class']),
};

const SAFE_URL = /^(https?:|mailto:|tel:|#|\/|\.\/|\.\.\/)/i;

/** True when a string looks like it contains markup worth parsing. */
export function hasHtml(s) {
  return typeof s === 'string' && /<[a-z][\s\S]*>/i.test(s);
}

function cleanNode(node, doc) {
  // Element nodes only; text nodes pass through untouched.
  if (node.nodeType === 3) return;
  if (node.nodeType !== 1) {
    node.remove();
    return;
  }

  const tag = node.tagName.toLowerCase();

  // Recurse first so children are cleaned even if the parent is unwrapped.
  Array.from(node.childNodes).forEach((child) => cleanNode(child, doc));

  if (!ALLOWED_TAGS.has(tag)) {
    // Unwrap: keep the text, discard the element.
    const parent = node.parentNode;
    if (!parent) return;
    while (node.firstChild) parent.insertBefore(node.firstChild, node);
    parent.removeChild(node);
    return;
  }

  const allowed = ALLOWED_ATTRS[tag] || new Set();
  Array.from(node.attributes).forEach((attr) => {
    const name = attr.name.toLowerCase();
    if (!allowed.has(name)) {
      node.removeAttribute(attr.name);
      return;
    }
    if (name === 'href' && !SAFE_URL.test(attr.value.trim())) {
      node.removeAttribute(attr.name);
    }
  });

  // External links open safely in a new tab.
  if (tag === 'a') {
    const href = node.getAttribute('href') || '';
    if (/^https?:/i.test(href)) {
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener noreferrer');
    }
  }
}

export function sanitizeHtml(html) {
  if (typeof html !== 'string' || html.length === 0) return '';
  if (typeof window === 'undefined' || !window.DOMParser) {
    // No DOM available — strip all tags rather than risk raw output.
    return html.replace(/<[^>]*>/g, '');
  }
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html');
  const root = doc.body.firstChild;
  if (!root) return '';
  Array.from(root.childNodes).forEach((n) => cleanNode(n, doc));
  return root.innerHTML;
}

/**
 * Render a possibly-HTML string. Plain strings render as plain text, so
 * there is no cost or risk when an author writes no markup at all.
 */
export default function RichText({ children, as: Tag = 'span', className = '' }) {
  if (children === null || children === undefined) return null;
  const text = typeof children === 'string' ? children : String(children);
  if (!hasHtml(text)) return <Tag className={className}>{text}</Tag>;
  return (
    <Tag
      className={`rich ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(text) }}
    />
  );
}

/** Strip markup for previews, search indexes, and alt text. */
export function toPlainText(s) {
  if (typeof s !== 'string') return '';
  return s.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}
