import { Response, NextFunction } from 'express';
import { ProjectService } from './project.service';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class ProjectController {
  public static async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const project = await ProjectService.createProject(userId, req.body);
      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async list(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const projects = await ProjectService.getUserProjects(userId);
      res.status(200).json({
        success: true,
        data: projects,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const projectId = req.params.id;
      const project = await ProjectService.getProjectDetails(projectId, userId);
      res.status(200).json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const projectId = req.params.id;
      const project = await ProjectService.updateProject(projectId, userId, req.body);
      res.status(200).json({
        success: true,
        message: 'Project updated successfully',
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const projectId = req.params.id;
      const result = await ProjectService.deleteProject(projectId, userId);
      res.status(200).json({
        success: true,
        message: 'Project archived successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async restore(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const projectId = req.params.id;
      const result = await ProjectService.restoreProject(projectId, userId);
      res.status(200).json({
        success: true,
        message: 'Project restored successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // BYO Google Credentials Controller Actions
  public static async setGoogleCredentials(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const projectId = req.params.id;
      const credentials = await ProjectService.saveGoogleCredentials(projectId, userId, req.body);
      res.status(200).json({
        success: true,
        message: 'Google Drive API credentials saved for project',
        data: credentials,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getGoogleCredentials(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const projectId = req.params.id;
      const credentials = await ProjectService.getGoogleCredentials(projectId, userId);
      res.status(200).json({
        success: true,
        data: credentials,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteGoogleCredentials(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const projectId = req.params.id;
      const result = await ProjectService.deleteGoogleCredentials(projectId, userId);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async setEnv(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const projectId = req.params.id;
      const record = await ProjectService.setEnvironmentVariable(projectId, userId, req.body);
      res.status(200).json({
        success: true,
        message: 'Environment variable saved',
        data: record,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getEnv(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const projectId = req.params.id;
      const envVars = await ProjectService.getEnvironmentVariables(projectId, userId);
      res.status(200).json({
        success: true,
        data: envVars,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteEnv(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id, key } = req.params;
      const result = await ProjectService.deleteEnvironmentVariable(id, key, userId);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}
