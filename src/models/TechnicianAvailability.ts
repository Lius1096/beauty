import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITimeSlot {
  startTime: string; // "09:00"
  endTime: string;   // "17:00"
}

export interface ITechnicianAvailability extends Document {
  technicianId: Types.ObjectId;
  dayOfWeek?: number;   // 0=dimanche ... 6=samedi (optionnel si date spécifique)
  date?: Date;          // optionnel pour les overrides ponctuels
  slots: ITimeSlot[];
}

const TimeSlotSchema = new Schema<ITimeSlot>({
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
});

const TechnicianAvailabilitySchema = new Schema<ITechnicianAvailability>(
  {
    technicianId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dayOfWeek: {
      type: Number,
      min: 0,
      max: 6,
    },
    date: {
      type: Date,
    },
    slots: {
      type: [TimeSlotSchema],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index unique pour éviter doublons : 1 par jour OU par date
TechnicianAvailabilitySchema.index(
  { technicianId: 1, dayOfWeek: 1 },
  { unique: true, partialFilterExpression: { dayOfWeek: { $exists: true } } }
);

TechnicianAvailabilitySchema.index(
  { technicianId: 1, date: 1 },
  { unique: true, partialFilterExpression: { date: { $exists: true } } }
);

export const TechnicianAvailability = mongoose.model<ITechnicianAvailability>(
  'TechnicianAvailability',
  TechnicianAvailabilitySchema
);
