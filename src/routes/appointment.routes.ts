import express from 'express';
import { createAppointment, getAvailableSlots, getTechnicianSchedule } from '../controllers/appointment.controller';

const router = express.Router();

router.post('/', createAppointment);
router.get('/available-slots/:technicianId/:date', getAvailableSlots);
router.get('/technician-schedule/:technicianId', getTechnicianSchedule);

export default router;