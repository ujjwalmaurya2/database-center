import { prisma } from '../../config/database.config';
import { CreateProjectInput, UpdateProjectInput } from './project.dto';

interface InMemoryProject {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: string;
  ownerId: string;
  googleClientId?: string | null;
  googleClientSecret?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface InMemoryEnvVar {
  id: string;
  projectId: string;
  key: string;
  value: string;
  isSecret: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class ProjectRepository {
  private static inMemoryProjects: InMemoryProject[] = [
    {
      id: 'proj_alpha_1',
      name: 'Project Alpha',
      slug: 'project-alpha',
      description: 'Default primary production cluster project',
      status: 'active',
      ownerId: 'usr_demo_1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  private static inMemoryEnvVars: InMemoryEnvVar[] = [];

  public static async createProject(ownerId: string, data: CreateProjectInput & { slug: string }) {
    try {
      return await prisma.project.create({
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description || null,
          ownerId,
        },
      });
    } catch {
      const proj: InMemoryProject = {
        id: `proj_${Date.now()}`,
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        status: 'active',
        ownerId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.inMemoryProjects.push(proj);
      return proj;
    }
  }

  public static async findProjectsByOwner(ownerId: string) {
    try {
      return await prisma.project.findMany({
        where: { ownerId },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      return this.inMemoryProjects.filter((p) => p.ownerId === ownerId);
    }
  }

  public static async findProjectById(id: string) {
    try {
      return await prisma.project.findUnique({
        where: { id },
        include: { envVars: true },
      });
    } catch {
      const proj = this.inMemoryProjects.find((p) => p.id === id || p.slug === id);
      if (!proj) return null;
      const envVars = this.inMemoryEnvVars.filter((e) => e.projectId === proj.id);
      return { ...proj, envVars };
    }
  }

  public static async updateProject(id: string, data: UpdateProjectInput) {
    try {
      return await prisma.project.update({
        where: { id },
        data: {
          ...(data.name ? { name: data.name } : {}),
          ...(data.description !== undefined ? { description: data.description } : {}),
          ...(data.status ? { status: data.status } : {}),
        },
      });
    } catch {
      const proj = this.inMemoryProjects.find((p) => p.id === id);
      if (!proj) return null;
      if (data.name) proj.name = data.name;
      if (data.description !== undefined) proj.description = data.description;
      if (data.status) proj.status = data.status;
      proj.updatedAt = new Date();
      return proj;
    }
  }

  public static async deleteProject(id: string) {
    try {
      return await prisma.project.update({
        where: { id },
        data: { status: 'archived' },
      });
    } catch {
      const proj = this.inMemoryProjects.find((p) => p.id === id);
      if (proj) proj.status = 'archived';
      return proj;
    }
  }

  public static async setGoogleCredentials(id: string, clientId: string, encryptedSecret: string) {
    try {
      return await prisma.project.update({
        where: { id },
        data: {
          googleClientId: clientId,
          googleClientSecret: encryptedSecret,
        },
      });
    } catch {
      const proj = this.inMemoryProjects.find((p) => p.id === id);
      if (proj) {
        proj.googleClientId = clientId;
        proj.googleClientSecret = encryptedSecret;
      }
      return proj;
    }
  }

  public static async deleteGoogleCredentials(id: string) {
    try {
      return await prisma.project.update({
        where: { id },
        data: {
          googleClientId: null,
          googleClientSecret: null,
        },
      });
    } catch {
      const proj = this.inMemoryProjects.find((p) => p.id === id);
      if (proj) {
        proj.googleClientId = null;
        proj.googleClientSecret = null;
      }
      return proj;
    }
  }

  public static async setEnvVar(projectId: string, key: string, encryptedValue: string, isSecret: boolean) {
    try {
      return await prisma.projectEnvVar.upsert({
        where: {
          projectId_key: { projectId, key },
        },
        update: {
          value: encryptedValue,
          isSecret,
        },
        create: {
          projectId,
          key,
          value: encryptedValue,
          isSecret,
        },
      });
    } catch {
      let existing = this.inMemoryEnvVars.find((e) => e.projectId === projectId && e.key === key);
      if (existing) {
        existing.value = encryptedValue;
        existing.isSecret = isSecret;
        existing.updatedAt = new Date();
      } else {
        existing = {
          id: `env_${Date.now()}`,
          projectId,
          key,
          value: encryptedValue,
          isSecret,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        this.inMemoryEnvVars.push(existing);
      }
      return existing;
    }
  }

  public static async getEnvVars(projectId: string) {
    try {
      return await prisma.projectEnvVar.findMany({
        where: { projectId },
        orderBy: { key: 'asc' },
      });
    } catch {
      return this.inMemoryEnvVars.filter((e) => e.projectId === projectId);
    }
  }

  public static async deleteEnvVar(projectId: string, key: string) {
    try {
      return await prisma.projectEnvVar.delete({
        where: {
          projectId_key: { projectId, key },
        },
      });
    } catch {
      const index = this.inMemoryEnvVars.findIndex((e) => e.projectId === projectId && e.key === key);
      if (index !== -1) {
        return this.inMemoryEnvVars.splice(index, 1)[0];
      }
      return null;
    }
  }
}
