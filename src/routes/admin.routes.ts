import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import {
  getAdminDashboard,
  getAllUsers,
  deleteUser,
} from '../controllers/admin.controller';

const router = Router();

router.get('/dashboard', authenticate, authorize('admin'), getAdminDashboard);
router.get('/users', authenticate, authorize('admin'), getAllUsers);
router.delete('/user/:id', authenticate, authorize('admin'), deleteUser);

export default router;
