# Shingle X — Federal Contracting Readiness Portal

Internal, password-gated portal for the Shingle X LLC government-contracting compliance suite.
Built from `BUILD.md` (the original build spec). Document text lives in `content/` and is rendered
verbatim — edit the markdown there, never the components.

This folder is a self-contained app, separate from the Phalanx investor-deck site at the repo root.

## Stack
Vite + React + TypeScript + Tailwind, `react-router-dom`, `react-markdown` + `remark-gfm` +
`rehype-slug` + `rehype-autolink-headings`. A small Express server (`server/index.js`) provides the
password gate and serves the built app.

## Access control
Shared-password gate (Replit Auth was not used). The server checks the password against `PORTAL_PASSWORD`
and sets an HMAC-signed, `HttpOnly`, `SameSite=Lax` session cookie (`Secure` behind HTTPS).
**Every** path except `/login`, `/robots.txt` and `/healthz` needs a valid session. That includes the
JS bundle, which contains the documents. With no `PORTAL_PASSWORD` set, the server returns 503 for
everything (it fails closed). Responses carry `X-Robots-Tag: noindex, nofollow`, the HTML has the robots
meta tag, and `robots.txt` disallows everything. Login attempts are rate-limited (10 per 15 minutes per IP).

| Variable | Required | Notes |
| --- | --- | --- |
| `PORTAL_PASSWORD` | yes | The shared password |
| `SESSION_SECRET` | no | Cookie signing key; defaults to one derived from the password, so changing the password signs everyone out |
| `SESSION_HOURS` | no | Session length, default 12 |
| `PORT` | no | Default 3000 |

## Run
```bash
npm install
PORTAL_PASSWORD=choose-one npm run dev     # dev server with Vite HMR, gated, on :3000
npm run build && PORTAL_PASSWORD=choose-one npm start   # production
```

## Replit
Create a new Replit App from this folder (or import the repo and `cd govcon-portal`). `.replit` here
runs `npm run dev`. The deployment runs `npm run build`, then `npm start` (Autoscale). Add
`PORTAL_PASSWORD` in Secrets. Use `/healthz` as the health check.

## Features
- 8 routes (see `src/content.ts`), sidebar nav (a hamburger drawer on mobile), an "As of" date from `checklist.json`.
- "On this page" TOC from `##` headings: right rail on wide screens, collapsible on mobile.
- Global search over headings and paragraph text, with jump links to heading anchors.
- Readiness Roadmap: an interactive checklist at the `<!-- CHECKLIST -->` marker. Status persists in
  `localStorage` under `sx-checklist-v1`, with a progress bar, owner and status filter chips, and Reset to defaults.
  The "Decisions flagged" table gets an amber left border.
- Bracketed `[placeholders]` show as yellow pills, and the header shows "N fields to fill" for the page.
- Print / Save as PDF on every page: letter size, 0.6in margins, 10.5pt, table rows never split, and external
  link URLs printed after the link text.
- Capability Statement prints as a two-column one-pager. The intro paragraph and "Writing rules for this
  page" are internal guidance, so they appear on screen but are left out of the printout.

## Verified (production build, headless Chromium)
- All 8 routes render with no raw markdown, and every table renders as a table. The rendered word count
  equals the source word count on every page.
- Checklist changes persist across a refresh, Reset restores the JSON defaults, and every Document link
  resolves to the correct route.
- Searching "Price Reductions Clause" puts Compliance Manual § 6 first, and the result jumps to `#6-pricing-integrity`.
- Capability Statement badge: 35 fields. The Capability Statement prints to 1 letter page.
- An unauthenticated visit sees only the login page, and the bundle returns 401.
- Lighthouse accessibility scores 100 on the pages tested, with no horizontal page scroll at 375px.
