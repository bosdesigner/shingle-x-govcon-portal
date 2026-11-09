import type { Heading } from '../lib/markdown';

function TocList({ headings }: { headings: Heading[] }) {
  return (
    <ol className="space-y-1.5 text-sm">
      {headings.map((h) => (
        <li key={h.id}>
          <a href={`#${h.id}`} className="block text-slate-600 hover:text-navy hover:underline leading-snug">
            {h.text}
          </a>
        </li>
      ))}
    </ol>
  );
}

export function TocRail({ headings }: { headings: Heading[] }) {
  if (!headings.length) return null;
  return (
    <nav aria-label="On this page" className="no-print hidden xl:block w-60 shrink-0">
      <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto border-l-2 border-gold-100 pl-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold-700">On this page</p>
        <TocList headings={headings} />
      </div>
    </nav>
  );
}

export function TocCollapsible({ headings }: { headings: Heading[] }) {
  if (!headings.length) return null;
  return (
    <details className="no-print xl:hidden mb-6 rounded-lg border border-slate-200 bg-slate-50">
      <summary className="cursor-pointer select-none px-4 py-2.5 text-sm font-semibold text-navy">On this page</summary>
      <nav aria-label="On this page" className="px-4 pb-3">
        <TocList headings={headings} />
      </nav>
    </details>
  );
}
