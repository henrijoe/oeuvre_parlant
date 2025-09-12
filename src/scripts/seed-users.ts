// scripts/seed-users.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'; // ← Utilisez bcryptjs

const prisma = new PrismaClient();

async function main() {
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const hashedViewerPassword = await bcrypt.hash('viewer123', 10);

  // Créer l'admin → Utilisez prisma.user (minuscule)
  await prisma.user.upsert({
    where: { phone: '0100000000' },
    update: {},
    create: {
      uuid: Date.now().toString(),
      phone: '0100000000',
      password: hashedAdminPassword,
      name: 'Administrateur',
      role: 'admin'
    }
  });

  // Créer le viewer → Utilisez prisma.user (minuscule)
  await prisma.user.upsert({
    where: { phone: '0200000000' },
    update: {},
    create: {
      uuid: (Date.now() + 1).toString(),
      phone: '0200000000',
      password: hashedViewerPassword,
      name: 'Visiteur',
      role: 'viewer'
    }
  });

  console.log('Users seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });