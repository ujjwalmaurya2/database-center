import { Request, Response, NextFunction } from 'express';

export interface FileUploadRequest extends Request {
  fileBuffer?: Buffer;
  fileName?: string;
  fileMimeType?: string;
}

export function parseFileUpload(req: FileUploadRequest, res: Response, next: NextFunction): void {
  const contentType = req.headers['content-type'] || '';
  const chunks: Buffer[] = [];

  req.on('data', (chunk) => chunks.push(chunk));
  req.on('end', () => {
    const rawBuffer = Buffer.concat(chunks);
    
    if (contentType.includes('multipart/form-data')) {
      const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
      const boundary = boundaryMatch ? (boundaryMatch[1] || boundaryMatch[2]) : null;
      
      if (boundary) {
        const boundaryBuffer = Buffer.from(`--${boundary}`);
        const parts = splitBuffer(rawBuffer, boundaryBuffer);

        for (const part of parts) {
          const headerEnd = part.indexOf('\r\n\r\n');
          if (headerEnd !== -1) {
            const headerText = part.slice(0, headerEnd).toString('utf8');
            if (headerText.includes('filename=')) {
              const filenameMatch = headerText.match(/filename="([^"]+)"/i);
              const mimeMatch = headerText.match(/Content-Type:\s*([^\r\n]+)/i);
              
              req.fileName = filenameMatch ? filenameMatch[1] : (req.headers['x-file-name'] as string) || `upload_${Date.now()}.bin`;
              req.fileMimeType = mimeMatch ? mimeMatch[1].trim() : (req.headers['x-file-type'] as string) || 'application/octet-stream';

              // Extract binary content after \r\n\r\n (strip trailing \r\n)
              let bodyPart = part.slice(headerEnd + 4);
              if (bodyPart.slice(-2).toString() === '\r\n') {
                bodyPart = bodyPart.slice(0, -2);
              }
              req.fileBuffer = bodyPart;
              return next();
            }
          }
        }
      }
    }

    // Fallback for direct binary buffer uploads
    const filenameHeader = req.headers['x-file-name'] as string;
    req.fileName = filenameHeader ? decodeURIComponent(filenameHeader) : `upload_${Date.now()}.bin`;
    req.fileMimeType = (req.headers['x-file-type'] as string) || 'application/octet-stream';
    req.fileBuffer = rawBuffer;
    next();
  });
}

function splitBuffer(buf: Buffer, delimiter: Buffer): Buffer[] {
  const parts: Buffer[] = [];
  let start = 0;
  let index = buf.indexOf(delimiter, start);

  while (index !== -1) {
    if (index > start) {
      parts.push(buf.slice(start, index));
    }
    start = index + delimiter.length;
    index = buf.indexOf(delimiter, start);
  }

  if (start < buf.length) {
    parts.push(buf.slice(start));
  }
  return parts;
}
