# BUILD FILE — Shingle X Federal Contracting Readiness Portal

> **How to use this file in Replit:** Create a new Replit App and paste **PART 1 (Build Prompt)** into Replit Agent. Then upload this whole file (or paste PART 2) and tell the Agent: *"Create each file exactly as delimited in PART 2 and wire it into the app."* Every content file is marked with `=== FILE: path ===` and `=== END FILE ===`.

---

# PART 1 — BUILD PROMPT (paste into Replit Agent)

Build an internal web portal called **"Shingle X — Federal Contracting Readiness Portal."** It publishes a suite of government-contracting compliance documents for Shingle X LLC, a wound-care / skin-care products company preparing to sell to the U.S. Department of Veterans Affairs (VA) and other federal buyers. The content is already written. Your job is the app shell, navigation, interactivity and print output. **Do not rewrite, summarize or "improve" any document text.** Render it exactly as provided.

## Stack
- Vite + React + TypeScript + Tailwind CSS. Use `react-router-dom` for routing.
- Render markdown with `react-markdown` + `remark-gfm` (tables, task lists) + `rehype-slug` + `rehype-autolink-headings`.
- Content lives in `/content/*.md` and `/content/checklist.json`. Import the markdown as raw strings (`?raw`).
- No backend is required for v1. Persist checklist status in `localStorage`, and wrap every read and write in try/catch.

## Access control (required)
These are internal compliance and pricing documents. Gate the whole site:
- Use **Replit Auth** if it's available. Otherwise use a single shared-password gate: the password is checked against the `PORTAL_PASSWORD` environment variable through a tiny Express endpoint, with a session cookie.
- Add `<meta name="robots" content="noindex,nofollow">` and a `robots.txt` that disallows everything.

## Pages and routes
| Route | Source file | Nav label |
|---|---|---|
| `/` | `content/00-readiness-roadmap.md` + `content/checklist.json` | Readiness Roadmap |
| `/capability-statement` | `content/01-capability-statement.md` | 1 · Capability Statement |
| `/compliance-manual` | `content/02-compliance-manual.md` | 2 · Compliance Manual |
| `/taa-country-of-origin` | `content/03-taa-country-of-origin.md` | 3 · TAA / Country of Origin |
| `/cybersecurity-policy` | `content/04-cybersecurity-policy.md` | 4 · Cybersecurity Policy |
| `/regulatory-quality` | `content/05-regulatory-quality-file.md` | 5 · Regulatory & Quality File |
| `/va-fss-offer` | `content/06-va-fss-offer-package.md` | 6 · VA FSS Offer Package |
| `/past-performance` | `content/07-past-performance-corporate-file.md` | 7 · Past Performance & Corporate File |

## Layout
- **Desktop:** a left sidebar with the 8 nav items, the active item highlighted, and a sticky header with the portal title and an "As of" date (from `checklist.json` → `asOf`).
- **Mobile:** the sidebar collapses into a hamburger drawer. Tables scroll horizontally inside their own container, so they never break the page width.
- Each document page gets an auto-generated "On this page" table of contents built from its `##` headings: right rail on desktop, collapsible at the top on mobile.
- A global search box filters across all documents by heading and paragraph text. Show results with the page name and a jump link to the heading anchor.

## Readiness Roadmap page (`/`) — interactive
1. Render the markdown in `00-readiness-roadmap.md` **up to the marker line** `<!-- CHECKLIST -->`.
2. At that marker, render an interactive **Master Readiness Checklist** from `checklist.json`:
   - Columns: #, Item, Owner, Status, Document (a link to that document's route).
   - Status is a dropdown with exactly: `Not started`, `Drafted`, `In review`, `Done`. Use the colors gray, amber, blue and green.
   - On first load, take each item's initial status from the JSON. After the user changes one, store it in localStorage under key `sx-checklist-v1`.
   - Above the table, show a progress bar: count of `Done`, plus count of `Drafted` + `In review`, out of 17. Add a "Reset to defaults" button.
   - Add filter chips by Owner and by Status.
3. Render the rest of the markdown after the marker.
4. The "Decisions flagged" table gets a visible amber left border, so it reads as open decisions.

## Placeholders
The documents contain bracketed fill-in fields like `[UEI]`, `[name, title]` and `[$]` (written in markdown as `\[...\]`).
- Visually highlight every bracketed placeholder in rendered text as a yellow pill, using a small rehype plugin that matches `\[[^\]]+\]` in text nodes. Don't match markdown link syntax.
- Show a per-page badge in the header: "N fields to fill."

## Print / PDF
- Each document page gets a **"Print / Save as PDF"** button that calls `window.print()`.
- Print CSS: hide the sidebar, header, search and TOC; use letter size, 0.6in margins, a 10.5pt base font; keep tables from splitting rows; print link URLs after link text for external links.
- The **Capability Statement** page gets a dedicated one-page print layout: two-column grid (snapshot table left, competencies and differentiators right), and it must fit on one letter page.

## Styling
- Clean, government-professional look: white background, slate text, navy accent (`#1e3a5f`), and a subtle gold accent for highlights.
- Font: Inter for UI and body. Headings are semibold, tables zebra-striped, links underlined on hover.
- External links open in a new tab with `rel="noopener noreferrer"`.

## Footer (every page)
"Internal draft — not legal advice. Have a government-contracts attorney review before any offer is submitted. Clause numbers are changing under the Revolutionary FAR Overhaul; verify against the current solicitation."

## Acceptance checks (verify before you call it done)
- [ ] All 8 routes render with no markdown syntax showing raw, and every table renders as a table.
- [ ] Checklist status changes persist after a page refresh, and Reset restores the JSON defaults.
- [ ] Every Document link in the checklist navigates to the correct route.
- [ ] Search finds "Price Reductions Clause" and jumps to the Compliance Manual section 6.
- [ ] Placeholders are highlighted, and the badge count is greater than 0 on the Capability Statement.
- [ ] The Capability Statement prints on one page in Chrome's print preview.
- [ ] The site requires login or password before any content is visible; robots noindex is present.
- [ ] Lighthouse accessibility score ≥ 90; the mobile layout has no horizontal page scroll.

