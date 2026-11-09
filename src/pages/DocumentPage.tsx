import { useLayoutEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Markdown from '../components/Markdown';
import ChecklistTable from '../components/Checklist';
import { TocCollapsible, TocRail } from '../components/Toc';
import { useSetFieldCount } from '../components/Layout';
import { CHECKLIST_MARKER, type DocPage } from '../content';
import { extractHeadings } from '../lib/markdown';

function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 rounded-md border border-navy px-3 py-1.5 text-sm font-semibold text-navy hover:bg-navy hover:text-white"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1h-2M6 14h12v7H6z" strokeLinejoin="round" />
      </svg>
      Print / Save as PDF
    </button>
  );
}

export default function DocumentPage({ page }: { page: DocPage }) {
  const ref = useRef<HTMLDivElement>(null);
  const setFields = useSetFieldCount();
  const location = useLocation();
  const headings = useMemo(() => extractHeadings(page.md).filter((h) => h.depth === 2), [page.md]);

  const parts = useMemo(() => {
    const i = page.md.indexOf(CHECKLIST_MARKER);
    return i < 0 ? null : [page.md.slice(0, i), page.md.slice(i + CHECKLIST_MARKER.length)];
  }, [page.md]);

  // Count rendered placeholders for the header badge.
  useLayoutEffect(() => {
    setFields(ref.current ? ref.current.querySelectorAll('.ph').length : null);
    return () => setFields(null);
  }, [page, setFields]);

  // Scroll to the hash target (search results, TOC links), or to top on page change.
  useLayoutEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) {
      window.scrollTo(0, 0);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ block: 'start' });
      el.classList.add('flash');
      const t = window.setTimeout(() => el.classList.remove('flash'), 1800);
      return () => window.clearTimeout(t);
    }
  }, [location.pathname, location.hash]);

  return (
    <div className={`flex gap-10 page-${page.key}`}>
      <div className="min-w-0 flex-1">
        <div className="no-print mb-4 flex justify-end">
          <PrintButton />
        </div>
        <TocCollapsible headings={headings} />
        <article ref={ref} className="doc prose prose-slate max-w-none">
          {parts ? (
            <>
              <Markdown md={parts[0]} />
              <ChecklistTable />
              <Markdown md={parts[1]} />
            </>
          ) : (
            <Markdown md={page.md} />
          )}
        </article>
      </div>
      <TocRail headings={headings} />
    </div>
  );
}
