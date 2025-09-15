/* eslint-disable @typescript-eslint/no-misused-promises */
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Electronics' },
    { name: 'Kitchen' },
    { name: 'Clothing' },
    { name: 'Furniture' },
    { name: 'Home Appliances' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log('✅ Categories seeded');

  // Seed admin users
  const adminEmails = [
    'moraraedgar233@gmail.com',
    'iminvestments48@gmial.com'
  ];

  const defaultPassword = 'admin123';
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  for (const email of adminEmails) {
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
  }

  console.log('✅ Admin users seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
