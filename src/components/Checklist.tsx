import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { checklist, type Status } from '../content';

const STORAGE_KEY = 'sx-checklist-v1';
const STATUSES: Status[] = ['Not started', 'Drafted', 'In review', 'Done'];
const TOTAL = checklist.items.length;

const STATUS_STYLE: Record<Status, string> = {
  'Not started': 'bg-slate-100 text-slate-800 border-slate-300',
  Drafted: 'bg-amber-100 text-amber-900 border-amber-300',
  'In review': 'bg-blue-100 text-blue-900 border-blue-300',
  Done: 'bg-green-100 text-green-900 border-green-300',
};
const STATUS_DOT: Record<Status, string> = {
  'Not started': 'bg-slate-400',
  Drafted: 'bg-amber-500',
  'In review': 'bg-blue-600',
  Done: 'bg-green-600',
};

type StatusMap = Record<number, Status>;

const defaults = (): StatusMap => Object.fromEntries(checklist.items.map((i) => [i.n, i.status]));

function load(): StatusMap {
  const base = defaults();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const saved = JSON.parse(raw) as Record<string, string>;
    for (const [k, v] of Object.entries(saved)) {
      const n = Number(k);
      if (n in base && (STATUSES as string[]).includes(v)) base[n] = v as Status;
    }
  } catch {
    /* storage unavailable or corrupt: fall back to defaults */
  }
  return base;
}

function save(map: StatusMap) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* storage unavailable: changes last for this visit only */
  }
}

function Chip({ pressed, onClick, children }: { pressed: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        pressed ? 'border-navy bg-navy text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-navy hover:text-navy'
      }`}
    >
      {children}
    </button>
  );
}

const toggle = <T,>(set: Set<T>, v: T) => {
  const next = new Set(set);
  if (next.has(v)) next.delete(v);
  else next.add(v);
  return next;
};

export default function ChecklistTable() {
  const [statuses, setStatuses] = useState<StatusMap>(load);
  const [dirty, setDirty] = useState(false);
  const [owners, setOwners] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<Set<Status>>(new Set());

  useEffect(() => {
    if (dirty) save(statuses);
  }, [statuses, dirty]);

  const ownerList = useMemo(() => Array.from(new Set(checklist.items.map((i) => i.owner))), []);

  const counts = useMemo(() => {
    const c: Record<Status, number> = { 'Not started': 0, Drafted: 0, 'In review': 0, Done: 0 };
    for (const i of checklist.items) c[statuses[i.n]]++;
    return c;
  }, [statuses]);
  const inProgress = counts.Drafted + counts['In review'];

  const rows = checklist.items.filter(
    (i) => (!owners.size || owners.has(i.owner)) && (!statusFilter.size || statusFilter.has(statuses[i.n])),
  );

  const reset = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setDirty(false);
    setStatuses(defaults());
  };

  const pct = (n: number) => `${(n / TOTAL) * 100}%`;

  return (
    <div className="not-prose my-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5" id="checklist">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-navy">Master Readiness Checklist</h3>
          <p className="mt-1 text-sm text-slate-700" aria-live="polite">
            <strong className="text-green-800">{counts.Done} done</strong>
            {' · '}
            <strong className="text-amber-800">{inProgress} in progress</strong> (Drafted + In review)
            {' · '}
            {counts['Not started']} not started — of {TOTAL}
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="no-print rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-navy hover:text-navy"
        >
          Reset to defaults
        </button>
      </div>

      <div className="mt-3 flex h-3 w-full overflow-hidden rounded-full bg-slate-200" aria-hidden="true">
        <div className="bg-green-600" style={{ width: pct(counts.Done) }} />
        <div className="bg-blue-600" style={{ width: pct(counts['In review']) }} />
        <div className="bg-amber-500" style={{ width: pct(counts.Drafted) }} />
      </div>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-700">
        {(['Done', 'In review', 'Drafted', 'Not started'] as Status[]).map((s) => (
          <li key={s} className="flex items-center gap-1.5">
            <span className={`inline-block h-2.5 w-2.5 rounded-full ${STATUS_DOT[s]}`} aria-hidden="true" />
            {s}: {counts[s]}
          </li>
        ))}
      </ul>

      <div className="no-print mt-4 space-y-2">
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by owner">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-slate-600">Owner</span>
          <Chip pressed={!owners.size} onClick={() => setOwners(new Set())}>All</Chip>
          {ownerList.map((o) => (
            <Chip key={o} pressed={owners.has(o)} onClick={() => setOwners((s) => toggle(s, o))}>{o}</Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by status">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-slate-600">Status</span>
          <Chip pressed={!statusFilter.size} onClick={() => setStatusFilter(new Set())}>All</Chip>
          {STATUSES.map((s) => (
            <Chip key={s} pressed={statusFilter.has(s)} onClick={() => setStatusFilter((f) => toggle(f, s))}>{s}</Chip>
          ))}
        </div>
      </div>

      <div className="table-wrap mt-4" tabIndex={0} role="region" aria-label="Master readiness checklist">
        <table className="checklist">
          <thead>
            <tr>
              <th scope="col" className="w-10">#</th>
              <th scope="col">Item</th>
              <th scope="col">Owner</th>
              <th scope="col">Status</th>
              <th scope="col">Document</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((i) => {
              const s = statuses[i.n];
              const external = /^https?:\/\//.test(i.route);
              return (
                <tr key={i.n}>
                  <td className="tabular-nums text-slate-600">{i.n}</td>
                  <td className="min-w-[14rem]">{i.item}</td>
                  <td className="min-w-[8rem]">{i.owner}</td>
                  <td>
                    <select
                      aria-label={`Status for item ${i.n}: ${i.item}`}
                      value={s}
                      onChange={(e) => {
                        const v = e.target.value as Status;
                        setDirty(true);
                        setStatuses((m) => ({ ...m, [i.n]: v }));
                      }}
                      className={`status-select rounded-md border px-2 py-1 text-xs font-semibold ${STATUS_STYLE[s]}`}
                    >
                      {STATUSES.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </td>
                  <td className="min-w-[10rem]">
                    {external ? (
                      <a href={i.route} target="_blank" rel="noopener noreferrer" className="ext">{i.docLabel}</a>
                    ) : (
                      <Link to={i.route}>{i.docLabel}</Link>
                    )}
                  </td>
                </tr>
              );
            })}
            {!rows.length && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-slate-600">No items match these filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
