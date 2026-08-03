export interface FileMetadata {
  id: string;
  name: string;
  path: string;
  isFolder: boolean;
  size: number;
  mimeType: string;
  checksum?: string;
  updatedAt: Date;
}

export interface QuotaInfo {
  totalBytes: number;
  usedBytes: number;
  remainingBytes: number;
}

export interface StorageProvider {
  readonly providerName: string;

  connect(authCredentials: Record<string, any>): Promise<boolean>;
  disconnect(userId: string): Promise<boolean>;
  isConnected(userId: string): Promise<boolean>;

  createFolder(userId: string, folderName: string, parentPath?: string): Promise<FileMetadata>;
  uploadFile(userId: string, path: string, buffer: Buffer, mimeType: string): Promise<FileMetadata>;
  downloadFile(userId: string, fileIdOrPath: string): Promise<Buffer>;
  deleteFile(userId: string, fileIdOrPath: string): Promise<boolean>;
  renameFile(userId: string, fileIdOrPath: string, newName: string): Promise<FileMetadata>;
  
  getQuotaInfo(userId: string): Promise<QuotaInfo>;
  getFileMetadata(userId: string, fileIdOrPath: string): Promise<FileMetadata>;
}
