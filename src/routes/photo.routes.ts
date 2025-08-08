import { Router } from 'express';
import upload from '../middlewares/upload.middleware';
import * as photoController from '../controllers/photo.controller';
import { authenticate} from '../middlewares/auth.middleware';

const router = Router();

// Upload photo (protégé)
router.post('/upload', authenticate, upload.single('photo'), photoController.uploadPhoto);

// Récupérer toutes les photos (public)
router.get('/', photoController.getPhotos);

export default router;
