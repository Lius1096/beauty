import { Request, Response } from 'express';
import { User } from '../models/User';

// Tableau de bord admin
export const getAdminDashboard = (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Bienvenue sur le tableau de bord admin',
    user: req.user,
  });
};

// Liste de tous les utilisateurs
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
  }
};

// Supprimer un utilisateur
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
};
