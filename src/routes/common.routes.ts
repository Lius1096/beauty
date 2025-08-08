import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { getProfile } from '../controllers/common.controller';

const router = Router();

router.get('/profile', authenticate, getProfile);

export default router;
