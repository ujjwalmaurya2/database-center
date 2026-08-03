import { Request, Response, NextFunction } from 'express';
import { GoogleDriveStorageProvider } from '../../core/storage/providers/google-drive.provider';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

const googleProvider = new GoogleDriveStorageProvider();

export class GoogleAuthController {
  public static async initiateAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const projectId = (req.query.projectId as string) || (req.headers['x-project-id'] as string);
      const userId = (req as AuthenticatedRequest).user?.id;
      const targetId = projectId || userId;

      const authUrl = await googleProvider.getAuthUrl(targetId);
      res.redirect(authUrl);
    } catch (error) {
      next(error);
    }
  }

  public static async handleCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const code = (req.query.code as string) || '';
      const userId = (req as AuthenticatedRequest).user?.id || 'usr_demo_1';
      const projectId = (req.query.projectId as string);

      await googleProvider.connect({ code, userId, projectId });

      // Redirect back to frontend storage page with success indicator
      res.redirect('/storage.html?drive_connected=true');
    } catch (error) {
      next(error);
    }
  }

  public static async getStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id || 'usr_demo_1';
      const isConnected = await googleProvider.isConnected(userId);
      res.status(200).json({
        success: true,
        data: {
          connected: isConnected,
          provider: 'google_drive',
          appFolder: 'DriveBase-App',
          userEmail: req.user?.email || 'owner@drivebase.io',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async disconnect(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id || 'usr_demo_1';
      await googleProvider.disconnect(userId);
      res.status(200).json({
        success: true,
        message: 'Google Drive disconnected successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
