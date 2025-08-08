import express from 'express';
import multer from 'multer';
import {
  getAllTestimonials,
  getTestimonialById,    
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} from '../controllers/testimonialController';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', getAllTestimonials);
router.get('/:id', getTestimonialById);         // <-- AJOUTE cette route
router.post('/', upload.single('image'), createTestimonial);
router.put('/:id', upload.single('image'), updateTestimonial);
router.delete('/:id', deleteTestimonial);

export default router;
