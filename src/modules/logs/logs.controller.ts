import { Response, NextFunction } from 'express';
import { LogsService } from './logs.service';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class LogsController {
  public static async list(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const projectId = (req.headers['x-project-id'] as string) || 'proj_alpha_1';
      const level = req.query.level as string;
      const search = req.query.search as string;
      const logs = await LogsService.listLogs(projectId, level, search);
      res.status(200).json({
        success: true,
        data: logs,
      });
    } catch (error) {
      next(error);
    }
  }
}
