import { Request, Response, NextFunction } from 'express';
import { Photo } from '../models/Photo';

export const uploadPhoto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const { path: url, filename: public_id } = req.file as any; // Cloudinary file object

    const photo = new Photo({ url, public_id });
    await photo.save();

    res.status(201).json({ success: true, data: photo });
  } catch (error) {
    next(error);
  }
};

export const getPhotos = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const photos = await Photo.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: photos });
  } catch (error) {
    next(error);
  }
};
