import { Router } from 'express';

import auth from '../middlewares/auth.middleware.js';
import limiter from '../middlewares/rateLimit.middleware.js';
import * as controllers from '../controllers/user.controller.js';

const router = Router();

router.get('/me', limiter, auth, controllers.getMe);

router.put('/me/phone', limiter, auth, controllers.validatePhoneNumber);

router.put(
  '/me/transaction',
  limiter,
  auth,
  controllers.validateGameTransaction
);

export default router;
