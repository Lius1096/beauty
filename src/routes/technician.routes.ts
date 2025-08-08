import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { getTechnicianDashboard, getAllTechnicians } from '../controllers/technician.controller';

const router = Router();

router.get('/dashboard', authenticate, authorize('technician'), getTechnicianDashboard);
router.get('/', getAllTechnicians); // GET /api/technicians
// Tu peux ajouter aussi : gérer les services, rendez-vous, etc.
export default router;
