import { Response, NextFunction } from 'express';
import { ApiKeysService } from './apikeys.service';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class ApiKeysController {
  public static async list(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const projectId = (req.headers['x-project-id'] as string) || 'proj_alpha_1';
      const keys = await ApiKeysService.listKeys(projectId);
      res.status(200).json({
        success: true,
        data: keys,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const projectId = (req.headers['x-project-id'] as string) || 'proj_alpha_1';
      const key = await ApiKeysService.createKey(projectId, req.body);
      res.status(201).json({
        success: true,
        message: 'API key generated successfully',
        data: key,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const projectId = (req.headers['x-project-id'] as string) || 'proj_alpha_1';
      const keyId = req.params.id;
      const result = await ApiKeysService.deleteKey(keyId, projectId);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}
