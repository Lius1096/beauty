import express from 'express';
import { getHeroImages, getPleasureImages } from '../controllers/cloudinary.controller';

const router = express.Router();

// GET /api/cloudinary/hero-images
router.get('/hero-images', getHeroImages);
router.get('/pleasure', getPleasureImages);

export default router;
