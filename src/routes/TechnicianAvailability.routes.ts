import { Router } from 'express';
import {
  upsertAvailability,
  getAvailabilityByDay,
  getAvailabilityByDate,
  getAvailableDates,
} from '../controllers/TechnicianAvailability.controller';

const router = Router();

// Ajouter ou modifier une disponibilité
router.post('/availability', upsertAvailability);

// Disponibilité récurrente (par jour de semaine)
router.get('/availability/day/:technicianId/:dayOfWeek', getAvailabilityByDay);

// Disponibilité spécifique (date exacte)
router.get('/availability/date/:technicianId/:date', getAvailabilityByDate);

// Liste des 30 dates disponibles pour Flatpickr
router.get('/availability/dates/:technicianId', getAvailableDates);

export default router;