---

# PART 2 — CONTENT FILES (create each exactly as written)

=== FILE: content/checklist.json ===
```json
{
  "asOf": "2026-11-09",
  "statusOptions": ["Not started", "Drafted", "In review", "Done"],
  "items": [
    { "n": 1,  "item": "UEI and CAGE code", "owner": "Greg Phillips", "status": "Done", "docLabel": "SAM.gov", "route": "https://sam.gov/" },
    { "n": 2,  "item": "Clear the SAM legal name / address mismatch (match the IRS EIN letter exactly)", "owner": "Compliance Officer", "status": "Not started", "docLabel": "7 · Past Performance & Corporate File", "route": "/past-performance" },
    { "n": 3,  "item": "SAM reps and certs completed; annual renewal reminder set", "owner": "Compliance Officer", "status": "Not started", "docLabel": "2 · Compliance Manual", "route": "/compliance-manual" },
    { "n": 4,  "item": "Capability statement (PDF)", "owner": "Ben Strout / Greg Phillips", "status": "Drafted", "docLabel": "1 · Capability Statement", "route": "/capability-statement" },
    { "n": 5,  "item": "Government Contracts Compliance Manual adopted, Compliance Officer named", "owner": "CEO + counsel", "status": "Drafted", "docLabel": "2 · Compliance Manual", "route": "/compliance-manual" },
    { "n": 6,  "item": "TAA policy + Product Origin Register + supplier origin certificates", "owner": "Ops lead", "status": "Drafted", "docLabel": "3 · TAA / Country of Origin", "route": "/taa-country-of-origin" },
    { "n": 7,  "item": "Information safeguarding policy (52.204-21 / 52.240-93)", "owner": "Ben Strout", "status": "Drafted", "docLabel": "4 · Cybersecurity Policy", "route": "/cybersecurity-policy" },
    { "n": 8,  "item": "Asset and Section 889 telecom inventory (check facility cameras)", "owner": "Ben Strout", "status": "Not started", "docLabel": "4 · Cybersecurity Policy", "route": "/cybersecurity-policy" },
    { "n": 9,  "item": "Product classification decision + FDA registration and listing per SKU", "owner": "Dr. Gill", "status": "Not started", "docLabel": "5 · Regulatory & Quality File", "route": "/regulatory-quality" },
    { "n": 10, "item": "Quality SOP set (complaints, adverse events, recall, lot traceability)", "owner": "Justin Kirkland", "status": "Drafted", "docLabel": "5 · Regulatory & Quality File", "route": "/regulatory-quality" },
    { "n": 11, "item": "Product liability + GL insurance certificates", "owner": "Ops lead", "status": "Not started", "docLabel": "5 · Regulatory & Quality File", "route": "/regulatory-quality" },
    { "n": 12, "item": "VA pilot past-performance write-up + reference letter", "owner": "Greg Phillips", "status": "Drafted", "docLabel": "7 · Past Performance & Corporate File", "route": "/past-performance" },
    { "n": 13, "item": "Corporate binder (formation, EIN, financials, bank letter, bios)", "owner": "Compliance Officer", "status": "Not started", "docLabel": "7 · Past Performance & Corporate File", "route": "/past-performance" },
    { "n": 14, "item": "SAM.gov saved searches (PSC 6505/6510/6515; VA + DLA)", "owner": "Craig Thompson", "status": "Not started", "docLabel": "6 · VA FSS Offer Package", "route": "/va-fss-offer" },
    { "n": 15, "item": "VA eCMS Vendor Portal account", "owner": "Greg Phillips", "status": "Not started", "docLabel": "6 · VA FSS Offer Package", "route": "/va-fss-offer" },
    { "n": 16, "item": "VA FSS offer (65 I B or 65 II A) once the eligibility gate is met", "owner": "Greg Phillips + counsel", "status": "Not started", "docLabel": "6 · VA FSS Offer Package", "route": "/va-fss-offer" },
    { "n": 17, "item": "GovCon attorney review of the full suite", "owner": "CEO", "status": "Not started", "docLabel": "All documents", "route": "/" }
  ]
}
```
=== END FILE ===

=== FILE: content/00-readiness-roadmap.md ===
# Shingle X — Federal Contracting Readiness Suite

As of November 9, 2026 · Prepared by Ben Strout, CIO

## Purpose and scope

Shingle X LLC will compete as an ordinary small business. There is no VOSB/SDVOSB status, so we bid on full-and-open work, small-business set-asides, the VA Federal Supply Schedule, and micro-purchases and simplified acquisitions from VA medical centers. This suite holds every document needed beyond the UEI and CAGE code.

