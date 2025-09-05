import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    const maxRetries = 5;
    const retryDelay = 2000; // 2 seconds

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.$connect();
        console.log('Database connected successfully');
        return;
      } catch (error) {
        console.error(
          `Database connection attempt ${attempt} failed:`,
          (error as Error).message,
        );
        if (attempt === maxRetries) {
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
