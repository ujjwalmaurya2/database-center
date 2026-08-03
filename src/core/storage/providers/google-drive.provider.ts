import { StorageProvider, FileMetadata, QuotaInfo } from '../storage-provider.interface';

export class GoogleDriveStorageProvider implements StorageProvider {
  public readonly providerName = 'google_drive';

  public async connect(credentials: Record<string, any>): Promise<boolean> {
    console.log('[GoogleDriveProvider] Connect invoked for Google Drive account.');
    return true;
  }

  public async disconnect(userId: string): Promise<boolean> {
    console.log(`[GoogleDriveProvider] Disconnecting Google Drive for user: ${userId}`);
    return true;
  }

  public async isConnected(userId: string): Promise<boolean> {
    return true;
  }

  public async createFolder(userId: string, folderName: string, parentPath?: string): Promise<FileMetadata> {
    return {
      id: `gdrive_folder_${Date.now()}`,
      name: folderName,
      path: parentPath ? `${parentPath}/${folderName}` : `/${folderName}`,
      isFolder: true,
      size: 0,
      mimeType: 'application/vnd.google-apps.folder',
      updatedAt: new Date(),
    };
  }

  public async uploadFile(userId: string, path: string, buffer: Buffer, mimeType: string): Promise<FileMetadata> {
    const filename = path.split('/').pop() || 'file';
    return {
      id: `gdrive_file_${Date.now()}`,
      name: filename,
      path: path.startsWith('/') ? path : `/${path}`,
      isFolder: false,
      size: buffer.length,
      mimeType,
      checksum: 'mock_md5_hash',
      updatedAt: new Date(),
    };
  }

  public async downloadFile(userId: string, fileIdOrPath: string): Promise<Buffer> {
    return Buffer.from('Mock file content from Google Drive');
  }

  public async deleteFile(userId: string, fileIdOrPath: string): Promise<boolean> {
    return true;
  }

  public async renameFile(userId: string, fileIdOrPath: string, newName: string): Promise<FileMetadata> {
    return {
      id: fileIdOrPath,
      name: newName,
      path: `/${newName}`,
      isFolder: false,
      size: 1024,
      mimeType: 'application/octet-stream',
      updatedAt: new Date(),
    };
  }

  public async getQuotaInfo(userId: string): Promise<QuotaInfo> {
    return {
      totalBytes: 15 * 1024 * 1024 * 1024, // 15 GB
      usedBytes: 6.2 * 1024 * 1024 * 1024, // 6.2 GB
      remainingBytes: 8.8 * 1024 * 1024 * 1024,
    };
  }

  public async getFileMetadata(userId: string, fileIdOrPath: string): Promise<FileMetadata> {
    return {
      id: fileIdOrPath,
      name: 'users.json',
      path: '/tables/users.json',
      isFolder: false,
      size: 2048,
      mimeType: 'application/json',
      checksum: 'e10adc3949ba59abbe56e057f20f883e',
      updatedAt: new Date(),
    };
  }
}
