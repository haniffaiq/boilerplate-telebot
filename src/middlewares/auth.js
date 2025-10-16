import { ENV } from '../utils/env.js';
export function auth(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (token !== ENV.API_KEY) return res.status(401).json({ error: 'unauthorized' });
  next();
}
