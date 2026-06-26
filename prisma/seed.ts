import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create admin user
  const existing = await prisma.user.findUnique({ where: { email: 'admin@biowood.com' } });

  if (!existing) {
    const hashed = await bcrypt.hash('Admin123!', 10);
    await prisma.user.create({
      data: {
        email: 'admin@biowood.com',
        password: hashed,
        name: 'Admin',
      },
    });
    console.log('✅ Admin user created: admin@biowood.com / Admin123!');
  } else {
    console.log('ℹ️  Admin user already exists');
  }

 
  console.log('🌱 Seed complete');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());