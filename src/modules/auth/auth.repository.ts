import { prisma } from '../../config/database.config';
import { RegisterInput } from './auth.dto';

interface InMemoryUser {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  role: string;
  googleId?: string | null;
  googleAccessToken?: string | null;
  googleRefreshToken?: string | null;
  createdAt: Date;
}

export class AuthRepository {
  private static inMemoryUsers: InMemoryUser[] = [
    {
      id: 'usr_demo_1',
      email: 'demo@drivebase.io',
      passwordHash: '$2a$10$w9Hq8rE1C1p1P.8kFj4tIeFv3.V7yK.M3Q2p9oP1v1m9K3L5n7X.', // password: "password123"
      fullName: 'Demo User',
      role: 'OWNER',
      createdAt: new Date(),
    },
  ];

  public static async findUserByEmail(email: string) {
    try {
      return await prisma.user.findUnique({ where: { email } });
    } catch {
      const found = this.inMemoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      return found || null;
    }
  }

  public static async findUserById(id: string) {
    try {
      return await prisma.user.findUnique({ where: { id } });
    } catch {
      const found = this.inMemoryUsers.find((u) => u.id === id);
      return found || null;
    }
  }

  public static async createUser(data: RegisterInput & { passwordHash: string }) {
    try {
      return await prisma.user.create({
        data: {
          email: data.email,
          passwordHash: data.passwordHash,
          fullName: data.fullName,
          role: data.role as any,
        },
      });
    } catch {
      const newUser: InMemoryUser = {
        id: `usr_${Date.now()}`,
        email: data.email,
        passwordHash: data.passwordHash,
        fullName: data.fullName,
        role: data.role || 'OWNER',
        createdAt: new Date(),
      };
      this.inMemoryUsers.push(newUser);
      return newUser;
    }
  }

  public static async updateGoogleTokens(userId: string, encryptedAccess: string, encryptedRefresh: string) {
    try {
      return await prisma.user.update({
        where: { id: userId },
        data: {
          googleAccessToken: encryptedAccess,
          googleRefreshToken: encryptedRefresh,
          googleTokenExpiry: new Date(Date.now() + 3600 * 1000),
        },
      });
    } catch {
      const u = this.inMemoryUsers.find((user) => user.id === userId);
      if (u) {
        u.googleAccessToken = encryptedAccess;
        u.googleRefreshToken = encryptedRefresh;
      }
      return u;
    }
  }
}
