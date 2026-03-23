import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { SyncPluggyProcessor } from './sync-pluggy.processor';
import { PrismaService } from '@/prisma/prisma.service';
import { PluggyService } from '@/pluggy/pluggy.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'sync:pluggy',
    }),
  ],
  providers: [SyncPluggyProcessor, PrismaService, PluggyService],
})
export class WorkersModule {}
