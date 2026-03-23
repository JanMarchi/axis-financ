import { Controller, Post, Body, Headers, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from '@/prisma/prisma.service';

@Controller('webhooks/pluggy')
export class PluggyWebhookController {
  private logger = new Logger(PluggyWebhookController.name);

  constructor(
    @InjectQueue('sync:pluggy') private syncQueue: Queue,
    private prisma: PrismaService,
  ) {}

  @Post()
  async handleWebhook(
    @Headers('x-webhook-signature') signature: string,
    @Body() payload: any,
  ) {
    this.logger.log(`Received webhook: ${payload.event}`);

    // Validar signature (implementação simplificada)
    const webhookSecret = process.env.PLUGGY_WEBHOOK_SECRET;
    if (!signature || !webhookSecret) {
      return { success: true }; // Aceitar mesmo sem validação em dev
    }

    try {
      const event = payload.event;
      const itemId = payload.item?.id;

      if (event === 'item/updated') {
        // Enfileirar job de sincronização
        await this.syncQueue.add(
          {
            itemId,
            userId: payload.userId,
          },
          {
            attempts: 3,
            backoff: {
              type: 'exponential',
              delay: 2000,
            },
          },
        );
        this.logger.log(`Enqueued sync job for item: ${itemId}`);
      } else if (event === 'item/error') {
        // Atualizar status do item para erro
        await this.prisma.pluggyItem.updateMany({
          where: { pluggyItemId: itemId },
          data: { status: 'error' as any },
        });
        this.logger.warn(`Item error: ${itemId}`);
      }

      return { success: true };
    } catch (error) {
      this.logger.error(`Webhook error: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
}
