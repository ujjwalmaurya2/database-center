import { Request, Response, NextFunction } from 'express';
import { AppError } from '../core/errors/app-error';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  console.error('[Error Handler]', err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        statusCode: err.statusCode,
        details: err.details || null,
      },
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error',
      statusCode: 500,
    },
  });
}
