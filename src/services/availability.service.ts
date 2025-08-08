import { TechnicianAvailability } from '../models/TechnicianAvailability';
import { isSlotAvailable } from './appointment.service';
import { Types } from 'mongoose';

// Générer les créneaux disponibles pour un technicien à une date donnée
export const getAvailableSlotsForDay = async (
  technicianId: Types.ObjectId,
  date: Date
) => {
  const dayOfWeek = date.getDay();

  // Récupérer les disponibilités du technicien pour ce jour
  const availability = await TechnicianAvailability.findOne({ technicianId, dayOfWeek });
  if (!availability) return [];

  // Convertir les slots de string en Date pour comparer avec les RDV pris
  const availableSlots = [];

  for (const slot of availability.slots) {
    // Construire les Date complète
    const slotStart = new Date(date);
    const [startH, startM] = slot.startTime.split(':').map(Number);
    slotStart.setHours(startH, startM, 0, 0);

    const slotEnd = new Date(date);
    const [endH, endM] = slot.endTime.split(':').map(Number);
    slotEnd.setHours(endH, endM, 0, 0);

    // Vérifier si ce slot est libre
    const free = await isSlotAvailable(technicianId, slotStart, slotEnd);
    if (free) {
      availableSlots.push({ startTime: slot.startTime, endTime: slot.endTime });
    }
  }

  return availableSlots;
};