- **Entity of record:** Shingle X LLC (assumed). Every document below names it. If Millpond Bio ends up holding the contracts, swap the name and re-register in SAM.
- **How to use it:** this page is the control sheet. Each document after it is ready to finish. Fill the bracketed \[fields\], have counsel review the Compliance Manual, and have the signer date each policy.
- **Clause numbers:** the Revolutionary FAR Overhaul is renumbering FAR clauses through 2026. For example, Basic Safeguarding 52.204-21 is now [52.240-93](https://www.summit7.us/blog/why-the-rfo-ended-dfars-7019-and-7020). These documents cite both numbers. Check each solicitation's clause list against the [FAR overhaul deviation guide](https://www.acquisition.gov/far-overhaul/far-part-deviation-guide).
- **Not legal advice.** Have a GovCon attorney review before the first offer goes in.

## Decisions flagged

Four answers change the paperwork. Each document assumes the default shown, so work keeps moving.

| # | Decision | Default assumed | Why it matters |
| --- | --- | --- | --- |
| 1 | How is each product regulated: OTC drug (monograph), Class I device, or cosmetic? | Shingle X and Dermal X Pro are listed as FDA-regulated OTC products. Dermatryx is excluded until cleared. | Drugs go on VA FSS **65 I B** (pharmaceuticals). Dressings and devices go on **65 II A**. The answer also decides drug listing vs device listing and NDC vs UDI. |
| 2 | Where is each product made, and where does final assembly or fill happen? | U.S.-made | Under TAA, a non-designated-country origin blocks FSS award. The answer also drives the Buy American rep. |
| 3 | Can we apply for FSS before Shingle X has two years in business and real commercial sales? | Apply once two years of sales history are documented, and use open-market sales until then | The VA seeks firms in business at least two years, and contractors must exceed $25,000 in sales in the first two years to keep the contract. |
| 4 | Will Shingle X manufacture, or resell product made by Phalanx Nano or a contract manufacturer? | Shingle X is the manufacturer of record (its own label) | Set-asides require being the manufacturer or meeting the nonmanufacturer rule. FSS also asks resellers for the manufacturer's sales data. |

## Master readiness checklist

Seventeen items stand between Shingle X and a bid-ready file. Seven are drafted in this suite, and most of the rest are owner actions. Change each status as items move.

<!-- CHECKLIST -->

DoD/DLA bids add a CMMC Level 1 self-assessment posted in SPRS. The safeguarding policy already covers its controls.

## 90-day sequence

The order follows what gates what: classification and origin decide the schedule and the claims, and those feed every outward-facing document.

1. **Days 1–15: settle the facts.**
   - Answer Decisions 1–4 (classification, origin, entity, manufacturer of record).
   - Fix the SAM name/address mismatch against the IRS EIN letter.
   - Name the Compliance Officer.
2. **Days 15–45: sign the policies.**
   - Adopt the Compliance Manual, the TAA policy and the Safeguarding policy, after counsel review.
   - Collect supplier origin certificates and complete the asset and Section 889 inventory.
   - Bind product liability insurance.
3. **Days 30–60: build the outward package.**
   - Finalize the capability statement with approved claims only.
   - Write up the VA pilot and get the reference letter.
   - Assemble the corporate binder and the FSS product data.
4. **Days 45–90: start selling open market.**
   - Set up SAM.gov saved searches and answer sources-sought notices.
   - Run purchase-card outreach to VAMCs in the pilot's VISN.
   - Approach one FSS/MSPV distributor.
   - Draft the CSP-1 so the FSS offer is ready the day the two-year and sales gate is met.

## Sources

- [VA FSS prospective contractors](https://www.va.gov/opal/nac/fss/prospective.asp)
- [VA Schedule 65 II A](https://www.va.gov/opal/nac/fss/Schedule65IIA.asp)
- [VA FSS sales reporting](https://www.va.gov/opal/nac/fss/sales.asp)
- [FAR overhaul deviation guide](https://www.acquisition.gov/far-overhaul/far-part-deviation-guide)
- [Summit 7 on 52.240-93](https://www.summit7.us/blog/why-the-rfo-ended-dfars-7019-and-7020)
- [Morgan Lewis on VA TAA enforcement](https://www.morganlewis.com/pubs/trade-agreements-act-compliance-activity-increasing-at-va)
- [VAAR 852.219-74 nonmanufacturer terms](https://qafcs.acquisition.gov/vaar/852.219-74-va-notice-total-set-aside-verified-veteran-owned-small-businesses.)
=== END FILE ===

=== FILE: content/01-capability-statement.md ===
# Capability Statement — Shingle X LLC

The one-page document a contracting officer, a VA prosthetics or logistics buyer, or a prime keeps on file. Export it to PDF once the brackets are filled. Keep it to one page, and send it with every sources-sought response and every introductory email.

## Company snapshot

| Field | Value |
| --- | --- |
| Legal name | Shingle X LLC |
| Address | \[Physical address exactly as it appears in SAM.gov\] |
| UEI | \[UEI\] |
| CAGE | \[CAGE\] |
| Business size | Small business (self-certified in SAM under each NAICS below) |
| Primary NAICS | 325412 Pharmaceutical Preparation Manufacturing \[if OTC drug\] · 339113 Surgical Appliance and Supplies Manufacturing \[if device or dressing\] |
| Secondary NAICS | 423450 Medical, Dental, and Hospital Equipment and Supplies Merchant Wholesalers · 325620 Toilet Preparation Manufacturing \[only if a product is a cosmetic\] |
| PSC / FSC | 6505 Drugs and Biologicals \[if OTC drug\] · 6510 Surgical Dressing Materials |
| Contract vehicles | Open market; VA FSS \[65 I B or 65 II A\] (offer in preparation) |
| Payment | Government purchase card accepted · ACH via SAM banking data |
| Point of contact | Greg Phillips, Director of Sales · \[phone\] · \[email\] |
| Website | \[URL\] |

## Core competencies

- Topical skin-care products for \[indication wording approved by regulatory, e.g. "temporary relief of …"\], sold commercially on Amazon since \[year\]
- U.S. formulation and manufacturing \[confirm Decision 2\] with lot traceability and documented quality procedures
- Emerging nano-fiber scaffold platform (Dermatryx) in development for advanced wound care (not offered for sale until FDA cleared)
- Ships small orders direct to VA medical centers, CBOCs and DoD clinics, with purchase-card checkout

## Differentiators

- Veteran-led operations: our COO is a U.S. military veteran. (Do not write "veteran-owned" anywhere. We hold no VOSB/SDVOSB status, and a false claim is misrepresentation under 13 CFR 128.600.)
- Clinician-facing product line with active VA hospital pilot experience
- TAA-compliant \[confirm\], U.S.-made \[confirm\], with country-of-origin documentation on file for every SKU
- Product, quality and regulatory leadership in house: CSO Justin Kirkland; regulatory lead Dr. Gill

## Past performance

| Customer | Scope | Period | Value | Reference |
| --- | --- | --- | --- | --- |
| \[VA Medical Center name\], VISN \[#\] | Clinical pilot of \[product\] for \[use\] | \[start–end\] | \[$ or "no-cost evaluation"\] | \[Name, title, phone, email — get their permission\] |
| Commercial: Amazon marketplace | Retail sales of Shingle X and Dermal X Pro | \[year–present\] | \[units / revenue band\] | Marketplace sales reports |

## Product list (government-facing)

| SKU | Product | Unit of issue | Country of origin | FDA status | Commercial list price |
| --- | --- | --- | --- | --- | --- |
| \[SKU\] | Shingle X \[size\] | EA | \[USA\] | \[OTC monograph / listed device, NDC or UDI\] | \[$\] |
| \[SKU\] | Dermal X Pro \[size\] | EA | \[USA\] | \[status\] | \[$\] |

## Writing rules for this page

- Use only product claims that match the label and the regulatory file. Never write "treats" or "heals" burns or chronic wounds without FDA clearance.
- Use the exact SAM legal name and address. A mismatch here is the same problem currently blocking SAM.
- Update it quarterly and whenever a contract vehicle or past-performance reference is added.
=== END FILE ===

=== FILE: content/02-compliance-manual.md ===
# Government Contracts Compliance Manual — Shingle X LLC

Adopted \[date\] by \[manager/CEO name\], effective on signature. This manual applies to every member, employee, contractor and sales agent who touches a federal sale. It is written ahead of contract thresholds on purpose: a VA contracting officer's responsibility review, and any later audit, looks for a written program.

## 1. Compliance officer and reporting line

- Compliance Officer: \[name, title\]. They report directly to the CEO and the board of managers. They must not be the person who signs the pricing they review.
- Responsibilities: annual SAM renewal, keeping this manual current, training, the disclosure decisions in section 4, and the contract file in section 9.
- Escalation: any employee can go straight to the Compliance Officer or to outside counsel (\[firm, phone\]) without going through a supervisor.

## 2. Code of Business Ethics and Conduct

Written to the standard of FAR 52.203-13. That clause becomes mandatory on contracts over $6M lasting more than 120 days; we follow it from day one.

- Truthful representations: every certification in SAM, every offer, every invoice and every label claim must be accurate and supported by a file.
- No kickbacks: we never offer or accept anything of value to win or reward a referral or subcontract (Anti-Kickback Act, 41 U.S.C. ch. 87).
- Gifts to federal employees: nothing beyond the federal ethics limits (5 CFR 2635.204, generally $20 per occasion and $50 per year per employee). Product samples go only through the official evaluation channel and are logged.
- Procurement integrity: we never seek or use another bidder's pricing, or the government's source-selection information. Anything we receive by mistake goes to the Compliance Officer unopened.
- Former government employees: before talking employment or consulting with any current or former VA or DoD employee, ask the Compliance Officer.
- Conflicts of interest: members disclose ownership or roles in suppliers, distributors and competitors on the annual form (Appendix A).

## 3. Internal control system

- Two-person rule: one person builds the price and a second approves it, for every offer and every price change.
- A quarterly review samples 10 government invoices against the contract price list.
- Training: every employee, at hire and once a year (Appendix B is the training log).
- Hotline: an anonymous email or phone line \[set up, e.g. a third-party ethics line\]. The DoD and VA OIG hotline posters go up when a contract requires them (FAR 52.203-14).

## 4. Mandatory disclosure

We disclose to the VA Office of Inspector General, in writing and promptly, any credible evidence that a principal, employee, agent or subcontractor broke federal criminal law involving fraud, conflict of interest, bribery or gratuities, or violated the civil False Claims Act. We disclose significant overpayments the same way. Counsel drafts the disclosure. Knowingly failing to disclose is itself a cause for suspension or debarment.

- VA OIG Hotline: <https://www.vaoig.gov/hotline>

## 5. Representations and certifications

| Item | Rule | Owner | When |
| --- | --- | --- | --- |
| SAM registration | Legal name and physical address match IRS records and the incorporation documents exactly | Compliance Officer | Renew every 12 months (calendar reminder 60 days ahead) |
| Size rep per NAICS | Small under each listed NAICS size standard | Compliance Officer | Each renewal and each offer |
| Section 889 telecom (52.204-24/-26) | No covered Huawei, ZTE, Hikvision, Dahua or Hytera equipment or services used or supplied | IT lead | Each renewal; inventory in the Cybersecurity Policy |
| TAA / Buy American | Country of origin of every end item on file | Ops lead | Each offer and each new SKU |
| Non-discrimination certification (RFO 52.222-90) | No illegal DEI-based discrimination, and the clause flows down to U.S. subcontractors | CEO | Each offer |
| Lobbying (52.203-11/-12) | No appropriated funds spent on lobbying; disclosure if over $150K | Compliance Officer | Each offer over $150K |
| Debarment check | Check every subcontractor and supplier in SAM exclusions before onboarding | Purchasing | Before each new vendor |

Check clause numbers against the current FAR overhaul text at <https://www.acquisition.gov/far-overhaul/far-part-deviation-guide>

## 6. Pricing integrity

- Commercial Sales Practices (CSP-1) disclosures must be current, accurate and complete as of the date we sign them. Keep the backup (invoices, discount policy, Amazon pricing history) in the contract file.
- Price Reductions Clause: once an FSS contract is awarded, any price reduction to our tracking customer, or to that category of customer, goes to the VA contracting officer within 15 days and is offered to the government. The pricing approver checks every discount against the tracking customer before granting it.
- Never sell to a federal buyer above the contract price. Never split orders to stay under micro-purchase limits.

## 7. Invoicing and payment

- Submit VA invoices electronically through the VA Financial Services Center portal named in the contract (VAAR 852.232-72).
- Every invoice references the contract or order number, the CLIN or SKU, quantities and lot numbers. Never invoice before shipment.
- When we are paid twice or overpaid, refund it within 30 days and log it.

## 8. Subcontractors and suppliers

- Flow down required clauses (Section 889, non-discrimination, TAA origin evidence, safeguarding when they touch our federal data) through the supplier agreement template.
- Get a country-of-origin certificate from every component and finished-goods supplier (see the TAA / Country of Origin policy).

## 9. Records and the contract file

- Keep all records for each contract for three years after final payment, or longer if the contract says so (FAR 4.703). Keep CSP backup and sales reports for the life of the FSS contract plus three years.
- One folder per contract: solicitation, offer, CSP-1, award, modifications, every order, every invoice, sales reports, IFF remittances, correspondence and price-reduction notices.

## 10. Discipline and annual review

Violations lead to discipline up to termination, and outside agents are terminated. The Compliance Officer reviews this manual every \[month\] and after every rule change, and signs off on each revision.

## Appendices

- **A. Annual conflict-of-interest disclosure:** \[name\] · \[outside roles and ownership\] · \[signature, date\]
- **B. Training log:** \[name\] · \[module\] · \[date\] · \[acknowledgment\]
- **C. Acknowledgment:** "I have read the Shingle X Government Contracts Compliance Manual and agree to follow it." \[signature, date\]
=== END FILE ===

=== FILE: content/03-taa-country-of-origin.md ===
# Trade Agreements Act and Country-of-Origin Compliance Policy

Shingle X will offer the federal government only end items that are U.S.-made or come from a TAA-designated country, and it can prove the origin of every SKU on demand. The VA treats every FSS item as covered by TAA no matter the order size. It has an active enforcement history, including whistleblower cases over non-compliant medical devices, so this file has to be ready before the FSS offer goes in. ([Morgan Lewis on VA TAA enforcement](https://www.morganlewis.com/pubs/trade-agreements-act-compliance-activity-increasing-at-va))

## 1. Rule we apply

- An end item's country of origin is where it was wholly made, or where it was last **substantially transformed** into a new article with a distinct name, character and use. U.S. Customs (CBP) rulings decide close cases.
- Acceptable origins: the United States, plus the designated countries listed in FAR 25.003 (WTO GPA and FTA countries, least-developed countries and Caribbean Basin countries). China, India, Vietnam, Malaysia and Indonesia are **not** designated. If a product is filled, compounded or finished from imported material, the place of the last substantial transformation decides.
- Mixing, filling, packaging or labeling alone usually does **not** substantially transform an item. When the active ingredient or the finished bulk comes from a non-designated country, get a CBP final determination or counsel's opinion before offering that SKU.

## 2. Procedure

1. Before a SKU goes on any federal price list, the Ops lead completes its row in the Product Origin Register (section 3).
2. Every supplier of an active ingredient, bulk formulation, dressing substrate or finished good signs the Supplier Origin Certificate (section 4). Renew it every year and whenever the supplier, the plant or the formula changes.
3. Any change of manufacturer, plant, active-ingredient source or packaging site triggers a re-review **before** the next government shipment.
4. If we find a non-compliant item already on contract, stop offering it, notify the contracting officer in writing within 5 business days, and send the matter to counsel for a possible disclosure (Compliance Manual, section 4).

## 3. Product Origin Register

| SKU | Product | Active / key input and its origin | Manufacturer and plant (city, country) | Last substantial transformation | Country of origin | Evidence on file | Reviewed by / date |
| --- | --- | --- | --- | --- | --- | --- | --- |
| \[SKU\] | Shingle X \[size\] | \[ingredient — country\] | \[name, city, country\] | \[compounding/filling site\] | \[USA\] | \[supplier certificate, batch record, CBP ruling #\] | \[initials, date\] |
| \[SKU\] | Dermal X Pro \[size\] | \[ingredient — country\] | \[name, city, country\] | \[site\] | \[USA\] | \[evidence\] | \[initials, date\] |
| \[future\] | Dermatryx | Electrospun nano-fiber scaffold (in-house) | \[facility\] | Electrospinning and lyophilization | \[USA\] | \[batch record\] | Not offered until FDA cleared |

## 4. Supplier Origin Certificate (template)

> \[Supplier legal name\] certifies to Shingle X LLC that the items listed below, supplied under \[PO/agreement #\], are wholly produced in, or last substantially transformed in, the country stated for each item. Supplier will notify Shingle X in writing at least 30 days before any change in manufacturing location, sub-tier source of a key input, or process that could change country of origin. Supplier will keep supporting records for at least three years and make them available on request.
>
> Item / part number · Description · Manufacturing site (address) · Country of origin · Basis (wholly produced / substantial transformation, describe)
>
> Signed: \[name, title\] · Date: \[date\]

## 5. Buy American companion rep

On offers that use Buy American instead of TAA (usually below the TAA threshold, open-market orders), the same register supports the domestic end-product rep. U.S.-made items with more than 65% domestic component cost meet the current domestic content threshold. Record the component cost test for each SKU in the register's evidence column. \[Confirm the percentage in effect on the solicitation date.\]

Policy owner: \[Ops lead\] · Approved: \[CEO, date\]
=== END FILE ===

=== FILE: content/04-cybersecurity-policy.md ===
# Information Safeguarding Policy — Shingle X LLC

Shingle X protects federal contract information (FCI) on every system it uses, under the 15 basic safeguarding requirements of FAR 52.204-21, renumbered [52.240-93](https://www.summit7.us/blog/why-the-rfo-ended-dfars-7019-and-7020) under the FAR overhaul. FCI is any non-public information the government provides or we generate under a contract: orders, delivery schedules, pricing correspondence, VA facility contacts. Owner: Ben Strout, CIO. Effective \[date\].

## 1. Scope

- Systems in scope: Google Workspace / Microsoft 365 \[pick one\] email and file storage, laptops and phones used for government work, the accounting system, and the order and shipping system.
- We do **not** take Controlled Unclassified Information (CUI) or patient data in normal sales. If a VA pilot or contract would give us patient-identifiable data, stop and route it to the CIO. That needs a VA data-use agreement and HIPAA controls, and it is out of scope for this policy.
- DoD/DLA work: these 15 controls equal CMMC Level 1. File the annual Level 1 self-assessment in SPRS before bidding any DoD contract that requires it.

## 2. The 15 controls and how we meet them

| # | Requirement | How Shingle X meets it | Evidence |
| --- | --- | --- | --- |
| 1 | Limit system access to authorized users, processes and devices | Named accounts only, no shared logins; accounts removed the day someone leaves | User list, offboarding checklist |
| 2 | Limit users to the transactions and functions they are permitted | Role-based folders; only finance can reach banking, only sales can reach pricing | Permission export |
| 3 | Verify and control connections to external systems | Personal devices only through managed accounts; no personal cloud sync of contract files | Device/MDM policy |
| 4 | Control information posted on public systems | Only the CIO or CEO approves anything posted to the website, Amazon or social media that mentions a government customer | Approval log |
| 5 | Identify users, processes and devices | Unique user IDs; device inventory | Asset inventory (section 3) |
| 6 | Authenticate before access | MFA required on email, file storage, banking, SAM.gov and Login.gov | Admin console MFA report |
| 7 | Sanitize or destroy media before disposal or reuse | Factory reset and encryption wipe before any device leaves; paper is shredded | Disposal log |
| 8 | Limit physical access to systems | Office and facility locked; servers or NAS (if any) in a locked room | Key/badge list |
| 9 | Escort visitors, log physical access, control keys and badges | Visitor sign-in at the facility; keys tracked | Visitor log |
| 10 | Monitor and protect communications at system boundaries | Firewall on the office network; separate guest Wi-Fi | Router configuration screenshot |
| 11 | Separate public-facing components from internal networks | Website and store hosted off-site by the vendor, never on the office network | Hosting contract |
| 12 | Identify, report and correct flaws on time | Automatic OS and browser updates; critical patches within 14 days | Patch status report |
| 13 | Protect against malicious code at appropriate locations | Built-in endpoint protection (Defender / XProtect) on every device | Endpoint console |
| 14 | Update malicious-code protection when new releases come out | Automatic definition updates on | Endpoint console |
| 15 | Periodically scan systems, and scan external files in real time | Weekly full scan; real-time scanning of downloads and attachments | Scan report |

## 3. Asset and Section 889 inventory

| Asset | User | OS / model | MFA | Encrypted | Covered telecom (Huawei, ZTE, Hikvision, Dahua, Hytera)? |
| --- | --- | --- | --- | --- | --- |
| \[Laptop\] | \[name\] | \[model\] | Yes | Yes | No |
| \[Phone\] | \[name\] | \[model\] | Yes | Yes | No |
| \[Security cameras at facility\] | — | \[brand\] | n/a | n/a | \[Check: Hikvision and Dahua cameras are covered telecom\] |
| \[Router / Wi-Fi\] | — | \[brand\] | n/a | n/a | \[Check\] |

## 4. Incident response

1. Anyone who suspects a breach, a lost device or a phishing compromise tells the CIO within 1 hour.
2. The CIO contains it: resets credentials, wipes or locks the device remotely, and preserves logs.
3. If FCI or government information is involved, the CIO notifies the contracting officer within 72 hours (or the contract's stated window) and logs what happened, what data was involved, and the fix.

## 5. Review

The CIO reviews this policy and the asset list every year and after any incident. Every user signs that they have read it: \[signature, date\].
=== END FILE ===

=== FILE: content/05-regulatory-quality-file.md ===
# Product Regulatory and Quality File

Every SKU offered to the government needs a current FDA status, a compliant label, a quality system behind it, and an adverse-event and recall path. VA buyers, the FSS contracting officer and any distributor will ask for this file. Owner: Dr. Gill (Regulatory), with Justin Kirkland (CSO) for quality. Status as of \[date\].

## 1. Regulatory status by product

Fill one row per SKU once Decision 1 (classification) is settled. Which framework applies decides every requirement below it.

| Product | Pathway | FDA registration | Listing / ID | Label standard | Manufacturing standard | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Shingle X | \[OTC monograph drug · or device · or cosmetic\] | \[Drug establishment registration (FURLS/DRLS) · FEI #\] | \[NDC labeler code + product NDC\] | Drug Facts panel (21 CFR 201.66) | cGMP (21 CFR 210/211) at the contract manufacturer | \[ \] |
| Dermal X Pro | \[same choices\] | \[ \] | \[ \] | \[ \] | \[ \] | \[ \] |
| Dermatryx | Medical device: 510(k) or De Novo \[Dr. Gill to confirm\] | Device establishment registration (annual user fee) | Device listing + UDI in GUDID | 21 CFR 801 + UDI (21 CFR 830) | QMSR (21 CFR 820, aligned with ISO 13485) | In development; not offered |

If a product is a cosmetic, MoCRA applies instead: facility registration, product listing, serious adverse-event reporting and safety substantiation. In that case no drug or device claim can appear anywhere, including the capability statement.

## 2. Claims control

- Approved claims list per SKU: \[paste the exact label claims\]. Sales, marketing, the capability statement and FSS catalog descriptions use only these words.
- Prohibited without clearance: treats, heals or cures burns, chronic or non-healing wounds, diabetic ulcers or infections. This also covers the DermalX rename. The new name must not imply a disease claim.
- Every new piece of marketing gets a Regulatory sign-off: \[reviewer, date\] logged in the marketing approval log.

## 3. Quality system documents to have on file

| Document | Purpose | Owner | Status |
| --- | --- | --- | --- |
| Quality manual and SOP index | Shows a functioning quality system; seed for ISO 13485 | CSO | \[ \] |
| Supplier and contract-manufacturer quality agreement | Divides cGMP responsibilities; requires origin certificates (TAA policy) | CSO | \[ \] |
| Product specifications and certificates of analysis per lot | Proves each lot meets spec | CSO | \[ \] |
| Lot traceability and expiration-dating procedure | Recall readiness; VA requires the lot on invoices | Ops lead | \[ \] |
| Safety Data Sheet (SDS) per SKU | Facility safety and receiving | Regulatory | \[ \] |
| Product spec sheet / IFU per SKU | Clinician and buyer reference; attached to FSS catalog | Regulatory | \[ \] |
| Complaint-handling SOP | Intake, investigation, trending | Regulatory | \[ \] |
| Adverse-event reporting SOP | OTC drugs: serious events to FDA within 15 business days (FDCA 760). Devices: MDR (21 CFR 803). Cosmetics: MoCRA 15 business days | Regulatory | \[ \] |
| Recall SOP and mock recall record | 21 CFR 7; one mock recall a year | Ops lead | \[ \] |
| Stability / shelf-life data | Supports expiration date; VA asks for remaining shelf life at delivery | CSO | \[ \] |
| ISO 13485 gap assessment and roadmap | Needed for Dermatryx and the $10M plan; a credibility signal for VA | CSO | \[ \] |

## 4. Insurance and responsibility evidence

- Product liability insurance: \[carrier, limits, e.g. $1M per occurrence / $2M aggregate\]. Certificate of insurance ready to send on request.
- General liability and workers' compensation certificates.
- Financial responsibility package for the FSS offer: last two years' financial statements, a bank reference letter, and proof of ability to fill orders (capacity letter from the contract manufacturer).

## 5. Government packaging and shipping

- Commercial packaging is acceptable unless the order says otherwise. Print the lot, the expiration date and the NDC or UDI on each unit and each case.
- Shipping labels carry the PO and order number, the VA facility's receiving point, and the ship-to point of contact.
- Keep proof of delivery for every shipment in the contract file.
=== END FILE ===

=== FILE: content/06-va-fss-offer-package.md ===
# VA Federal Supply Schedule — Offer Prep Package

The FSS contract is the long-term vehicle: any VA facility, DoD and other agencies can order from it for 5 years plus a 5-year option. It is also the usual way to get a product into VA's Medical/Surgical Prime Vendor (MSPV) catalog. Shingle X should assemble this package now and submit once the eligibility gate in section 1 is met. ([VA FSS prospective contractors](https://www.va.gov/opal/nac/fss/prospective.asp) · [Schedule 65 II A](https://www.va.gov/opal/nac/fss/Schedule65IIA.asp))

## 1. Eligibility gate

| Test | Requirement | Shingle X today | Gap action |
| --- | --- | --- | --- |
| Time in business | The VA seeks firms in business at least 2 years before submitting | \[formation date\] | Document the operating history; if under 2 years, keep selling open market and apply when eligible |
| Commercial sales | Must show commercial pricing and disclose discounting practices; sales to a couple of customers can be judged "insignificant" | Amazon retail + \[any distributor or clinic accounts\] | Build at least one wholesale or distributor channel (a national account or a GPO is strongest) |
| Sales to keep the contract | More than $25,000 in the first 2 years, then $25,000 each year after | n/a | Pipeline plan: VA pilot site + \[3 target VAMCs\] |
| Financial responsibility | Financial statements, a bank reference, capacity to deliver | \[ \] | See Regulatory & Quality File, section 4 |
| TAA | Every item from the U.S. or a designated country | \[ \] | TAA register complete |
| Not excluded | No SAM exclusions for the firm or its principals | \[ \] | SAM exclusions check of all members |

## 2. Which schedule

- **65 I B Drugs, Pharmaceuticals and Hematology** if Shingle X or Dermal X Pro is an OTC drug with an NDC. This schedule also involves Public Law 102-585 (Veterans Health Care Act) pricing for covered drugs; confirm with counsel whether OTC monograph items are "covered drugs."
- **65 II A Medical Equipment and Supplies** for dressings and devices. Its FSC classes include 6510 Surgical Dressing Materials, so Dermatryx goes here once cleared.
- Solicitations are standing (open continuously). Download the current solicitation and amendments from the schedule page before drafting; the amendments add clauses such as economic price adjustment and financial responsibility.

## 3. Offer contents checklist

- [ ] VA eCMS Vendor Portal account for electronic submission: <https://www.vendorportal.ecms.va.gov>
- [ ] Signed SF-1449 / solicitation cover page and all amendment acknowledgments
- [ ] Vendor Response Document (the solicitation's "Doc 02"), every question answered
- [ ] Commercial Sales Practices Format (CSP-1), complete, with justifications (section 4)
- [ ] Two dated copies of the commercial price list(s)
- [ ] Proposed FSS price list: SKU, description, unit of issue, commercial list price, discount offered, FSS price including the IFF
- [ ] Proposed tracking customer for the Price Reductions Clause
- [ ] TAA / country-of-origin statement per item (from the TAA register)
- [ ] Product literature: spec sheets, SDS, labels, FDA status per SKU
- [ ] Past performance references (VA pilot + commercial)
- [ ] Financial statements and the responsibility package
- [ ] Authorized negotiator letter naming who can bind Shingle X
- [ ] SAM registration active, with reps and certs current

## 4. CSP-1 working sheet

CSP-1 asks for our best discounts to each class of commercial customer. Whatever we disclose becomes the yardstick for the government price.

| Customer class | Example customers | Discount off list | Concessions (freight, rebates, terms) | Volume conditions | Annual sales $ |
| --- | --- | --- | --- | --- | --- |
| Retail consumers (Amazon) | Marketplace buyers | 0% / promotions \[list\] | \[Prime shipping\] | None | \[$\] |
| Distributors / wholesalers | \[name\] | \[%\] | \[ \] | \[min order\] | \[$\] |
| Clinics / hospitals | \[name\] | \[%\] | \[ \] | \[ \] | \[$\] |
| Other (GPO, IDN) | \[name\] | \[%\] | \[ \] | \[ \] | \[$\] |

- Proposed government discount: \[%\] off list, which must be equal to or better than the most-favored comparable customer, or justified.
- Proposed tracking customer: \[class\]. Pick a class we can monitor and will not need to discount often.
- Deviations from written discount policy in the last 12 months: \[describe or "none"\].

## 5. After award

| Obligation | What to do | Cadence |
| --- | --- | --- |
| Sales reporting + IFF | Report contract sales and remit the Industrial Funding Fee through the [GSA Sales Reporting Portal](https://www.va.gov/opal/nac/fss/sales.asp); report $0 quarters too | Quarterly |
| Price Reductions Clause | Report any price reduction to the tracking customer to the CO | Within 15 days of the change |
| Catalog | Publish the approved price list and upload items to GSA Advantage | At award and at each modification |
| Modifications | Add products or change prices only by formal modification (CSP backup required) | As needed |
| Minimum sales | Track toward $25,000 in the first two years | Monthly dashboard |
| MSPV | Ask VA logistics and the prime vendors to add our FSS items to the MSPV catalog | After award |

## 6. Meanwhile: the open-market path (no FSS needed)

- **Purchase-card sales:** VA clinicians and logistics can buy under the micro-purchase threshold with a government purchase card. Keep a one-page order form and a card-ready checkout.
- **SAM.gov saved searches:** PSC 6505, 6510 and 6515, NAICS 325412, 339113 and 423450, agency = VA and DLA. Respond to every sources-sought notice with the capability statement; that is how requirements get shaped toward small-business set-asides.
- **VA medical center logistics and prosthetics:** introduce the product to the VISN contracting office that covers the pilot site.
- **Distributors already on FSS or MSPV:** offer Shingle X through a distributor that holds a contract. This is the fastest way in while we build our own eligibility. The distributor's contract will need our commercial sales data, and possibly CSP data from us as manufacturer.
=== END FILE ===

=== FILE: content/07-past-performance-corporate-file.md ===
# Past Performance and Corporate File

The VA pilot is Shingle X's strongest asset for any government offer, and it is worth documenting properly now, while the people involved still remember it. The second half of this page is the corporate binder that every offer pulls from.

## 1. Past performance write-up: VA hospital pilot

Use this structure in every offer that asks for past performance. Keep it to one page.

| Field | Entry |
| --- | --- |
| Customer | \[VA Medical Center, city, state\] · VISN \[#\] |
| Contract / agreement type | \[Purchase order # / no-cost clinical evaluation / purchase card\] |
| Period of performance | \[start\] to \[end or "ongoing"\] |
| Value | \[$ or "no-cost evaluation, units supplied"\] |
| Product(s) | \[SKU, quantities\] |
| Customer point of contact | \[Name, title, phone, email\], confirmed willing to serve as a reference on \[date\] |
| Scope | \[What VA clinicians used it for, in label-compliant words\] |
| Results | \[Delivery on time %, units supplied, clinician feedback, reorders. Only facts we can document; no outcome claims beyond the label\] |
| Relevance | Same product, same customer type (VHA clinical setting) as the procurement |
| Problems and how they were fixed | \[Any delivery or product issue and how it was resolved, or "none"\] |

**To do:** ask the pilot's clinical lead or logistics contact for a short letter of support, or a CPARS-style evaluation, while the pilot is active.

## 2. Corporate binder

| Document | Where it lives | Owner | Status |
| --- | --- | --- | --- |
| Certificate of formation + Alabama good standing | \[folder link\] | Compliance Officer | \[ \] |
| Operating agreement + current ownership and manager list | \[link\] | CEO | \[ \] |
| IRS EIN letter (CP-575 or 147C), with name matching SAM exactly | \[link\] | Compliance Officer | \[ \] Needed to clear the SAM address/name mismatch |
| SAM.gov registration printout + reps and certs (renewal date) | \[link\] | Compliance Officer | \[ \] |
| Org chart + key personnel bios (Bert Davi, Ricky Herrera, Justin Kirkland, Dr. Gill, Greg Phillips, Craig Thompson, Ben Strout) | \[link\] | CIO | \[ \] |
| Financial statements (2 years) + bank reference letter | \[link\] | CEO | \[ \] |
| Insurance certificates (product liability, GL, workers' comp) | \[link\] | Ops lead | \[ \] |
| W-9 | \[link\] | Compliance Officer | \[ \] |
| Authorized signatory / negotiator letter | \[link\] | CEO | \[ \] |
| Capability statement (PDF, current quarter) | Capability Statement page | Sales | \[ \] |
| Signed policies: Compliance Manual, TAA policy, Safeguarding policy | This portal | Compliance Officer | \[ \] |

## 3. Corporate-structure caution

Millpond Bio is consolidating Shingle X and Phalanx Nano. SBA counts affiliates when it decides size, so Millpond's and the Ottens' other companies may count toward Shingle X's employees and receipts. Confirm Shingle X is still small under each NAICS after consolidation, before any small-business set-aside offer. The contracting entity's legal name, UEI and bank details must match whatever entity finally holds the assets and signs.
=== END FILE ===

---

# PART 3 — POST-BUILD VERIFICATION (ask Replit Agent to report back on each)

1. Screenshot of each of the 8 pages, desktop and mobile width.
2. Screenshot of the checklist after changing item #2 to "In review" and refreshing the page (the status should persist).
3. Print preview screenshot of the Capability Statement showing it fits on one page.
4. Confirmation that an unauthenticated incognito visit shows only the login or password screen.
5. A diff or word count confirming each rendered page's text matches its `/content` file (no rewritten copy).
