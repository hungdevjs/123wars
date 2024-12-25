import { Router } from 'express';

import auth from '../middlewares/auth.middleware.js';
import limiter from '../middlewares/rateLimit.middleware.js';
import * as controllers from '../controllers/round.controller.js';

const router = Router();

router.post('/signature', limiter, auth, controllers.generateBetSignature);

router.put('/transaction', limiter, auth, controllers.validateGameTransaction);

export default router;
