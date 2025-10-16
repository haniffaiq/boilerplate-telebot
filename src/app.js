import express from 'express';
import { ENV } from './utils/env.js';
import { auth } from './middlewares/auth.js';
import { rateLimit } from './middlewares/rateLimit.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { mountRoutes } from './routes/index.js';

export function buildApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '256kb' }));
  app.use(rateLimit);
  app.use(auth);
  mountRoutes(app);
  app.use(errorHandler);
  return app;
}
