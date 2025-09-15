import { Request, Response, NextFunction } from 'express';
import { JwtUtils } from '../../utils/helpers/jwtUtils';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'دسترسی غیرمجاز. لطفاً وارد شوید.' });
    }

    const payload = JwtUtils.verifyToken(token);
    (req as any).user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'توکن نامعتبر است' });
  }
};
