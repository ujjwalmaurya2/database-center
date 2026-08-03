import { Response, NextFunction } from 'express';
import { SyncService } from './sync.service';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class SyncController {
  public static async getStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const projectId = (req.headers['x-project-id'] as string) || 'proj_alpha_1';
      const status = await SyncService.getStatus(projectId);
      res.status(200).json({
        success: true,
        data: status,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async triggerSync(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const projectId = (req.headers['x-project-id'] as string) || 'proj_alpha_1';
      const job = await SyncService.triggerSync(projectId);
      res.status(200).json({
        success: true,
        message: 'Sync scan triggered',
        data: job,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async pauseQueue(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await SyncService.pauseQueue();
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async resumeQueue(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await SyncService.resumeQueue();
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async retryFailed(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const projectId = (req.headers['x-project-id'] as string) || 'proj_alpha_1';
      const result = await SyncService.retryFailed(projectId);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}
