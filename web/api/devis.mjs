/**
 * Flora Concept · quote request endpoint for Vercel (POST /api/devis, JSON).
 * Same contract and rules as server/api/devis.php (Apache/Hostinger):
 *   - same-origin only, JSON body ≤ 16 KB
 *   - honeypot `website` + minimum fill time: bots get a fake success
 *   - server-side validation (name, email or phone, need) → 422 { errors }
 *   - rate limit per IP: 5 requests / 10 minutes → 429
 *   - mail to the agency of the selected zone (+ acknowledgement if an email was given)
 *
 * Environment (Vercel project settings):
 *   DEVIS_ALLOWED_ORIGINS   comma-separated, e.g. https://www.floraconcept.fr,https://flora-concept.vercel.app
 *   DEVIS_TO_PACA, DEVIS_TO_IDF, DEVIS_TO_DEFAULT   recipients
 *   DEVIS_FROM              sender on a domain verified in Resend, e.g. "Flora Concept <no-reply@floraconcept.fr>"
 *   RESEND_API_KEY          https://resend.com (HTTP API, no SMTP needed)
 *   DEVIS_ACK_SUBJECT, DEVIS_ACK_BODY   acknowledgement copy ({nom} placeholder); empty = not sent
 *   UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN   rate-limit store (recommended);
 *     without it the limit is kept in memory per function instance (best effort)
 *   DEVIS_IP_SALT           secret used to hash IPs
 */
import { createHmac } from 'node:crypto';

const RATE_LIMIT = 5;
const RATE_WINDOW_S = 600;
const MIN_FILL_MS = 2500;
const ZONES = { marseille: 'Marseille et Provence', nice: "Nice et Côte d'Azur", paris: 'Paris et Île-de-France' };
const memoryHits = new Map();

const json = (res, status, body) => res.status(status).setHeader('Cache-Control', 'no-store').json(body);

/** Removes control characters (keeps \n and \t in multi-line fields), trims, caps length. */
function clean(value, max, multiline = false) {
  if (typeof value !== 'string') return '';
  let v = value.replace(/[\p{Cc}\p{Cf}]/gu, (c) => (multiline && (c === '\n' || c === '\t') ? c : multiline ? '' : ' '));
  if (!multiline) v = v.replace(/\s+/g, ' ');
  return [...v.trim()].slice(0, max).join('');
}

async function rateLimited(ip) {
  const key = 'devis:' + createHmac('sha256', process.env.DEVIS_IP_SALT || 'flora').update(ip).digest('hex');
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    const r = await fetch(`${url}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([['INCR', key], ['EXPIRE', key, String(RATE_WINDOW_S), 'NX']]),
    });
    if (!r.ok) throw new Error(`rate-limit store ${r.status}`);
    const [incr] = await r.json();
    return Number(incr.result) > RATE_LIMIT;
  }
  const now = Date.now();
  const hits = (memoryHits.get(key) || []).filter((t) => t > now - RATE_WINDOW_S * 1000);
  hits.push(now);
  memoryHits.set(key, hits);
  return hits.length > RATE_LIMIT;
}

async function sendMail({ to, subject, text, replyTo }) {
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: process.env.DEVIS_FROM, to: [to], subject, text, ...(replyTo ? { reply_to: replyTo } : {}) }),
  });
  if (!r.ok) throw new Error(`mail ${r.status} ${await r.text()}`);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { ok: false });
  }
  const allowed = (process.env.DEVIS_ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
  const origin = req.headers.origin || '';
  const fetchSite = req.headers['sec-fetch-site'] || '';
  if ((origin && !allowed.includes(origin)) || (fetchSite && fetchSite !== 'same-origin')) return json(res, 403, { ok: false });
  if (!String(req.headers['content-type'] || '').startsWith('application/json')) return json(res, 415, { ok: false });
  if (Number(req.headers['content-length'] || 0) > 16384) return json(res, 413, { ok: false });

  const body = typeof req.body === 'object' && req.body ? req.body : {};
  const nom = clean(body.nom, 120);
  const contact = clean(body.contact, 160);
  const besoin = clean(body.besoin, 3000, true);
  const zone = Object.hasOwn(ZONES, body.zone) ? body.zone : '';
  const source = typeof body.source === 'string' && /^\/[a-z0-9\-/]*$/.test(body.source) ? body.source : '';
  const elapsed = Number.isFinite(body.elapsed) ? body.elapsed : 0;

  // Bots: honeypot filled or inhumanly fast submission → fake success.
  if (clean(body.website, 200) || elapsed < MIN_FILL_MS) return json(res, 200, { ok: true });

  const isEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact);
  const isPhone = contact.replace(/\D/g, '').length >= 10;
  const errors = {};
  if (!nom) errors.nom = true;
  if (!isEmail && !isPhone) errors.contact = true;
  if (!besoin) errors.besoin = true;
  if (Object.keys(errors).length) return json(res, 422, { ok: false, errors });

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  try {
    if (await rateLimited(ip)) {
      res.setHeader('Retry-After', String(RATE_WINDOW_S));
      return json(res, 429, { ok: false });
    }
    if (!process.env.RESEND_API_KEY || !process.env.DEVIS_FROM) throw new Error('mail not configured');
    const to = zone === 'paris' ? process.env.DEVIS_TO_IDF : zone ? process.env.DEVIS_TO_PACA : process.env.DEVIS_TO_DEFAULT;
    const date = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Europe/Paris' }).format(new Date());
    await sendMail({
      to: to || process.env.DEVIS_TO_DEFAULT,
      subject: `Demande de devis : ${nom}`,
      replyTo: isEmail ? contact : undefined,
      text: `Nouvelle demande de devis\n\nNom : ${nom}\nContact : ${contact}\nÉquipe : ${ZONES[zone] || 'Non précisée'}\nPage d’origine : ${source || '—'}\nDate : ${date}\n\nBesoin :\n${besoin}\n`,
    });
    if (isEmail && process.env.DEVIS_ACK_BODY) {
      await sendMail({ to: contact, subject: process.env.DEVIS_ACK_SUBJECT || 'Flora Concept', text: process.env.DEVIS_ACK_BODY.replaceAll('{nom}', nom) }).catch((e) =>
        console.error('devis: acknowledgement failed', e.message),
      );
    }
    return json(res, 200, { ok: true });
  } catch (e) {
    console.error('devis:', e.message);
    return json(res, 500, { ok: false });
  }
}
