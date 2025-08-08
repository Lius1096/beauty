import { Router } from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Public: Inscription
router.post('/register', registerUser);

// Public: Connexion
router.post('/login', loginUser);

// Protégé: Déconnexion (nécessite authentification)
router.post('/logout', authenticate, logoutUser);

export default router;
