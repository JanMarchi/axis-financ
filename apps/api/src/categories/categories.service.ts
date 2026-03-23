import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}
  async findAll(userId: string) {
    return this.prisma.category.findMany({
      where: { OR: [{ userId }, { userId: null }] },
      orderBy: { name: 'asc' },
    });
  }
  async create(userId: string, dto: any) {
    return this.prisma.category.create({ data: { userId, ...dto } });
  }
}
