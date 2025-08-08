import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAppointment extends Document {
  clientId?: Types.ObjectId;
  clientName: string;
  clientPhone: string;
  technician: Types.ObjectId;
  service: string;
  startTime: Date;
  endTime: Date;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  message?: string;  // ajout optionnel
}

const appointmentSchema = new Schema<IAppointment>(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    clientName: { type: String, required: true },
    clientPhone: {
      type: String,
      required: true,
      match: /^(\+33|0)[1-9](\d{2}){4}$/
    },
    technician: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    service: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed'],
      default: 'pending'
    },
    message: { type: String, required: false }  // ajout ici
  },
  { timestamps: true }
);

export const Appointment = mongoose.model<IAppointment>('Appointment', appointmentSchema);
