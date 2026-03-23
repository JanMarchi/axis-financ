import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateAccountDto) {
    return this.prisma.account.create({
      data: {
        userId,
        name: dto.name,
        type: dto.type,
        institution: dto.institution,
        balance: dto.balance || 0,
        currency: 'BRL',
        isActive: true,
        isManual: true,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.account.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const account = await this.prisma.account.findFirst({
      where: { id, userId },
    });

    if (!account) throw new ForbiddenException('Conta não encontrada');
    return account;
  }

  async update(userId: string, id: string, dto: UpdateAccountDto) {
    await this.findOne(userId, id);

    return this.prisma.account.update({
      where: { id },
      data: dto,
    });
  }

  async delete(userId: string, id: string) {
    await this.findOne(userId, id);

    return this.prisma.account.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
