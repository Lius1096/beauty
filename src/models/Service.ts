// models/Service.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  name: string;
  duration: number; // durée en minutes
  price?: number;
}

const ServiceSchema: Schema = new Schema({
  name: { type: String, required: true },
  duration: { type: Number, required: true },
  price: { type: Number },
});

export const Service = mongoose.model<IService>('Service', ServiceSchema);
