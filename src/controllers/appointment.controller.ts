import { Request, Response } from 'express';
import { Appointment } from '../models/Appointment';
import { Technician } from '../models/Technician';
import { Service } from '../models/Service';
import { TechnicianAvailability } from '../models/TechnicianAvailability';
import mongoose from 'mongoose';

const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const { clientName, clientPhone, technician, service, startTime, message } = req.body;

    const tech = isValidObjectId(technician)
      ? await Technician.findById(technician)
      : await Technician.findOne({ name: technician });

    const srv = isValidObjectId(service)
      ? await Service.findById(service)
      : await Service.findOne({ name: service });

    if (!tech || !srv) {
      return res.status(400).json({ message: 'Technicien ou service invalide.' });
    }

    const start = new Date(startTime);
    const end = new Date(start.getTime() + srv.duration * 60000);
    const dayOfWeek = start.getDay();
    const dateOnly = start.toISOString().split('T')[0];

    let availability = await TechnicianAvailability.findOne({
      technicianId: tech._id,
      date: dateOnly,
    });

    if (!availability) {
      availability = await TechnicianAvailability.findOne({
        technicianId: tech._id,
        dayOfWeek,
      });
    }

    if (!availability) {
      return res.status(400).json({ message: 'Technicien indisponible ce jour.' });
    }

    const timeStr = start.toTimeString().slice(0, 5);
    const matchingSlot = availability.slots.find(slot => {
      return timeStr >= slot.startTime && timeStr < slot.endTime;
    });

    if (!matchingSlot) {
      return res.status(400).json({ message: 'Horaire hors des heures disponibles.' });
    }

    const overlapping = await Appointment.find({
      technician: tech._id,
      status: { $in: ['pending', 'accepted'] },
      $or: [{ startTime: { $lt: end }, endTime: { $gt: start } }],
    });

    if (overlapping.length > 0) {
      return res.status(409).json({ message: 'Créneau déjà réservé.' });
    }

    const newAppt = new Appointment({
      clientName,
      clientPhone,
      technician: tech._id,
      service: srv.name,
      startTime: start,
      endTime: end,
      message,
    });

    await newAppt.save();
    res.status(201).json({ message: 'Rendez-vous enregistré.' });
  } catch (err: unknown) {
    console.error('Erreur createAppointment:', err);
    let errorMessage = 'Erreur serveur';
    if (err instanceof Error) errorMessage = err.message;
    res.status(500).json({ message: errorMessage });
  }
};

export const getAvailableSlots = async (req: Request, res: Response) => {
  try {
    const { technicianId, date } = req.params;
    const tech = await Technician.findById(technicianId);
    if (!tech) return res.status(404).json({ message: 'Technicien introuvable' });

    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay();

    let availability = await TechnicianAvailability.findOne({
      technicianId,
      date,
    });

    if (!availability) {
      availability = await TechnicianAvailability.findOne({
        technicianId,
        dayOfWeek,
      });
    }

    if (!availability) {
      return res.status(400).json({ message: 'Indisponible ce jour.' });
    }

    const appointments = await Appointment.find({
      technician: technicianId,
      startTime: { $gte: new Date(date), $lte: new Date(`${date}T23:59:59`) },
      status: { $in: ['pending', 'accepted'] }
    });

    const services = await Service.find();
    const results: any[] = [];

    for (const service of services) {
      const duration = service.duration;
      const slots: string[] = [];

      for (const slot of availability.slots) {
        let current = new Date(`${date}T${slot.startTime}`);
        const slotEnd = new Date(`${date}T${slot.endTime}`);

        while (current.getTime() + duration * 60000 <= slotEnd.getTime()) {
          const currentEnd = new Date(current.getTime() + duration * 60000);
          const conflict = appointments.some(appt => current < appt.endTime && currentEnd > appt.startTime);
          if (!conflict) slots.push(current.toISOString());
          current = new Date(current.getTime() + 15 * 60000);
        }
      }

      results.push({ service: service.name, duration, slots });
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
};

export const getTechnicianSchedule = async (req: Request, res: Response) => {
  try {
    const technicianId = req.params.technicianId;
    const tech = await Technician.findById(technicianId);
    if (!tech) return res.status(404).json({ message: 'Technicien introuvable' });

    const availabilities = await TechnicianAvailability.find({ technicianId });
    res.json(availabilities);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
};
