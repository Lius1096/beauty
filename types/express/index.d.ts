import { User } from '../../models/User';
import { Multer } from 'multer';

declare global {
  namespace Express {
    interface Request {
      user?: User;

      // Pour multer (image upload)
      file?: Express.Multer.File;
      files?: Express.Multer.File[];
    }
  }
}
