import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class AuthController {
  public static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.login(req.body);
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const result = await AuthService.refreshToken(refreshToken);
      res.status(200).json({
        success: true,
        message: 'Tokens refreshed successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const profile = await AuthService.getUserProfile(userId);
      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async logout(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  }
}
