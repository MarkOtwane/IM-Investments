import { PrismaClient } from 'generated/prisma';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: 'Mark1234@g.K',
      role: 'ADMIN',
    },
  });
  await prisma.product.create({
    data: {
      name: 'T-Shirt',
      description: 'Cotton T-Shirt',
      price: 19.99,
      imageUrl: 'https://example.com/tshirt.jpg',
      stock: 100,
    },
  });
}

// eslint-disable-next-line @typescript-eslint/no-misused-promises
void main().finally(() => prisma.$disconnect());

// Use npx prisma studio to inspect the database.
