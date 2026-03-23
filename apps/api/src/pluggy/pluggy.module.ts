import { Module } from '@nestjs/common';
import { PluggyService } from './pluggy.service';
import { PluggyController } from './pluggy.controller';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [PluggyController],
  providers: [PluggyService, PrismaService],
  exports: [PluggyService],
})
export class PluggyModule {}
