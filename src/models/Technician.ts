import mongoose, { Document, Schema } from 'mongoose';

export interface ITechnician extends Document {
  name: string;
  email: string;
  phone: string;
  specialty?: string;
  // Suppression du champ availability ici
}

const TechnicianSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  specialty: { type: String },
  // Suppression complète de availability
});

export const Technician = mongoose.model<ITechnician>('Technician', TechnicianSchema);
