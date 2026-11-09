import GithubSlugger from 'github-slugger';
import type { Root, Element, ElementContent, Text, RootContent } from 'hast';
import { visitParents, SKIP } from 'unist-util-visit-parents';

/** A bracketed fill-in field, e.g. "[UEI]" (written in markdown as \[UEI\]). */
export const PLACEHOLDER_RE = /\[[^\]]+\]/g;

const SKIP_TAGS = new Set(['a', 'code', 'pre', 'script', 'style']);

/**
 * rehype plugin: wraps every bracketed placeholder in text nodes in
 * <span class="ph">. Link syntax never reaches text nodes (it is parsed into <a>),
 * and text inside links/code is skipped.
 */
export function rehypePlaceholders() {
  return (tree: Root) => {
    visitParents(tree, 'text', (node: Text, ancestors) => {
      if (ancestors.some((a) => a.type === 'element' && SKIP_TAGS.has((a as Element).tagName))) return;
      const value = node.value;
      PLACEHOLDER_RE.lastIndex = 0;
      if (!PLACEHOLDER_RE.test(value)) return;
      PLACEHOLDER_RE.lastIndex = 0;
      const parent = ancestors[ancestors.length - 1] as Element | Root;
      const index = (parent.children as RootContent[]).indexOf(node);
      const out: ElementContent[] = [];
      let last = 0;
      for (const m of value.matchAll(PLACEHOLDER_RE)) {
        const start = m.index ?? 0;
        if (start > last) out.push({ type: 'text', value: value.slice(last, start) });
        out.push({
          type: 'element',
          tagName: 'span',
          properties: { className: ['ph'] },
          children: [{ type: 'text', value: m[0] }],
        });
        last = start + m[0].length;
      }
      if (last < value.length) out.push({ type: 'text', value: value.slice(last) });
      (parent.children as RootContent[]).splice(index, 1, ...(out as RootContent[]));
      return [SKIP, index + out.length];
    });
  };
}

/**
 * rehype plugin: wraps each <h2> and the content after it (up to the next h1/h2)
 * in <section class="doc-section" data-section="<h2 id>">. Used for print layout
 * and for styling specific sections (e.g. "Decisions flagged").
 */
export function rehypeSectionize() {
  return (tree: Root) => {
    const out: RootContent[] = [];
    let current: Element | null = null;
    for (const child of tree.children) {
      const isEl = child.type === 'element';
      const tag = isEl ? (child as Element).tagName : '';
      if (tag === 'h2') {
        const id = String((child as Element).properties?.id ?? '');
        current = {
          type: 'element',
          tagName: 'section',
          properties: { className: ['doc-section'], dataSection: id },
          children: [child as ElementContent],
        };
        out.push(current);
      } else if (tag === 'h1') {
        current = null;
        out.push(child);
      } else if (current) {
        current.children.push(child as ElementContent);
      } else {
        out.push(child);
      }
    }
    tree.children = out;
  };
}

/** Markdown inline syntax -> plain text (enough for headings and search). */
export function mdToPlain(s: string): string {
  return s
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/(?<!\\)\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<(https?:[^>]+)>/g, '$1')
    .replace(/\\([\[\]\\*_`#|>-])/g, '$1')
    .replace(/(\*\*|__)(.+?)\1/g, '$2')
    .replace(/(^|[^*])\*(?!\s)(.+?)\*/g, '$1$2')
    .replace(/`([^`]+)`/g, '$1');
}

export interface Heading {
  depth: number;
  text: string;
  id: string;
}

/** All ATX headings in document order, slugged exactly the way rehype-slug does. */
export function extractHeadings(md: string): Heading[] {
  const slugger = new GithubSlugger();
  const out: Heading[] = [];
  let inFence = false;
  for (const line of md.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    if (inFence) continue;
    const m = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (!m) continue;
    const text = mdToPlain(m[2]).trim();
    out.push({ depth: m[1].length, text, id: slugger.slug(text) });
  }
  return out;
}

export interface SearchSection {
  pageKey: string;
  route: string;
  pageLabel: string;
  heading: string;
  id: string;
  text: string;
}

/** Split a document into heading-led sections with plain-text bodies. */
export function buildSections(md: string, page: { key: string; route: string; label: string }): SearchSection[] {
  const headings = extractHeadings(md);
  const sections: SearchSection[] = [];
  let hi = 0;
  let cur: SearchSection | null = null;
  let inFence = false;
  for (const raw of md.split('\n')) {
    if (/^\s*(```|~~~)/.test(raw)) inFence = !inFence;
    if (!inFence && /^#{1,6}\s+/.test(raw)) {
      const h = headings[hi++];
      cur = { pageKey: page.key, route: page.route, pageLabel: page.label, heading: h.text, id: h.id, text: '' };
      sections.push(cur);
      continue;
    }
    if (!cur) continue;
    if (/^\s*\|?\s*:?-{3,}/.test(raw)) continue; // table delimiter row
    const line = mdToPlain(
      raw
        .replace(/^\s*>\s?/, '')
        .replace(/^\s*([-*+]|\d+\.)\s+(\[[ xX]\]\s+)?/, '')
        .replace(/\|/g, ' · ')
    ).replace(/\s+/g, ' ').trim();
    if (line && line !== '·') cur.text += (cur.text ? ' ' : '') + line.replace(/^· | ·$/g, '');
  }
  return sections;
}
