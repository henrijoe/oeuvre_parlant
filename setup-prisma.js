// setup-prisma.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Configuration de Prisma...');

// Créer le dossier prisma s'il n'existe pas
if (!fs.existsSync('prisma')) {
  fs.mkdirSync('prisma');
  console.log('📁 Dossier prisma créé');
}

// Créer le schema.prisma
const schemaContent = `// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Product {
  id          Int      @id @default(autoincrement())
  uuid        String   @unique
  name        String
  price       Float
  oldPrice    Float?
  author      String?
  location    String?
  whatsapp    String?
  description String?
  category    String?
  imagePath   String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("products")
}
`;

fs.writeFileSync('prisma/schema.prisma', schemaContent);
console.log('📝 Fichier schema.prisma créé');

// Créer le dossier public/uploads s'il n'existe pas
if (!fs.existsSync('public/uploads')) {
  fs.mkdirSync('public/uploads', { recursive: true });
  console.log('📁 Dossier public/uploads créé');
}

console.log('✅ Configuration terminée. Exécutez maintenant:');
console.log('1. npx prisma generate');
console.log('2. npx prisma db push');
console.log('3. npx prisma studio');