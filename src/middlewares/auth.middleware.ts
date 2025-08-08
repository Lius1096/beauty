import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt';

// Définir les rôles autorisés
export type UserRole = 'client' | 'technician' | 'admin';

// Étendre Request avec les infos utilisateur
export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}

// Fonction de vérification du rôle (type guard)
const isValidRole = (role: any): role is UserRole => {
  return ['client', 'technician', 'admin'].includes(role);
};

// Middleware pour authentifier l'utilisateur via le JWT en cookie
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Token manquant' });
    }

    const payload = verifyJwt<{ id: string; role: string }>(token);
    if (!payload || !isValidRole(payload.role)) {
      return res.status(401).json({ message: 'Token invalide ou rôle non autorisé' });
    }

    req.user = {
      id: payload.id,
      role: payload.role
    };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentification échouée', error });
  }
};

// Middleware pour autoriser uniquement certains rôles
export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Accès refusé : rôle non autorisé" });
    }

    next();
  };
};
