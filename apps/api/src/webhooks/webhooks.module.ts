import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { PluggyWebhookController } from './pluggy-webhook.controller';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'sync:pluggy',
    }),
  ],
  controllers: [PluggyWebhookController],
  providers: [PrismaService],
})
export class WebhooksModule {}
