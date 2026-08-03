import { Response, NextFunction } from 'express';
import { FunctionsService } from './functions.service';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class FunctionsController {
  public static async list(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const projectId = (req.headers['x-project-id'] as string) || 'proj_alpha_1';
      const functions = await FunctionsService.listFunctions(projectId);
      res.status(200).json({
        success: true,
        data: functions,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const projectId = (req.headers['x-project-id'] as string) || 'proj_alpha_1';
      const fn = await FunctionsService.createFunction(projectId, req.body);
      res.status(201).json({
        success: true,
        message: 'Edge function deployed successfully',
        data: fn,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const projectId = (req.headers['x-project-id'] as string) || 'proj_alpha_1';
      const fnId = req.params.id;
      const fn = await FunctionsService.updateFunction(fnId, projectId, req.body);
      res.status(200).json({
        success: true,
        message: 'Edge function updated successfully',
        data: fn,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const projectId = (req.headers['x-project-id'] as string) || 'proj_alpha_1';
      const fnId = req.params.id;
      const result = await FunctionsService.deleteFunction(fnId, projectId);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async invoke(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const projectId = (req.headers['x-project-id'] as string) || 'proj_alpha_1';
      const fnId = req.params.id;
      const result = await FunctionsService.invokeFunction(fnId, projectId, req.body);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
