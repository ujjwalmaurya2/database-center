export class AppError extends Error {
  public statusCode: number;
  public details?: any;

  constructor(message: string, statusCode = 500, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  public static badRequest(message: string, details?: any): AppError {
    return new AppError(message, 400, details);
  }

  public static unauthorized(message = 'Unauthorized access'): AppError {
    return new AppError(message, 401);
  }

  public static forbidden(message = 'Forbidden action'): AppError {
    return new AppError(message, 403);
  }

  public static notFound(message = 'Resource not found'): AppError {
    return new AppError(message, 404);
  }

  public static conflict(message: string): AppError {
    return new AppError(message, 409);
  }

  public static internal(message = 'Internal server error'): AppError {
    return new AppError(message, 500);
  }
}
