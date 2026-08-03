import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { AppError } from '../core/errors/app-error';

const ROLE_HIERARCHY: Record<string, number> = {
  OWNER: 4,
  ADMIN: 3,
  EDITOR: 2,
  VIEWER: 1,
};

export function requireRole(requiredRole: 'OWNER' | 'ADMIN' | 'EDITOR' | 'VIEWER') {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(AppError.unauthorized('User context missing'));
    }

    const userRoleWeight = ROLE_HIERARCHY[req.user.role?.toUpperCase()] || 0;
    const requiredRoleWeight = ROLE_HIERARCHY[requiredRole] || 0;

    if (userRoleWeight < requiredRoleWeight) {
      return next(AppError.forbidden(`Requires ${requiredRole} permission or higher`));
    }

    next();
  };
}
