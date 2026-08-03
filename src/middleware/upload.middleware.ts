import { Request, Response, NextFunction } from 'express';

export interface FileUploadRequest extends Request {
  fileBuffer?: Buffer;
  fileName?: string;
  fileMimeType?: string;
}

export function parseFileUpload(req: FileUploadRequest, res: Response, next: NextFunction): void {
  const contentType = req.headers['content-type'] || '';
  
  if (contentType.includes('multipart/form-data')) {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      const buffer = Buffer.concat(chunks);
      // Basic boundary parsing or header fallback
      const filenameHeader = req.headers['x-file-name'] as string;
      req.fileName = filenameHeader ? decodeURIComponent(filenameHeader) : `upload_${Date.now()}.bin`;
      req.fileMimeType = (req.headers['x-file-type'] as string) || 'application/octet-stream';
      req.fileBuffer = buffer;
      next();
    });
  } else {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      const buffer = Buffer.concat(chunks);
      const filenameHeader = req.headers['x-file-name'] as string;
      req.fileName = filenameHeader ? decodeURIComponent(filenameHeader) : `upload_${Date.now()}.bin`;
      req.fileMimeType = (req.headers['x-file-type'] as string) || 'application/octet-stream';
      req.fileBuffer = buffer;
      next();
    });
  }
}
