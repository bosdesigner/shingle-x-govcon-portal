// Shingle X — Federal Contracting Readiness Portal
// Tiny Express server: a shared-password gate in front of the whole site.
// Nothing under the app (HTML, JS bundle, which contains the documents) is served
// until the visitor has a valid signed session cookie.
import express from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DEV = process.argv.includes('--dev') || process.env.NODE_ENV === 'development';
const PORT = Number(process.env.PORT) || 3000;
const PASSWORD = process.env.PORTAL_PASSWORD || '';
const SESSION_HOURS = Number(process.env.SESSION_HOURS) || 12;
const COOKIE = 'sx_session';
const SECRET = process.env.SESSION_SECRET
  || crypto.createHash('sha256').update(`sx-portal:${PASSWORD}`).digest('hex');

// ---------- session token: "<expiresMs>.<hmac>" ----------
const sign = (v) => crypto.createHmac('sha256', SECRET).update(v).digest('base64url');
const makeToken = () => {
  const exp = String(Date.now() + SESSION_HOURS * 3600_000);
  return `${exp}.${sign(exp)}`;
};
const safeEqual = (a, b) => {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
};
const validToken = (t) => {
  if (!t || typeof t !== 'string') return false;
  const [exp, mac] = t.split('.');
  if (!exp || !mac || !safeEqual(mac, sign(exp))) return false;
  return Number(exp) > Date.now();
};
const readCookie = (req, name) => {
  const raw = req.headers.cookie || '';
  for (const part of raw.split(';')) {
    const i = part.indexOf('=');
    if (i > -1 && part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim());
  }
  return null;
};
const isAuthed = (req) => validToken(readCookie(req, COOKIE));
const cookieFlags = (req, maxAgeSec) =>
  `Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSec}${req.secure ? '; Secure' : ''}`;

// ---------- naive in-memory login rate limiter ----------
const attempts = new Map();
const tooMany = (ip) => {
  const now = Date.now();
  const rec = (attempts.get(ip) || []).filter((t) => now - t < 15 * 60_000);
  rec.push(now);
  attempts.set(ip, rec);
  return rec.length > 10;
};

const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const loginPage = (error, next) => `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Sign in — Shingle X Readiness Portal</title>
<style>
  :root{--navy:#1e3a5f;--gold:#b8892b;--slate:#1e293b;--muted:#475569}
  *{box-sizing:border-box}
  body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f1f5f9;color:var(--slate);
       font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;padding:16px}
  main{width:100%;max-width:400px;background:#fff;border:1px solid #e2e8f0;border-top:4px solid var(--navy);
       border-radius:10px;padding:28px;box-shadow:0 8px 30px rgba(15,23,42,.08)}
  h1{font-size:1.15rem;margin:0 0 4px;color:var(--navy)}
  p{margin:0 0 20px;color:var(--muted);font-size:.9rem;line-height:1.45}
  label{display:block;font-weight:600;font-size:.85rem;margin-bottom:6px}
  input{width:100%;padding:10px 12px;border:1px solid #94a3b8;border-radius:6px;font-size:1rem}
  input:focus{outline:3px solid #b8892b55;border-color:var(--navy)}
  button{margin-top:16px;width:100%;padding:10px 12px;background:var(--navy);color:#fff;border:0;border-radius:6px;
         font-weight:600;font-size:.95rem;cursor:pointer}
  button:hover{background:#172e4b}
  .err{background:#fef2f2;color:#991b1b;border:1px solid #fecaca;border-radius:6px;padding:8px 10px;font-size:.85rem;margin-bottom:14px}
  small{display:block;margin-top:18px;color:var(--muted);font-size:.75rem;line-height:1.4}
</style></head>
<body><main>
  <h1>Shingle X — Federal Contracting Readiness Portal</h1>
  <p>Internal compliance and pricing documents. Authorized staff only.</p>
  ${error ? `<div class="err" role="alert">${escapeHtml(error)}</div>` : ''}
  <form method="post" action="/login">
    <input type="hidden" name="next" value="${escapeHtml(next || '/')}">
    <label for="password">Portal password</label>
    <input id="password" name="password" type="password" autocomplete="current-password" required autofocus>
    <button type="submit">Sign in</button>
  </form>
  <small>Internal draft — not legal advice.</small>
</main></body></html>`;

const safeNext = (n) => (typeof n === 'string' && n.startsWith('/') && !n.startsWith('//') ? n : '/');

// ---------- app ----------
const app = express();
app.set('trust proxy', true);
app.disable('x-powered-by');
app.use((_req, res, next) => {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'same-origin');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

app.get('/robots.txt', (_req, res) => res.type('text/plain').send('User-agent: *\nDisallow: /\n'));
app.get('/favicon.ico', (_req, res) => res.status(204).end());
app.get('/healthz', (_req, res) => res.type('text/plain').send('ok'));

// Fail closed when no password is configured.
app.use((req, res, next) => {
  if (PASSWORD) return next();
  res.status(503).type('text/plain').send('Portal is locked: set the PORTAL_PASSWORD environment variable (Replit Secrets) and restart.');
});

app.get('/login', (req, res) => {
  if (isAuthed(req)) return res.redirect(302, safeNext(req.query.next));
  res.setHeader('Cache-Control', 'no-store');
  res.type('html').send(loginPage(null, safeNext(req.query.next)));
});

app.post('/login', express.urlencoded({ extended: false, limit: '4kb' }), (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const next = safeNext(req.body?.next);
  if (tooMany(req.ip || 'unknown')) {
    return res.status(429).type('html').send(loginPage('Too many attempts. Wait 15 minutes and try again.', next));
  }
  if (!safeEqual(req.body?.password || '', PASSWORD)) {
    return res.status(401).type('html').send(loginPage('That password is not correct.', next));
  }
  attempts.delete(req.ip || 'unknown');
  res.setHeader('Set-Cookie', `${COOKIE}=${encodeURIComponent(makeToken())}; ${cookieFlags(req, SESSION_HOURS * 3600)}`);
  res.redirect(303, next);
});

app.post('/logout', (req, res) => {
  res.setHeader('Set-Cookie', `${COOKIE}=; ${cookieFlags(req, 0)}`);
  res.redirect(303, '/login');
});

// Everything below this line requires a valid session.
app.use((req, res, next) => {
  if (isAuthed(req)) return next();
  const wantsHtml = req.method === 'GET' && (req.headers.accept || '').includes('text/html');
  if (wantsHtml) return res.redirect(302, `/login?next=${encodeURIComponent(req.originalUrl)}`);
  res.status(401).type('text/plain').send('Unauthorized');
});

if (DEV) {
  const { createServer } = await import('vite');
  const vite = await createServer({ root: ROOT, server: { middlewareMode: true }, appType: 'spa' });
  app.use(vite.middlewares);
} else {
  const dist = path.join(ROOT, 'dist');
  if (!fs.existsSync(path.join(dist, 'index.html'))) {
    console.error('dist/ not found — run `npm run build` first.');
    process.exit(1);
  }
  app.use((_req, res, next) => { res.setHeader('Cache-Control', 'private, no-cache'); next(); });
  app.use(express.static(dist, { index: false }));
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Shingle X portal (${DEV ? 'dev' : 'production'}) on http://localhost:${PORT}`);
  if (!PASSWORD) console.warn('PORTAL_PASSWORD is not set — every request will get 503 until it is.');
});
