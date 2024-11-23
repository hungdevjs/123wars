import { Router } from 'express';

import auth from '../middlewares/auth.middleware.js';
import limiter from '../middlewares/rateLimit.middleware.js';
import * as controllers from '../controllers/auth.controller.js';

const router = Router();

router.get('/login', limiter, controllers.generateLoginPayload);

router.post('/login', limiter, controllers.validateLoginPayload);

router.get('/me', limiter, auth, controllers.getMe);

export default router;
