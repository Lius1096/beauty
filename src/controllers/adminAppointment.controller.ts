import { Request, Response, NextFunction } from 'express';
import { Appointment } from '../models/Appointment';

// Modifier le statut (accepté, rejeté, terminé)
export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    if (!['accepted', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Statut invalide.' });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ success: false, message: 'RDV non trouvé' });

    appointment.status = status;
    await appointment.save();

    res.json({ success: true, data: appointment, message: `RDV ${status}` });
  } catch (err) {
    next(err);
  }
};

// Récupérer tous les RDVs (optionnel)
export const getAllAppointments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const appointments = await Appointment.find().sort({ startTime: 1 });
    res.json({ success: true, data: appointments });
  } catch (err) {
    next(err);
  }
};
