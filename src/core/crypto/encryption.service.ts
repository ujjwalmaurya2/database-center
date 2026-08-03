import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { envConfig } from '../../config/env.config';

export class EncryptionService {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly IV_LENGTH = 16;
  private static readonly SALT_ROUNDS = 10;

  // AES-256-GCM Encryption for sensitive tokens (e.g. Google OAuth tokens)
  public static encryptToken(text: string): string {
    if (!text) return text;
    const iv = crypto.randomBytes(this.IV_LENGTH);
    const key = crypto.scryptSync(envConfig.encryptionKey, 'salt', 32);
    const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  }

  // AES-256-GCM Decryption for sensitive tokens
  public static decryptToken(encryptedData: string): string {
    if (!encryptedData || !encryptedData.includes(':')) return encryptedData;
    const parts = encryptedData.split(':');
    if (parts.length !== 3) return encryptedData;

    const [ivHex, authTagHex, encryptedText] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const key = crypto.scryptSync(envConfig.encryptionKey, 'salt', 32);
    
    const decipher = crypto.createDecipheriv(this.ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  // Password Hashing using bcrypt
  public static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  public static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // JWT Token Management
  public static generateAccessToken(payload: object): string {
    return jwt.sign(payload, envConfig.jwtSecret, { expiresIn: '15m' });
  }

  public static generateRefreshToken(payload: object): string {
    return jwt.sign(payload, envConfig.jwtRefreshSecret, { expiresIn: '7d' });
  }

  public static verifyAccessToken(token: string): any {
    return jwt.verify(token, envConfig.jwtSecret);
  }

  public static verifyRefreshToken(token: string): any {
    return jwt.verify(token, envConfig.jwtRefreshSecret);
  }
}
