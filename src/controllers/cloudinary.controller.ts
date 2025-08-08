import { Request, Response, NextFunction } from 'express';
import cloudinary from '../cloudinaryConfig';

export const getHeroImages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await cloudinary.search
      .expression('folder:hero_images/*')
      .max_results(3)
      .execute();

    const images = result.resources.map((r: any) => ({
      url: r.secure_url,
      alt: r.public_id,
    }));

    res.status(200).json(images);
  } catch (error) {
    console.error('Erreur Cloudinary:', error);
    next(error);
  }
};

export const getPleasureImages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await cloudinary.search
      .expression('folder:pleasure/*')
      .max_results(30)
      .execute();

    const images = result.resources.map((r: any) => ({
      url: r.secure_url,
      alt: r.public_id,
    }));

    res.status(200).json(images);
  } catch (error) {
    console.error('Erreur Cloudinary:', error);
    next(error);
  }
};
