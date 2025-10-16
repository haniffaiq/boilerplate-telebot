import { RATE_LIMIT } from '../config/app.config.js';
const hits = new Map();
export function rateLimit(req, res, next) {
  const ip = req.ip || req.headers['x-forwarded-for'] || 'local';
  const now = Date.now();
  const rec = hits.get(ip) || { count: 0, ts: now };
  if (now - rec.ts > RATE_LIMIT.WINDOW_MS) { rec.count = 0; rec.ts = now; }
  if (++rec.count > RATE_LIMIT.MAX_HITS) return res.status(429).json({ error: 'rate_limited' });
  hits.set(ip, rec);
  next();
}
