import { Request, Response } from 'express';

export const getProfile = (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Non authentifié' });
  }

  res.status(200).json({
    message: 'Profil utilisateur',
    user: req.user,
  });
};
