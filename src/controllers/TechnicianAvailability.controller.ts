import { Request, Response } from 'express';
import { TechnicianAvailability } from '../models/TechnicianAvailability';

// Utilitaire pour formater une date en yyyy-mm-dd ISO string
function toDateString(date: Date | string): string {
  return new Date(date).toISOString().split('T')[0];
}

// Créer ou mettre à jour un créneau de disponibilité
export const upsertAvailability = async (req: Request, res: Response) => {
  const { technicianId, dayOfWeek, date, startTime, endTime } = req.body;

  if (!technicianId || !startTime || !endTime) {
    return res.status(400).json({ message: 'technicianId, startTime et endTime requis' });
  }

  if (dayOfWeek !== undefined && (dayOfWeek < 0 || dayOfWeek > 6)) {
    return res.status(400).json({ message: 'dayOfWeek doit être entre 0 et 6' });
  }

  if (date) {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: 'Date invalide' });
    }
  }

  try {
    // On cherche le document de disponibilité existant (par date ou dayOfWeek)
    const filter: any = { technicianId };
    if (date) filter.date = toDateString(date);
    else if (dayOfWeek !== undefined) filter.dayOfWeek = dayOfWeek;
    else return res.status(400).json({ message: 'Il faut un dayOfWeek ou une date' });

    let availability = await TechnicianAvailability.findOne(filter);

    if (!availability) {
      // Pas trouvé, création
      availability = new TechnicianAvailability({
        technicianId,
        dayOfWeek: filter.dayOfWeek,
        date: filter.date,
        slots: [{ startTime, endTime }],
      });
    } else {
      // Mise à jour : on ajoute ou remplace le créneau dans slots
      // Si le créneau existe déjà (même startTime), on remplace endTime
      const slotIndex = availability.slots.findIndex(
        slot => slot.startTime === startTime
      );
      if (slotIndex >= 0) {
        availability.slots[slotIndex].endTime = endTime;
      } else {
        availability.slots.push({ startTime, endTime });
      }
    }

    await availability.save();

    res.json(availability);
  } catch (error) {
    console.error('Erreur dans upsertAvailability:', error);
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// Récupérer les créneaux pour un jour récurrent (dayOfWeek)
export const getAvailabilityByDay = async (req: Request, res: Response) => {
  const { technicianId, dayOfWeek } = req.params;

  if (!technicianId || dayOfWeek === undefined) {
    return res.status(400).json({ message: 'technicianId et dayOfWeek requis' });
  }

  try {
    const day = Number(dayOfWeek);
    if (day < 0 || day > 6) {
      return res.status(400).json({ message: 'dayOfWeek doit être entre 0 et 6' });
    }

    const availability = await TechnicianAvailability.findOne({ technicianId, dayOfWeek: day }).lean();

    if (!availability) return res.json([]);

    res.json(availability.slots);
  } catch (error) {
    console.error('Erreur dans getAvailabilityByDay:', error);
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// Récupérer les créneaux pour une date donnée (priorité aux créneaux spécifiques)
export const getAvailabilityByDate = async (req: Request, res: Response) => {
  const { technicianId, date } = req.params;

  if (!technicianId || !date) {
    return res.status(400).json({ message: 'technicianId et date requis' });
  }

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return res.status(400).json({ message: 'Date invalide' });
  }

  try {
    const dateStr = toDateString(parsedDate);
    const dayOfWeek = parsedDate.getDay();

    // Cherche d'abord une dispo spécifique à la date
    let availability = await TechnicianAvailability.findOne({ technicianId, date: dateStr }).lean();

    // Sinon la dispo récurrente
    if (!availability) {
      availability = await TechnicianAvailability.findOne({ technicianId, dayOfWeek }).lean();
    }

    if (!availability) return res.json([]);

    res.json(availability.slots);
  } catch (error) {
    console.error('Erreur dans getAvailabilityByDate:', error);
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// Générer les 30 prochaines dates avec au moins un créneau récurrent disponible
export const getAvailableDates = async (req: Request, res: Response) => {
  try {
    const { technicianId } = req.params;

    if (!technicianId) {
      return res.status(400).json({ message: 'Technician ID requis.' });
    }

    // Jours de la semaine où le technicien a au moins un créneau (avec au moins un slot non vide)
    const recurringAvailabilities = await TechnicianAvailability.find({
      technicianId,
      dayOfWeek: { $exists: true },
      'slots.0': { $exists: true }, // au moins un slot
    }).lean();

    const recurringDays = recurringAvailabilities.map(d => d.dayOfWeek!).filter(d => d !== undefined);

    const today = new Date();
    const maxDays = 30;
    const availableDatesSet = new Set<string>();

    for (let i = 0; i <= maxDays; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + i);
      if (recurringDays.includes(checkDate.getDay())) {
        availableDatesSet.add(toDateString(checkDate));
      }
    }

    const availableDates = Array.from(availableDatesSet).sort();

    res.json(availableDates);
  } catch (error) {
    console.error('Erreur dans getAvailableDates:', error);
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// Récupérer les créneaux horaires disponibles pour une date précise (priorité aux créneaux spécifiques)
export const getAvailableSlotsByDate = async (req: Request, res: Response) => {
  const { technicianId, date } = req.params;

  if (!technicianId || !date) {
    return res.status(400).json({ message: 'Technician ID et date requis.' });
  }

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return res.status(400).json({ message: 'Date invalide.' });
  }

  try {
    const dateStr = toDateString(parsedDate);
    const dayOfWeek = parsedDate.getDay();

    // Cherche d'abord des créneaux spécifiques à la date
    let availability = await TechnicianAvailability.findOne({ technicianId, date: dateStr }).lean();

    // Sinon créneaux récurrents pour ce jour de semaine
    if (!availability) {
      availability = await TechnicianAvailability.findOne({ technicianId, dayOfWeek }).lean();
    }

    if (!availability) return res.json([]);

    res.json(availability.slots);
  } catch (error) {
    console.error('Erreur dans getAvailableSlotsByDate:', error);
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};
