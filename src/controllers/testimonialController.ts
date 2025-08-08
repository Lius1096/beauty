import { Request, Response } from 'express';
import Testimonial from '../models/Testimonial';
import { v2 as cloudinary } from 'cloudinary';

// Config Cloudinary (à placer dans un fichier séparé idéalement)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const getAllTestimonials = async (req: Request, res: Response) => {
  const testimonials = await Testimonial.find().sort({ createdAt: -1 });
  res.json(testimonials);
};

export const createTestimonial = async (req: Request, res: Response) => {
  const { name, message } = req.body;
  let imageUrl, cloudinaryId;

  if (req.file) {
    const upload = await cloudinary.uploader.upload(req.file.path, {
      folder: 'testimonials',
    });
    imageUrl = upload.secure_url;
    cloudinaryId = upload.public_id;
  }

  const testimonial = new Testimonial({ name, message, imageUrl, cloudinaryId });
  await testimonial.save();
  res.status(201).json(testimonial);
};

export const updateTestimonial = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, message } = req.body;

  try {
    const oldTestimonial = await Testimonial.findById(id);
    if (!oldTestimonial) {
      return res.status(404).json({ message: "Témoignage non trouvé" });
    }

    let imageUrl = oldTestimonial.imageUrl;
    let cloudinaryId = oldTestimonial.cloudinaryId;

    if (req.file) {
      // Supprimer l'ancienne image sur Cloudinary si elle existe
      if (cloudinaryId) {
        await cloudinary.uploader.destroy(cloudinaryId);
      }

      // Upload nouvelle image
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: 'testimonials',
      });

      imageUrl = upload.secure_url;
      cloudinaryId = upload.public_id;

    }

    const updated = await Testimonial.findByIdAndUpdate(
      id,
      { name, message, imageUrl, cloudinaryId },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.error("Erreur updateTestimonial:", error);
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour" });
  }
};


export const deleteTestimonial = async (req: Request, res: Response) => {
  const { id } = req.params;
  await Testimonial.findByIdAndDelete(id);
  res.status(204).send();
};


export const getTestimonialById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Témoignage non trouvé' });
    }
    res.json(testimonial);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
