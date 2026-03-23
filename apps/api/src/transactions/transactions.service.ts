import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: any) {
    const transaction = await this.prisma.transaction.create({
      data: {
        userId,
        accountId: dto.accountId,
        categoryId: dto.categoryId,
        amount: dto.amount,
        description: dto.description,
        type: dto.type,
        date: new Date(dto.date),
        status: dto.status || 'pending',
      },
    });

    // Atualizar saldo da conta
    await this.updateAccountBalance(dto.accountId);
    return transaction;
  }

  async findAll(userId: string, filters: any = {}) {
    const where: any = { userId };
    if (filters.accountId) where.accountId = filters.accountId;
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.type) where.type = filters.type;
    if (filters.startDate) where.date = { gte: new Date(filters.startDate) };
    if (filters.endDate) where.date = { lte: new Date(filters.endDate) };

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        orderBy: { date: 'desc' },
        take: filters.limit || 50,
        skip: (filters.page || 1) * (filters.limit || 50) - (filters.limit || 50),
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      data: transactions,
      meta: {
        page: filters.page || 1,
        limit: filters.limit || 50,
        total,
        totalPages: Math.ceil(total / (filters.limit || 50)),
      },
    };
  }

  async findOne(userId: string, id: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, userId },
    });
    if (!transaction) throw new ForbiddenException('Transação não encontrada');
    return transaction;
  }

  async update(userId: string, id: string, dto: any) {
    await this.findOne(userId, id);
    const updated = await this.prisma.transaction.update({
      where: { id },
      data: dto,
    });
    await this.updateAccountBalance(updated.accountId);
    return updated;
  }

  async delete(userId: string, id: string) {
    const transaction = await this.findOne(userId, id);
    await this.prisma.transaction.delete({ where: { id } });
    await this.updateAccountBalance(transaction.accountId);
  }

  private async updateAccountBalance(accountId: string) {
    const sum = await this.prisma.transaction.aggregate({
      where: { accountId, type: { in: ['income', 'transfer'] } },
      _sum: { amount: true },
    });
    const expenses = await this.prisma.transaction.aggregate({
      where: { accountId, type: { in: ['expense', 'credit_card_bill'] } },
      _sum: { amount: true },
    });

    const balance = (sum._sum.amount || 0) - (expenses._sum.amount || 0);
    await this.prisma.account.update({
      where: { id: accountId },
      data: { balance },
    });
  }
}
