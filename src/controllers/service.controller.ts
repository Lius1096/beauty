import { Request, Response } from 'express';
import { Service } from '../models/Service';

export const getAllServices = async (req: Request, res: Response) => {
  try {
    const services = await Service.find().select('-__v');
    res.status(200).json(services);
  } catch (err) {
    console.error('Erreur getAllServices:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
