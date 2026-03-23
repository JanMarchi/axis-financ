import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { PrismaService } from '@/prisma/prisma.service';
import { EmailService } from '@/notifications/email.service';

@Module({
  controllers: [BillingController],
  providers: [BillingService, PrismaService, EmailService],
  exports: [BillingService],
})
export class BillingModule {}
