import { Request, Response } from 'express';
import { Technician } from '../models/Technician';

export const getTechnicianDashboard = (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Bienvenue sur le tableau de bord technicien',
    user: req.user,
  });
};

export const getAllTechnicians = async (req: Request, res: Response) => {
  try {
    const technicians = await Technician.find().select('-__v'); // optionnel : on exclut __v
    res.status(200).json(technicians);
  } catch (err) {
    console.error('Erreur getAllTechnicians:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};