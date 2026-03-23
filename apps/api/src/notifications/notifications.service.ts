import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class NotificationsService {
  private logger = new Logger(NotificationsService.name);

  constructor(
    private prisma: PrismaService,
    @InjectQueue('notifications:dispatch') private notificationQueue: Queue,
  ) {}

  async send(
    userId: string,
    type: string,
    channel: string,
    title: string,
    body: string,
    data?: any,
  ) {
    try {
      // Criar registro na DB
      const notification = await this.prisma.notification.create({
        data: {
          userId,
          type: type as any,
          channel: channel as any,
          title,
          body,
          data: data || {},
          status: 'pending',
        },
      });

      // Enfileirar job de envio
      await this.notificationQueue.add(
        {
          notificationId: notification.id,
          userId,
          type,
          channel,
          title,
          body,
          data,
        },
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
        },
      );

      this.logger.log(`Queued notification ${notification.id} for delivery`);
      return notification;
    } catch (error) {
      this.logger.error(`Failed to queue notification: ${(error as Error).message}`);
      throw error;
    }
  }

  async getNotifications(userId: string, limit = 20, offset = 0) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { status: 'read' as any },
    });
  }
}
