import { Schema, model } from 'mongoose';

const photoSchema = new Schema(
  {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
  { timestamps: true }
);

export const Photo = model('Photo', photoSchema);
