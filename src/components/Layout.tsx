import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { checklist, formatDate, pages } from '../content';
import Search from './Search';

const FieldsContext = createContext<(n: number | null) => void>(() => {});
export const useSetFieldCount = () => useContext(FieldsContext);

export const FOOTER_TEXT =
  'Internal draft — not legal advice. Have a government-contracts attorney review before any offer is submitted. Clause numbers are changing under the Revolutionary FAR Overhaul; verify against the current solicitation.';

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <ul className="space-y-1">
      {pages.map((p) => (
        <li key={p.route}>
          <NavLink
            to={p.route}
            end={p.route === '/'}
            onClick={onNavigate}
            className={({ isActive }) =>
              `block rounded-md border-l-4 px-3 py-2 text-sm leading-snug transition-colors ${
                isActive
                  ? 'border-gold bg-navy-50 font-semibold text-navy'
                  : 'border-transparent text-slate-700 hover:bg-slate-100 hover:text-navy'
              }`
            }
          >
            {p.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

export default function Layout() {
  const [fields, setFields] = useState<number | null>(null);
  const [drawer, setDrawer] = useState(false);
  const location = useLocation();
  const closeRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setDrawer(false), [location.pathname]);
  useEffect(() => {
    if (!drawer) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDrawer(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      menuRef.current?.focus();
    };
  }, [drawer]);

  const current = pages.find((p) => p.route === location.pathname);
  useEffect(() => {
    document.title = current ? `${current.label} — Shingle X Readiness Portal` : 'Shingle X — Federal Contracting Readiness Portal';
  }, [current]);

  return (
    <FieldsContext.Provider value={setFields}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[100] focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-navy focus:shadow">
        Skip to content
      </a>
      <header className="site-header sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="h-1 bg-gradient-to-r from-navy via-navy to-gold" aria-hidden="true" />
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 lg:px-6">
          <button
            ref={menuRef}
            type="button"
            className="-ml-1 rounded-md p-2 text-navy hover:bg-slate-100 lg:hidden"
            aria-label="Open navigation"
            aria-expanded={drawer}
            aria-controls="nav-drawer"
            onClick={() => setDrawer(true)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold leading-snug text-navy sm:text-base">
              Shingle X <span className="text-gold-700">—</span> Federal Contracting Readiness Portal
            </p>
            <p className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <span>As of {formatDate(checklist.asOf)}</span>
              {fields !== null && fields > 0 && (
                <span className="rounded-full border border-yellow-300 bg-yellow-100 px-2 py-0.5 font-semibold text-yellow-900">
                  {fields} field{fields === 1 ? '' : 's'} to fill
                </span>
              )}
              {fields === 0 && (
                <span className="rounded-full border border-green-300 bg-green-50 px-2 py-0.5 font-semibold text-green-800">No fields to fill</span>
              )}
            </p>
          </div>
          <div className="order-last flex w-full items-center gap-2 sm:order-none sm:w-auto">
            <Search />
            <form method="post" action="/logout" className="shrink-0">
              <button type="submit" className="rounded-md px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-navy">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="site-sidebar hidden w-64 shrink-0 border-r border-slate-200 bg-slate-50/60 lg:block">
          <nav aria-label="Documents" className="sticky top-[73px] max-h-[calc(100vh-73px)] overflow-y-auto p-4">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gold-700">Documents</p>
            <NavList />
          </nav>
        </aside>

        {drawer && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation" id="nav-drawer">
            <div className="absolute inset-0 bg-slate-900/40" onClick={() => setDrawer(false)} aria-hidden="true" />
            <nav aria-label="Documents" className="absolute inset-y-0 left-0 w-72 max-w-[85vw] overflow-y-auto bg-white p-4 shadow-xl">
              <div className="mb-3 flex items-center justify-between">
                <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gold-700">Documents</p>
                <button ref={closeRef} type="button" aria-label="Close navigation" onClick={() => setDrawer(false)} className="rounded-md p-2 text-slate-600 hover:bg-slate-100">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <NavList onNavigate={() => setDrawer(false)} />
            </nav>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <main id="main" tabIndex={-1} className="px-4 py-6 sm:px-6 lg:px-10 lg:py-8 focus:outline-none">
            <Outlet />
          </main>
          <footer className="site-footer border-t border-slate-200 bg-slate-50 px-4 py-5 text-xs leading-relaxed text-slate-600 sm:px-6 lg:px-10">
            {FOOTER_TEXT}
          </footer>
        </div>
      </div>
    </FieldsContext.Provider>
  );
}
