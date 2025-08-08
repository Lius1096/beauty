import { Router } from 'express';
import { getAllServices } from '../controllers/service.controller';

const router = Router();

router.get('/', getAllServices); // GET /api/services

export default router;
