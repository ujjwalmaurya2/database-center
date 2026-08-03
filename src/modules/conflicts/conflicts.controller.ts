import { Response, NextFunction } from 'express';
import { ConflictsService } from './conflicts.service';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class ConflictsController {
  public static async list(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const projectId = (req.headers['x-project-id'] as string) || 'proj_alpha_1';
      const conflicts = await ConflictsService.listConflicts(projectId);
      res.status(200).json({
        success: true,
        data: conflicts,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getDiff(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const projectId = (req.headers['x-project-id'] as string) || 'proj_alpha_1';
      const conflictId = req.params.id;
      const diff = await ConflictsService.getDiff(conflictId, projectId);
      res.status(200).json({
        success: true,
        data: diff,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async resolve(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const projectId = (req.headers['x-project-id'] as string) || 'proj_alpha_1';
      const conflictId = req.params.id;
      const { strategy } = req.body;
      const result = await ConflictsService.resolveConflict(conflictId, strategy || 'KEEP_LOCAL', projectId);
      res.status(200).json({
        success: true,
        message: result.message,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
