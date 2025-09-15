import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

export interface JwtPayload {
  userId: number;
  email: string;
  username: string;
}

export class JwtUtils {
  static generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    } as jwt.SignOptions);
  }

  static verifyToken(token: string): JwtPayload {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  }

  static decodeToken(token: string): JwtPayload {
    return jwt.decode(token) as JwtPayload;
  }
}
