import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class GoalsService {
  constructor(private prisma: PrismaService) {}
  async create(userId: string, dto: any) {
    return this.prisma.goal.create({ data: { userId, ...dto } });
  }
  async findAll(userId: string) {
    return this.prisma.goal.findMany({ where: { userId, status: 'active' }, orderBy: { createdAt: 'desc' } });
  }
  async findOne(userId: string, id: string) {
    const goal = await this.prisma.goal.findFirst({ where: { id, userId } });
    if (!goal) throw new ForbiddenException('Meta não encontrada');
    return goal;
  }
  async update(userId: string, id: string, dto: any) {
    await this.findOne(userId, id);
    return this.prisma.goal.update({ where: { id }, data: dto });
  }
  async delete(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.goal.delete({ where: { id } });
  }
  async contribute(userId: string, id: string, amount: number) {
    const goal = await this.findOne(userId, id);
    return this.prisma.goal.update({ where: { id }, data: { currentAmount: goal.currentAmount + amount } });
  }
}
