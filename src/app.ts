import express, { Request, Response } from 'express';
import appointmentRoutes from './routes/appointment.routes';
import { errorHandler } from './middlewares/error.middleware';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.routes';
import clientRoutes from './routes/client.routes';
import technicianRoutes from './routes/technician.routes';
import availabilityRoutes from './routes/TechnicianAvailability.routes';
import adminRoutes from './routes/admin.routes';
import commonRoutes from './routes/common.routes';
import cloudinaryRoutes from './routes/cloudinary.routes';
import testimonialsRoutes from './routes/testimonialRoutes';
import serviceRoutes from './routes/service.routes';
dotenv.config();

// Pour résoudre __dirname avec ESM (import.meta.url)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin vers dossier public
const publicPath = path.join(__dirname, '..', 'public');

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Fichiers statiques
// app.use('/public', express.static(publicPath));
app.use(express.static(publicPath));

// Route racine qui sert index.html
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Routes des rendez-vous
app.use('/api/appointments', appointmentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/technicians', technicianRoutes);
app.use('/api', availabilityRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/common', commonRoutes);
app.use('/api/cloudinary', cloudinaryRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/services', serviceRoutes);
// Middleware de gestion d’erreur (doit être après les routes)
app.use(errorHandler);

// Connexion à MongoDB
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('⚠️ MONGODB_URI non défini dans .env');
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('Erreur connexion MongoDB:', err);
    process.exit(1);
  });

export default app;
