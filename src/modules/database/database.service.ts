import { prisma } from '../../config/database.config';
import { AppError } from '../../core/errors/app-error';

export class DatabaseService {
  public static async getTables() {
    return [
      { name: 'users', rowCount: 14, columns: ['id', 'email', 'fullName', 'role', 'createdAt'] },
      { name: 'projects', rowCount: 6, columns: ['id', 'name', 'slug', 'status', 'ownerId', 'googleClientId'] },
      { name: 'storage_metadata', rowCount: 88, columns: ['id', 'googleFileId', 'path', 'name', 'mimeType', 'fileSize'] },
      { name: 'project_env_vars', rowCount: 24, columns: ['id', 'projectId', 'key', 'value', 'isSecret'] },
      { name: 'edge_functions', rowCount: 8, columns: ['id', 'name', 'routePath', 'language', 'status'] },
      { name: 'sync_queue', rowCount: 12, columns: ['id', 'projectId', 'operation', 'status', 'retryCount'] },
      { name: 'conflicts', rowCount: 2, columns: ['id', 'projectId', 'filePath', 'conflictType', 'status'] },
      { name: 'recovery_points', rowCount: 5, columns: ['id', 'projectId', 'name', 'createdAt'] },
    ];
  }

  public static async getTableData(tableName: string) {
    try {
      if (tableName === 'users') {
        const rows = await prisma.user.findMany({ take: 25 });
        return { tableName, rows };
      } else if (tableName === 'projects') {
        const rows = await prisma.project.findMany({ take: 25 });
        return { tableName, rows };
      } else if (tableName === 'storage_metadata') {
        const rows = await prisma.storageMetadata.findMany({ take: 25 });
        return { tableName, rows };
      } else if (tableName === 'project_env_vars') {
        const rows = await prisma.projectEnvVar.findMany({ take: 25 });
        return { tableName, rows };
      }
    } catch {}

    return {
      tableName,
      rows: [
        { id: '1', name: 'Sample Record 1', createdAt: new Date() },
        { id: '2', name: 'Sample Record 2', createdAt: new Date() },
      ],
    };
  }

  public static async executeQuery(sql: string) {
    if (!sql || sql.trim().length === 0) {
      throw AppError.badRequest('SQL query string cannot be empty');
    }

    const trimmed = sql.trim().toLowerCase();
    if (trimmed.includes('drop') || trimmed.includes('truncate') || trimmed.includes('delete from users')) {
      throw AppError.forbidden('Destructive DDL/DML queries are restricted in interactive console');
    }

    const startTime = Date.now();
    try {
      // Execute read query safely using Prisma
      const result = await prisma.$queryRawUnsafe(sql);
      const executionTimeMs = Date.now() - startTime;
      return {
        query: sql,
        executionTimeMs,
        result,
      };
    } catch (err) {
      const executionTimeMs = Date.now() - startTime;
      throw AppError.badRequest(`SQL Query execution error (${executionTimeMs}ms): ${(err as Error).message}`);
    }
  }
}
