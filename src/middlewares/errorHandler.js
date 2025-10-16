import { logger } from '../utils/logger.js';
export function errorHandler(err, req, res, _next) {
  const status = err.status || 500;
  logger.error({ err, path: req.path }, 'request_error');
  res.status(status).json({ error: err.message || 'internal_error', details: err.details });
}
