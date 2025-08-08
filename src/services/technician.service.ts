// services/technician.service.ts
import { User } from '../models/User';

export const getAllTechnicians = async () => {
  return User.find({ role: 'technician' }).select('name phone email services');
};
