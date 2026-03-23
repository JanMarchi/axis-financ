import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class BudgetsService {
  constructor(private prisma: PrismaService) {}
  async findByMonth(userId: string, month: number, year: number) {
    return this.prisma.budget.findMany({ where: { userId, month, year }, orderBy: { createdAt: 'desc' } });
  }
  async upsert(userId: string, categoryId: string, month: number, year: number, budgetedAmount: number, envelope: string) {
    return this.prisma.budget.upsert({
      where: { userId_categoryId_month_year: { userId, categoryId, month, year } },
      update: { budgetedAmount },
      create: { userId, categoryId, month, year, budgetedAmount, envelope: envelope as any },
    });
  }
}
