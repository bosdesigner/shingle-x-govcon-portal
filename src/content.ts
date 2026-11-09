import roadmapMd from '../content/00-readiness-roadmap.md?raw';
import capabilityMd from '../content/01-capability-statement.md?raw';
import complianceMd from '../content/02-compliance-manual.md?raw';
import taaMd from '../content/03-taa-country-of-origin.md?raw';
import cyberMd from '../content/04-cybersecurity-policy.md?raw';
import regulatoryMd from '../content/05-regulatory-quality-file.md?raw';
import fssMd from '../content/06-va-fss-offer-package.md?raw';
import pastPerfMd from '../content/07-past-performance-corporate-file.md?raw';
import checklistJson from '../content/checklist.json';

export type Status = 'Not started' | 'Drafted' | 'In review' | 'Done';

export interface ChecklistItem {
  n: number;
  item: string;
  owner: string;
  status: Status;
  docLabel: string;
  route: string;
}

export interface Checklist {
  asOf: string;
  statusOptions: Status[];
  items: ChecklistItem[];
}

export const checklist = checklistJson as Checklist;

export interface DocPage {
  key: string;
  route: string;
  label: string;
  md: string;
  title: string;
}

const titleOf = (md: string) => (md.match(/^#\s+(.+)$/m)?.[1] ?? '').trim();

const defs: Omit<DocPage, 'title'>[] = [
  { key: 'roadmap', route: '/', label: 'Readiness Roadmap', md: roadmapMd },
  { key: 'capability', route: '/capability-statement', label: '1 · Capability Statement', md: capabilityMd },
  { key: 'compliance', route: '/compliance-manual', label: '2 · Compliance Manual', md: complianceMd },
  { key: 'taa', route: '/taa-country-of-origin', label: '3 · TAA / Country of Origin', md: taaMd },
  { key: 'cyber', route: '/cybersecurity-policy', label: '4 · Cybersecurity Policy', md: cyberMd },
  { key: 'regulatory', route: '/regulatory-quality', label: '5 · Regulatory & Quality File', md: regulatoryMd },
  { key: 'fss', route: '/va-fss-offer', label: '6 · VA FSS Offer Package', md: fssMd },
  { key: 'pastperf', route: '/past-performance', label: '7 · Past Performance & Corporate File', md: pastPerfMd },
];

export const pages: DocPage[] = defs.map((d) => ({ ...d, title: titleOf(d.md) }));

export const CHECKLIST_MARKER = '<!-- CHECKLIST -->';

/** "2026-11-09" -> "November 9, 2026" without timezone drift. */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return y && m && d ? `${months[m - 1]} ${d}, ${y}` : iso;
}
