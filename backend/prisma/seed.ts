/* eslint-disable @typescript-eslint/no-misused-promises */
import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding default categories...');

  const categories = ['Clothing', 'Electronics', 'Home & Kitchen', 'Beauty'];

  for (const categoryName of categories) {
    // Check if category already exists
    const existingCategory = await prisma.category.findUnique({
      where: { name: categoryName },
    });

    if (!existingCategory) {
      // Create category if it doesn't exist
      await prisma.category.create({
        data: {
          name: categoryName,
        },
      });
      console.log(`Created category: ${categoryName}`);
    } else {
      console.log(`Category already exists: ${categoryName}`);
    }
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
