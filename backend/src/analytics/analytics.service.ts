import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getSummary() {
    const [
      ordersAgg,
      totalProducts,
      totalCategories,
      lowStockProducts,
      totalCustomers,
    ] = await Promise.all([
      this.prisma.order.aggregate({
        _sum: { totalAmount: true },
        _count: { _all: true },
      }),
      this.prisma.product.count(),
      this.prisma.category.count(),
      this.prisma.product.count({ where: { stock: { lt: 10 } } }),
      this.prisma.user.count({ where: { role: 'CUSTOMER' } }),
    ]);

    return {
      totalRevenue: Number(ordersAgg._sum.totalAmount || 0),
      totalOrders: ordersAgg._count._all,
      totalProducts,
      totalCategories,
      lowStockProducts,
      totalCustomers,
    };
  }

  async getSalesByDay(days: number = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const orders = await this.prisma.order.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true, totalAmount: true },
      orderBy: { createdAt: 'asc' },
    });

    const byDay: Record<string, number> = {};
    for (const o of orders) {
      const key = o.createdAt.toISOString().slice(0, 10);
      byDay[key] = (byDay[key] || 0) + Number(o.totalAmount);
    }

    return Object.entries(byDay).map(([date, total]) => ({ date, total }));
  }
}
