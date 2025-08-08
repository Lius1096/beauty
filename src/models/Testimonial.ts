import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  name: string;
  message: string;
  imageUrl?: string;
  cloudinaryId?: string;  // Ajout du champ cloudinaryId optionnel
}

const TestimonialSchema: Schema = new Schema({
  name: { type: String, required: true },
  message: { type: String, required: true },
  imageUrl: { type: String },
  cloudinaryId: { type: String },  // Nouveau champ stockant l'ID Cloudinary
}, {
  timestamps: true
});

export default mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
