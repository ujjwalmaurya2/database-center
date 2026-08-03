import { Response, NextFunction } from 'express';
import { RecoveryService } from './recovery.service';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class RecoveryController {
  public static async list(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const projectId = (req.headers['x-project-id'] as string) || 'proj_alpha_1';
      const snapshots = await RecoveryService.listSnapshots(projectId);
      res.status(200).json({
        success: true,
        data: snapshots,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const projectId = (req.headers['x-project-id'] as string) || 'proj_alpha_1';
      const { name } = req.body;
      const snapshot = await RecoveryService.createSnapshot(projectId, name);
      res.status(201).json({
        success: true,
        message: 'Recovery snapshot created successfully',
        data: snapshot,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async rollback(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const projectId = (req.headers['x-project-id'] as string) || 'proj_alpha_1';
      const snapshotId = req.params.id;
      const result = await RecoveryService.rollbackSnapshot(snapshotId, projectId);
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
