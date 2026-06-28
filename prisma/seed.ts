import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });
async function main() {
  // Create admin user
  const existing = await prisma.user.findUnique({
    where: { email: 'admin@biowood.com' },
  });

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

  // Seed default hero
  const hero = await prisma.hero.findFirst();
  if (!hero) {
    await prisma.hero.create({
      data: {
        title: 'SOLID\nWOOD\nPRODUCTS',
        subtitle: 'Handcrafted furniture and woodwork from premium hardwoods.',
        ctaText: 'View Our Work',
        ctaLink: '/gallery',
        backgroundImage: '/images/background.jpg',
      },
    });
    console.log('✅ Default hero seeded');
  }

  // Seed wood types with images
  const woodCount = await prisma.woodType.count();
  if (woodCount === 0) {
    const oak = await prisma.woodType.create({
      data: {
        name: 'Oak',
        pros: ['Durability', 'Beautiful texture', 'Water resistance'],
        cons: ['Expensive'],
        order: 0,
        images: {
          create: [{ url: '/images/oak.jpg', order: 0 }],
        },
      },
    });

    const buk = await prisma.woodType.create({
      data: {
        name: 'Buk',
        pros: ['Durability'],
        cons: ['Hard to handle'],
        order: 1,
        images: {
          create: [{ url: '/images/buk.jpg', order: 0 }],
        },
      },
    });

    const ash = await prisma.woodType.create({
      data: {
        name: 'Ash',
        pros: ['Durability'],
        cons: ['Hard to handle'],
        order: 2,
        images: {
          create: [{ url: '/images/ash.jpg', order: 0 }],
        },
      },
    });

    console.log('✅ Wood types seeded with images');
  }

  // Seed services
  const serviceCount = await prisma.service.count();
  if (serviceCount === 0) {
    await prisma.service.createMany({
      data: [
        {
          title: 'Custom Furniture',
          description: 'Bespoke tables, chairs, shelving, and cabinetry.',
          icon: 'sofa',
          order: 0,
        },
        {
          title: 'Interior Woodwork',
          description: 'Wall cladding, ceiling beams, staircases.',
          icon: 'home',
          order: 1,
        },
        {
          title: 'Restoration',
          description: 'Expert restoration of antique wooden pieces.',
          icon: 'wrench',
          order: 2,
        },
      ],
    });
    console.log('✅ Services seeded');
  }

  // Seed about
  const about = await prisma.aboutSection.findFirst();
  if (!about) {
    await prisma.aboutSection.create({
      data: {
        brandName: 'BIO CWT',
        description:
          'We manufacture solid wood products according to individual drawings.',
        image1: '/images/about1.png',
        image2: '/images/about2.png',
        image3: '/images/about3.png',
      },
    });
    console.log('✅ About section seeded');
  }

  // Seed advantages
  const advantages = await prisma.advantagesSection.findFirst();
  if (!advantages) {
    await prisma.advantagesSection.create({
      data: {
        cta: 'Receive a consultation',
        image: '/images/advantages.png',
        items: {
          create: [
            { description: 'In-house carpentry production', order: 0 },
            {
              description:
                'We only treat wood with environmentally friendly and safe products',
              order: 1,
            },
            {
              description: 'Prices from the manufacturer, no extra charges',
              order: 2,
            },
          ],
        },
      },
    });
    console.log('✅ Advantages section seeded');
  }

  console.log('🌱 Seed complete');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
