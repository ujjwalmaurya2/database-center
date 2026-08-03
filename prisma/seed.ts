import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('[Prisma Seed] Starting database seeding...');

  const passwordHash = await bcrypt.hash('password123', 10);

  const owner = await prisma.user.upsert({
    where: { email: 'owner@drivebase.io' },
    update: {},
    create: {
      email: 'owner@drivebase.io',
      passwordHash,
      fullName: 'Default Owner',
      role: 'OWNER',
      isEmailVerified: true,
    },
  });

  console.log('[Prisma Seed] Seeded default owner user:', owner.email);

  const project = await prisma.project.upsert({
    where: { slug: 'project-alpha' },
    update: {},
    create: {
      name: 'Project Alpha',
      slug: 'project-alpha',
      description: 'Default primary production cluster project',
      status: 'active',
      ownerId: owner.id,
    },
  });

  console.log('[Prisma Seed] Seeded default project:', project.name);
}

main()
  .catch((e) => {
    console.error('[Prisma Seed Error]', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
