import { Router } from 'express';
import { sendRouter } from './v1/send.router.js';
import { healthRouter } from './v1/health.router.js';

export function mountRoutes(app) {
  const r = Router();
  r.use('/v1', sendRouter);
  r.use('/v1', healthRouter);
  app.use(r);
}
