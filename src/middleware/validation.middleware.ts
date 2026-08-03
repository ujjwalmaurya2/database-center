import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from '../core/errors/app-error';

export function validateRequest(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
        return next(AppError.badRequest('Validation failed', issues));
      }
      next(error);
    }
  };
}
