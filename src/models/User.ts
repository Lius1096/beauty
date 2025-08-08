import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'client' | 'technician' | 'admin';
  services?: string[]; // Services proposés par le technicien (facultatif pour les autres rôles)
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: {
      type: String,
      required: true,
      match: /^(\+33|0)[1-9](\d{2}){4}$/,
      unique: true
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['client', 'technician', 'admin'],
      default: 'client'
    },
    services: {
      type: [String],
      enum: [
        'Pose d’ongles',
        'Vernis semi-permanent',
        'Dépose',
        'Soin des mains',
        'Soin des pieds'
      ],
      default: [],
    }
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
