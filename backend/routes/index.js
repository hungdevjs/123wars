import { Router } from 'express';

import json from '../middlewares/json.middleware.js';
import authRoute from './auth.route.js';
import userRoute from './user.route.js';

const router = Router();

router.all('*', json);
router.use('/v1/auth', authRoute);
router.use('/v1/users', userRoute);

export default router;
