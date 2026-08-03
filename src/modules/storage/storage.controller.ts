import { Response, NextFunction } from 'express';
import { StorageProviderRegistry } from '../../core/storage/storage-provider.registry';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import { FileUploadRequest } from '../../middleware/upload.middleware';
import { AppError } from '../../core/errors/app-error';

export class StorageController {
  public static async getStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const provider = StorageProviderRegistry.getProvider('google_drive');
      const userId = req.user?.id || 'usr_demo_1';
      const isConnected = await provider.isConnected(userId);

      res.status(200).json({
        success: true,
        data: {
          provider: provider.providerName,
          connected: isConnected,
          activePlugins: StorageProviderRegistry.listProviders(),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getQuota(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const provider = StorageProviderRegistry.getProvider('google_drive');
      const userId = req.user?.id || 'usr_demo_1';
      const quota = await provider.getQuotaInfo(userId);

      res.status(200).json({
        success: true,
        data: quota,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async uploadFile(req: FileUploadRequest & AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const provider = StorageProviderRegistry.getProvider('google_drive');
      const userId = req.user?.id || 'usr_demo_1';

      if (!req.fileBuffer || req.fileBuffer.length === 0) {
        throw AppError.badRequest('No file payload attached');
      }

      const fileName = req.fileName || `file_${Date.now()}.bin`;
      const mimeType = req.fileMimeType || 'application/octet-stream';
      const fileMetadata = await provider.uploadFile(userId, fileName, req.fileBuffer, mimeType);

      res.status(201).json({
        success: true,
        message: 'File uploaded successfully to Google Drive',
        data: fileMetadata,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async downloadFile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const provider = StorageProviderRegistry.getProvider('google_drive');
      const userId = req.user?.id || 'usr_demo_1';
      const fileId = req.params.id;

      const buffer = await provider.downloadFile(userId, fileId);
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${fileId}"`);
      res.send(buffer);
    } catch (error) {
      next(error);
    }
  }

  public static async renameFile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const provider = StorageProviderRegistry.getProvider('google_drive');
      const userId = req.user?.id || 'usr_demo_1';
      const fileId = req.params.id;
      const { newName } = req.body;

      if (!newName) {
        throw AppError.badRequest('newName property is required');
      }

      const updated = await provider.renameFile(userId, fileId, newName);
      res.status(200).json({
        success: true,
        message: 'File renamed successfully on Google Drive',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteFile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const provider = StorageProviderRegistry.getProvider('google_drive');
      const userId = req.user?.id || 'usr_demo_1';
      const fileId = req.params.id;

      await provider.deleteFile(userId, fileId);
      res.status(200).json({
        success: true,
        message: 'File deleted successfully from Google Drive',
      });
    } catch (error) {
      next(error);
    }
  }
}
