import { ProjectRepository } from './project.repository';
import { CreateProjectInput, UpdateProjectInput, SetEnvVarInput } from './project.dto';
import { EncryptionService } from '../../core/crypto/encryption.service';
import { AppError } from '../../core/errors/app-error';

export class ProjectService {
  public static async createProject(ownerId: string, input: CreateProjectInput) {
    const slug = input.slug
      ? input.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-')
      : input.name.toLowerCase().replace(/[^a-z0-9-]/g, '-') + '-' + Date.now().toString(36);

    const project = await ProjectRepository.createProject(ownerId, {
      ...input,
      slug,
    });

    return project;
  }

  public static async getUserProjects(ownerId: string) {
    return await ProjectRepository.findProjectsByOwner(ownerId);
  }

  public static async getProjectDetails(projectId: string, userId: string) {
    const project = await ProjectRepository.findProjectById(projectId);
    if (!project) {
      throw AppError.notFound('Project not found');
    }

    if (project.ownerId !== userId) {
      throw AppError.forbidden('You do not have access to this project');
    }

    return project;
  }

  public static async updateProject(projectId: string, userId: string, input: UpdateProjectInput) {
    const project = await ProjectRepository.findProjectById(projectId);
    if (!project) {
      throw AppError.notFound('Project not found');
    }

    if (project.ownerId !== userId) {
      throw AppError.forbidden('Only the project owner can modify project settings');
    }

    return await ProjectRepository.updateProject(projectId, input);
  }

  public static async deleteProject(projectId: string, userId: string) {
    const project = await ProjectRepository.findProjectById(projectId);
    if (!project) {
      throw AppError.notFound('Project not found');
    }

    if (project.ownerId !== userId) {
      throw AppError.forbidden('Only the project owner can delete or archive a project');
    }

    return await ProjectRepository.deleteProject(projectId);
  }

  public static async restoreProject(projectId: string, userId: string) {
    const project = await ProjectRepository.findProjectById(projectId);
    if (!project) {
      throw AppError.notFound('Project not found');
    }

    if (project.ownerId !== userId) {
      throw AppError.forbidden('Only the project owner can restore a project');
    }

    return await ProjectRepository.updateProject(projectId, { status: 'active' });
  }

  public static async setEnvironmentVariable(projectId: string, userId: string, input: SetEnvVarInput) {
    await this.getProjectDetails(projectId, userId);

    const encryptedValue = input.isSecret
      ? EncryptionService.encryptToken(input.value)
      : input.value;

    const record = await ProjectRepository.setEnvVar(projectId, input.key, encryptedValue, input.isSecret);

    return {
      id: record.id,
      projectId: record.projectId,
      key: record.key,
      value: record.isSecret ? '••••••••' : input.value,
      isSecret: record.isSecret,
      updatedAt: record.updatedAt,
    };
  }

  public static async getEnvironmentVariables(projectId: string, userId: string) {
    await this.getProjectDetails(projectId, userId);

    const records = await ProjectRepository.getEnvVars(projectId);

    return records.map((rec) => ({
      id: rec.id,
      projectId: rec.projectId,
      key: rec.key,
      value: rec.isSecret ? '••••••••' : rec.value,
      isSecret: rec.isSecret,
      updatedAt: rec.updatedAt,
    }));
  }

  public static async deleteEnvironmentVariable(projectId: string, key: string, userId: string) {
    await this.getProjectDetails(projectId, userId);

    const deleted = await ProjectRepository.deleteEnvVar(projectId, key);
    if (!deleted) {
      throw AppError.notFound(`Environment variable '${key}' not found`);
    }

    return { success: true, message: `Environment variable '${key}' removed` };
  }
}
