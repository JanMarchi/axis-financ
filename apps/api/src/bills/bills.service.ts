import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class BillsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: any) {
    return this.prisma.bill.create({
      data: { userId, ...dto },
    });
  }

  async findAll(userId: string, filters: any = {}) {
    return this.prisma.bill.findMany({
      where: { userId, ...(filters.status && { status: filters.status }) },
      orderBy: { dueDate: 'asc' },
    });
  }

  async findOne(userId: string, id: string) {
    const bill = await this.prisma.bill.findFirst({ where: { id, userId } });
    if (!bill) throw new ForbiddenException('Conta não encontrada');
    return bill;
  }

  async update(userId: string, id: string, dto: any) {
    await this.findOne(userId, id);
    return this.prisma.bill.update({ where: { id }, data: dto });
  }

  async delete(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.bill.delete({ where: { id } });
  }

  async pay(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.bill.update({
      where: { id },
      data: { status: 'paid', paidAt: new Date() },
    });
  }
}
