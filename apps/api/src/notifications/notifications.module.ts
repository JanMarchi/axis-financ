import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { ZApiGateway } from './whatsapp.gateway';
import { EmailService } from './email.service';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notifications:dispatch',
    }),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, ZApiGateway, EmailService, PrismaService],
  exports: [NotificationsService, ZApiGateway, EmailService],
})
export class NotificationsModule {}
