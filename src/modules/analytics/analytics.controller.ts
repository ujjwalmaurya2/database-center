import { Response, NextFunction } from 'express';
import { AnalyticsService } from './analytics.service';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class AnalyticsController {
  public static async getOverview(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const projectId = (req.headers['x-project-id'] as string) || 'proj_alpha_1';
      const overview = await AnalyticsService.getOverview(projectId);
      res.status(200).json({
        success: true,
        data: overview,
      });
    } catch (error) {
      next(error);
    }
  }
}
