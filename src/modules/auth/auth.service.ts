import { AuthRepository } from './auth.repository';
import { RegisterInput, LoginInput } from './auth.dto';
import { EncryptionService } from '../../core/crypto/encryption.service';
import { AppError } from '../../core/errors/app-error';
import { CacheService } from '../../core/cache/redis.cache.service';
import { totalAuthRequests } from '../../core/metrics/prometheus.service';

export class AuthService {
  public static async register(input: RegisterInput) {
    const existing = await AuthRepository.findUserByEmail(input.email);
    if (existing) {
      totalAuthRequests.inc({ status: 'register_conflict' });
      throw AppError.conflict('User with this email already exists');
    }

    const passwordHash = await EncryptionService.hashPassword(input.password);
    const user = await AuthRepository.createUser({
      ...input,
      passwordHash,
    });

    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = EncryptionService.generateAccessToken(payload);
    const refreshToken = EncryptionService.generateRefreshToken(payload);

    await CacheService.setObject(`session:${user.id}`, payload, 86400);
    totalAuthRequests.inc({ status: 'register_success' });

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        createdAt: user.createdAt,
      },
      accessToken,
      refreshToken,
    };
  }

  public static async login(input: LoginInput) {
    const user = await AuthRepository.findUserByEmail(input.email);
    if (!user) {
      totalAuthRequests.inc({ status: 'login_invalid_email' });
      throw AppError.unauthorized('Invalid email or password');
    }

    const isPasswordValid = await EncryptionService.verifyPassword(input.password, user.passwordHash);
    if (!isPasswordValid) {
      totalAuthRequests.inc({ status: 'login_invalid_password' });
      throw AppError.unauthorized('Invalid email or password');
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = EncryptionService.generateAccessToken(payload);
    const refreshToken = EncryptionService.generateRefreshToken(payload);

    await CacheService.setObject(`session:${user.id}`, payload, 86400);
    totalAuthRequests.inc({ status: 'login_success' });

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        createdAt: user.createdAt,
      },
      accessToken,
      refreshToken,
    };
  }

  public static async refreshToken(refreshTokenString: string) {
    try {
      const decoded = EncryptionService.verifyRefreshToken(refreshTokenString);
      const user = await AuthRepository.findUserById(decoded.id);
      if (!user) {
        throw AppError.unauthorized('User not found');
      }

      const payload = { id: user.id, email: user.email, role: user.role };
      const newAccessToken = EncryptionService.generateAccessToken(payload);
      const newRefreshToken = EncryptionService.generateRefreshToken(payload);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch {
      throw AppError.unauthorized('Invalid or expired refresh token');
    }
  }

  public static async getUserProfile(userId: string) {
    const cached = await CacheService.getObject<any>(`session:${userId}`);
    if (cached) return cached;

    const user = await AuthRepository.findUserById(userId);
    if (!user) {
      throw AppError.notFound('User profile not found');
    }

    const profile = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      createdAt: user.createdAt,
    };

    await CacheService.setObject(`session:${userId}`, profile, 86400);
    return profile;
  }
}
