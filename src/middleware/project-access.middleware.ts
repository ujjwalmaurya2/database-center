import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { ProjectService } from '../modules/projects/project.service';
import { AppError } from '../core/errors/app-error';

export interface ProjectScopedRequest extends AuthenticatedRequest {
  projectId?: string;
}

export async function validateProjectAccess(req: ProjectScopedRequest, res: Response, next: NextFunction): Promise<void> {
  const projectId = req.headers['x-project-id'] as string || req.params.id || req.params.projectId;

  if (!projectId) {
    return next();
  }

  if (!req.user) {
    return next(AppError.unauthorized('Authentication required to access project resources'));
  }

  try {
    const project = await ProjectService.getProjectDetails(projectId, req.user.id);
    req.projectId = project.id;
    next();
  } catch (error) {
    next(error);
  }
}
