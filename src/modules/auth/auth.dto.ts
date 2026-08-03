import { z } from 'zod';

export const RegisterDTO = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  fullName: z.string().min(2, 'Full name is required'),
  role: z.enum(['OWNER', 'ADMIN', 'EDITOR', 'VIEWER']).optional().default('OWNER'),
});

export const LoginDTO = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(1, 'Password is required'),
});

export const RefreshTokenDTO = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export type RegisterInput = z.infer<typeof RegisterDTO>;
export type LoginInput = z.infer<typeof LoginDTO>;
export type RefreshTokenInput = z.infer<typeof RefreshTokenDTO>;
