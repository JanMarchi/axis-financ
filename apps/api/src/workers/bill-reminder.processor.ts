import { Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '@/prisma/prisma.service';
import { NotificationsService } from '@/notifications/notifications.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BillReminderProcessor {
  private logger = new Logger(BillReminderProcessor.name);

  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async remindUpcomingBills() {
    try {
      this.logger.log('Starting bill reminder job');

      const today = new Date();
      const daysAhead = (await this.prisma.userPreferences.findFirst())
        ?.notificationDaysBefore || 3;

      const targetDate = new Date(today);
      targetDate.setDate(targetDate.getDate() + daysAhead);

      // Buscar bills que vencem no dia alvo e ainda não foram notificados
      const upcomingBills = await this.prisma.bill.findMany({
        where: {
          status: 'pending',
          dueDate: {
            gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
            lt: new Date(
              targetDate.getFullYear(),
              targetDate.getMonth(),
              targetDate.getDate() + 1,
            ),
          },
          notificationSentAt: null,
        },
        include: { user: true },
      });

      this.logger.log(`Found ${upcomingBills.length} bills to remind`);

      for (const bill of upcomingBills) {
        const daysUntil = Math.ceil(
          (new Date(bill.dueDate).getTime() - today.getTime()) /
            (1000 * 60 * 60 * 24),
        );

        const message = `Oi ${bill.user.name}! 📅 *${bill.name}* vence em ${daysUntil} dia${daysUntil !== 1 ? 's' : ''} — R$ ${bill.amount.toFixed(2)}. Responda *SIM* para confirmar.`;

        // Enviar notificação
        const preferences = await this.prisma.userPreferences.findFirst({
          where: { userId: bill.userId },
        });

        const channel = preferences?.whatsappEnabled ? 'whatsapp' : 'in_app';

        await this.notificationsService.send(
          bill.userId,
          'bill_reminder',
          channel,
          `${bill.name} vence em ${daysUntil} dia${daysUntil !== 1 ? 's' : ''}`,
          message,
        );

        // Marcar como notificado
        await this.prisma.bill.update({
          where: { id: bill.id },
          data: { notificationSentAt: new Date() },
        });

        this.logger.log(`Sent reminder for bill ${bill.id} to ${bill.user.id}`);
      }

      this.logger.log('Bill reminder job completed');
    } catch (error) {
      this.logger.error(
        `Bill reminder job failed: ${(error as Error).message}`,
      );
    }
  }
}
