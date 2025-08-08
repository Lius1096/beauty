import { Request, Response } from 'express';

export const getClientDashboard = (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Bienvenue sur le tableau de bord client',
    user: req.user,
  });
};
