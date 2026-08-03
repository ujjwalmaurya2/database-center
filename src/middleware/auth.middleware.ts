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
  let token: string | undefined;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.query.token && typeof req.query.token === 'string') {
    token = req.query.token;
  }

  if (!token) {
    return next(AppError.unauthorized('Missing or invalid Authorization header'));
  }

  try {
    const decoded = EncryptionService.verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return next(AppError.unauthorized('Invalid or expired access token'));
  }
}
