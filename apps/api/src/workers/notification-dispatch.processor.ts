import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { PrismaService } from '@/prisma/prisma.service';
import { ZApiGateway } from '@/notifications/whatsapp.gateway';

@Processor('notifications:dispatch')
export class NotificationDispatchProcessor {
  private logger = new Logger(NotificationDispatchProcessor.name);

  constructor(
    private prisma: PrismaService,
    private zapiGateway: ZApiGateway,
  ) {}

  @Process()
  async handleDispatch(job: Job<any>) {
    const { notificationId, userId, channel, title, body } = job.data;

    try {
      this.logger.log(`Processing notification ${notificationId} via ${channel}`);

      const notification = await this.prisma.notification.findUnique({
        where: { id: notificationId },
      });

      if (!notification) {
        throw new Error(`Notification not found: ${notificationId}`);
      }

      if (channel === 'whatsapp') {
        // Buscar telefone do usuário
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
        });

        if (!user?.phone) {
          throw new Error(`User phone not found: ${userId}`);
        }

        // Enviar via WhatsApp
        const message = `${title}\n\n${body}`;
        const success = await this.zapiGateway.sendMessage(user.phone, message);

        if (success) {
          await this.prisma.notification.update({
            where: { id: notificationId },
            data: {
              status: 'sent' as any,
              sentAt: new Date(),
            },
          });
          this.logger.log(`Notification ${notificationId} sent via WhatsApp`);
          return { success: true };
        } else {
          throw new Error('Failed to send WhatsApp message');
        }
      } else if (channel === 'in_app') {
        // Notificação in-app apenas registra como entregue
        await this.prisma.notification.update({
          where: { id: notificationId },
          data: {
            status: 'delivered' as any,
            deliveredAt: new Date(),
          },
        });
        this.logger.log(`Notification ${notificationId} marked as delivered (in-app)`);
        return { success: true };
      }

      throw new Error(`Unsupported channel: ${channel}`);
    } catch (error) {
      this.logger.error(
        `Failed to dispatch notification ${notificationId}: ${(error as Error).message}`,
      );

      // Atualizar como falho após 3 tentativas
      if (job.attemptsMade >= job.opts.attempts!) {
        await this.prisma.notification.update({
          where: { id: job.data.notificationId },
          data: { status: 'failed' as any },
        });
      }

      throw error;
    }
  }
}
