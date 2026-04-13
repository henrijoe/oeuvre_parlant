// scripts/seed-admin.ts
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

// Définir les rôles manuellement si l'import ne fonctionne pas
enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER'
}

async function main() {
  console.log('🌱 Début du seed...');

  try {
    // Créer un Super Admin
    const superAdmin = await prisma.user.upsert({
      where: { email: 'superadmin@artsparlants.com' },
      update: {},
      create: {
        uuid: `super-admin-${Date.now()}`,
        email: 'superadmin@artsparlants.com',
        password: await hash('admin123', 10),
        name: 'Super Administrateur',
        role: UserRole.SUPER_ADMIN,
      },
    });

    // Créer un Admin exemple
    const admin = await prisma.user.upsert({
      where: { email: 'admin@artsparlants.com' },
      update: {},
      create: {
        uuid: `admin-${Date.now()}`,
        email: 'admin@artsparlants.com',
        password: await hash('admin123', 10),
        name: 'Administrateur',
        role: UserRole.ADMIN,
      },
    });

    // Créer un utilisateur normal
    const user = await prisma.user.upsert({
      where: { email: 'user@example.com' },
      update: {},
      create: {
        uuid: `user-${Date.now()}`,
        email: 'user@example.com',
        password: await hash('user123', 10),
        name: 'Utilisateur Standard',
        role: UserRole.USER,
      },
    });

    console.log('✅ Seed terminé !');
    console.log('Super Admin:', superAdmin.email, '- Mot de passe: admin123');
    console.log('Admin:', admin.email, '- Mot de passe: admin123');
    console.log('User:', user.email, '- Mot de passe: user123');
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Erreur fatale:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });