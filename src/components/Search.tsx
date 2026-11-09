import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { pages } from '../content';
import { buildSections, type SearchSection } from '../lib/markdown';

const INDEX: SearchSection[] = pages.flatMap((p) => buildSections(p.md, p));

interface Result extends SearchSection {
  score: number;
  snippet: string;
}

function snippetFor(text: string, terms: string[]): string {
  const lower = text.toLowerCase();
  let at = -1;
  for (const t of terms) {
    const i = lower.indexOf(t);
    if (i > -1 && (at === -1 || i < at)) at = i;
  }
  if (at < 0) return text.slice(0, 140) + (text.length > 140 ? '…' : '');
  const start = Math.max(0, at - 50);
  const end = Math.min(text.length, at + 110);
  return (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
}

function search(q: string): Result[] {
  const query = q.trim().toLowerCase();
  if (query.length < 2) return [];
  const terms = query.split(/\s+/).filter(Boolean);
  const results: Result[] = [];
  for (const s of INDEX) {
    const h = s.heading.toLowerCase();
    const b = s.text.toLowerCase();
    if (!terms.every((t) => h.includes(t) || b.includes(t))) continue;
    let score = 0;
    if (h.includes(query)) score += 100;
    if (b.includes(query)) score += 40;
    score += terms.filter((t) => h.includes(t)).length * 10;
    score += Math.min(10, b.split(query).length - 1);
    results.push({ ...s, score, snippet: snippetFor(s.text || s.heading, [query, ...terms]) });
  }
  return results.sort((a, b) => b.score - a.score).slice(0, 25);
}

function Highlight({ text, query }: { text: string; query: string }) {
  const terms = query.trim().split(/\s+/).filter((t) => t.length > 1).map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (!terms.length) return <>{text}</>;
  const re = new RegExp(`(${terms.join('|')})`, 'ig');
  return (
    <>
      {text.split(re).map((part, i) => (i % 2 ? <mark key={i} className="bg-gold-100 text-slate-900 rounded-sm">{part}</mark> : part))}
    </>
  );
}

export default function Search() {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const boxRef = useRef<HTMLDivElement>(null);
  const results = useMemo(() => search(q), [q]);

  useEffect(() => setOpen(false), [location.pathname, location.hash]);
  useEffect(() => setActive(0), [q]);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const go = (r: Result) => {
    setOpen(false);
    navigate(`${r.route}#${r.id}`);
  };

  return (
    <div ref={boxRef} className="no-print relative w-full sm:w-72 lg:w-80" role="search">
      <label htmlFor="global-search" className="sr-only">Search all documents</label>
      <input
        id="global-search"
        type="search"
        value={q}
        placeholder="Search all documents…"
        autoComplete="off"
        onChange={(e) => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false);
          if (!results.length) return;
          if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(results.length - 1, a + 1)); }
          if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
          if (e.key === 'Enter') { e.preventDefault(); go(results[active]); }
        }}
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-navy focus:outline-none focus:ring-2 focus:ring-gold/40"
      />
      {open && q.trim().length >= 2 && (
        <div className="absolute right-0 z-50 mt-1 max-h-[70vh] w-[min(32rem,calc(100vw-2rem))] overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl">
          <p className="border-b border-slate-100 px-3 py-2 text-xs text-slate-600" aria-live="polite">
            {results.length ? `${results.length} result${results.length === 1 ? '' : 's'}` : 'No matches'}
          </p>
          <ul>
            {results.map((r, i) => (
              <li key={`${r.route}#${r.id}`}>
                <a
                  href={`${r.route}#${r.id}`}
                  onClick={(e) => { e.preventDefault(); go(r); }}
                  onMouseEnter={() => setActive(i)}
                  className={`block border-b border-slate-100 px-3 py-2.5 ${i === active ? 'bg-navy-50' : ''}`}
                >
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-gold-700">{r.pageLabel}</span>
                  <span className="block text-sm font-semibold text-navy"><Highlight text={r.heading} query={q} /></span>
                  <span className="mt-0.5 block text-xs leading-snug text-slate-600"><Highlight text={r.snippet} query={q} /></span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
