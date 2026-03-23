import { Controller, Post, Body, Logger } from '@nestjs/common';
import { BillsService } from '@/bills/bills.service';
import { PrismaService } from '@/prisma/prisma.service';

@Controller('webhooks/whatsapp')
export class WhatsAppWebhookController {
  private logger = new Logger(WhatsAppWebhookController.name);

  constructor(
    private billsService: BillsService,
    private prisma: PrismaService,
  ) {}

  @Post()
  async handleWebhook(@Body() payload: any) {
    try {
      const { messages } = payload;

      if (!messages || messages.length === 0) {
        return { success: true };
      }

      for (const msg of messages) {
        const phoneNumber = msg.phone;
        const messageText = msg.body || '';

        this.logger.log(`Received WhatsApp message from ${phoneNumber}: ${messageText}`);

        // Buscar usuário pelo telefone
        const user = await this.prisma.user.findFirst({
          where: { phone: phoneNumber },
        });

        if (!user) {
          this.logger.warn(`Unknown phone number: ${phoneNumber}`);
          continue;
        }

        // Processar comando
        if (messageText.toUpperCase() === 'SIM') {
          // Marcar primeira bill pendente como paga
          const bill = await this.prisma.bill.findFirst({
            where: {
              userId: user.id,
              status: 'pending',
            },
            orderBy: { dueDate: 'asc' },
          });

          if (bill) {
            await this.billsService.pay(user.id, bill.id);
            this.logger.log(`Marked bill ${bill.id} as paid via WhatsApp`);
          }
        } else if (messageText.toUpperCase() === 'NÃO' || messageText.toUpperCase() === 'NAO') {
          this.logger.log(`User ${user.id} declined bill confirmation`);
          // Implementar lógica de reagendamento
        }
      }

      return { success: true };
    } catch (error) {
      this.logger.error(`Webhook error: ${(error as Error).message}`);
      return { success: false, error: (error as Error).message };
    }
  }
}
