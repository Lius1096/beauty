import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { getClientDashboard } from '../controllers/client.controller';

const router = Router();

router.get('/dashboard', authenticate, authorize('client'), getClientDashboard);

export default router;
