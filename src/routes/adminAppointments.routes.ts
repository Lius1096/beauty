import { Router } from 'express';
import * as adminAppointmentController from '../controllers/adminAppointment.controller';
import { adminAuthMiddleware } from '../middlewares/adminAuth.middleware';

const router = Router();

// Changer le statut du RDV (accepté, rejeté, terminé)
router.patch('/:appointmentId/status', adminAuthMiddleware, adminAppointmentController.updateStatus);

// Liste de tous les RDVs (optionnel, avec filtres)
router.get('/', adminAuthMiddleware, adminAppointmentController.getAllAppointments);

export default router;
