import { Request, Response, NextFunction } from 'express';
import { EncryptionService } from '../core/crypto/encryption.service';
import { AppError } from '../core/errors/app-error';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export function authenticateJWT(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(AppError.unauthorized('Missing or invalid Authorization header'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = EncryptionService.verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return next(AppError.unauthorized('Invalid or expired access token'));
  }
}
