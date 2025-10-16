import { Router } from 'express';
import { sendController } from '../../controllers/send.controller.js';

export const sendRouter = Router();
sendRouter.post('/send', (req, res, next) => {
  Promise.resolve(sendController(req, res)).catch(next);
});
