import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'ta_clef_secrete_par_defaut';
const JWT_EXPIRES_IN = '1d'; // ou ce que tu veux, ex: '2h', '7d', etc.

export function signJwt(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyJwt<T>(token: string): T | null {
  try {
    return jwt.verify(token, JWT_SECRET) as T;
  } catch (error) {
    return null;
  }
}
