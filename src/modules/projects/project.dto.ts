import { z } from 'zod';

export const CreateProjectDTO = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').optional(),
  description: z.string().optional(),
  region: z.string().optional().default('us-east-1'),
});

export const UpdateProjectDTO = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters').optional(),
  description: z.string().optional(),
  status: z.enum(['active', 'archived']).optional(),
});

export const SetEnvVarDTO = z.object({
  key: z.string().min(1, 'Key is required').regex(/^[A-Z0-9_]+$/, 'Key must contain only uppercase letters, numbers, and underscores'),
  value: z.string().min(1, 'Value is required'),
  isSecret: z.boolean().optional().default(false),
});

export const BulkSetEnvVarDTO = z.object({
  envVars: z.array(SetEnvVarDTO),
});

export type CreateProjectInput = z.infer<typeof CreateProjectDTO>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectDTO>;
export type SetEnvVarInput = z.infer<typeof SetEnvVarDTO>;
