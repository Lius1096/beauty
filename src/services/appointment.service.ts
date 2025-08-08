import { Appointment } from '../models/Appointment';
import { Types } from 'mongoose';

// Vérifier si un créneau est libre
export const isSlotAvailable = async (
  technicianId: Types.ObjectId,
  startTime: Date,
  endTime: Date
): Promise<boolean> => {
  const conflicting = await Appointment.findOne({
    technician: technicianId,
    $or: [
      { startTime: { $lt: endTime, $gte: startTime } },
      { endTime: { $gt: startTime, $lte: endTime } },
      { startTime: { $lte: startTime }, endTime: { $gte: endTime } },
    ],
    status: { $in: ['pending', 'accepted'] },
  });

  return !conflicting;
};

// Créer un rendez-vous
export const createAppointment = async (appointmentData: any) => {
  const appointment = new Appointment(appointmentData);
  return appointment.save();
};

// Annuler un rendez-vous
export const cancelAppointment = async (appointmentId: string) => {
  return Appointment.findByIdAndUpdate(appointmentId, { status: 'cancelled' }, { new: true });
};

// Modifier le statut d'un rendez-vous (ex: accepté, refusé)
export const updateAppointmentStatus = async (
  appointmentId: string,
  status: 'pending' | 'accepted' | 'refused' | 'cancelled'
) => {
  return Appointment.findByIdAndUpdate(appointmentId, { status }, { new: true });
};

// Obtenir tous les rendez-vous d’un technicien
export const getAppointmentsByTechnician = async (technicianId: string) => {
  return Appointment.find({ technician: technicianId }).populate('client');
};

// Obtenir tous les rendez-vous d’un client
export const getAppointmentsByClient = async (clientId: string) => {
  return Appointment.find({ client: clientId }).populate('technician');
};

// Récupérer un rendez-vous précis
export const getAppointmentById = async (appointmentId: string) => {
  return Appointment.findById(appointmentId).populate('technician').populate('client');
};
