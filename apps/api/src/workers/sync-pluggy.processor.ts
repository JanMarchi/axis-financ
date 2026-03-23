import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { PrismaService } from '@/prisma/prisma.service';
import { PluggyService } from '@/pluggy/pluggy.service';

@Processor('sync:pluggy')
export class SyncPluggyProcessor {
  private logger = new Logger(SyncPluggyProcessor.name);

  constructor(
    private prisma: PrismaService,
    private pluggyService: PluggyService,
  ) {}

  @Process()
  async handleSync(job: Job<{ itemId: string; userId: string }>) {
    const { itemId, userId } = job.data;

    try {
      this.logger.log(`Starting sync for item: ${itemId}`);

      // Buscar item do banco
      const item = await this.prisma.pluggyItem.findFirst({
        where: { pluggyItemId: itemId },
      });

      if (!item) {
        throw new Error(`Item not found: ${itemId}`);
      }

      // Buscar transações desde o último sync
      const transactions = await this.pluggyService.getTransactions(
        itemId,
        item.lastUpdatedAt || undefined,
      );

      // Normalizar e deduplicar
      for (const tx of transactions) {
        const existingTx = await this.prisma.transaction.findFirst({
          where: { pluggyTransactionId: tx.id },
        });

        if (!existingTx) {
          // Criar nova transação
          await this.prisma.transaction.create({
            data: {
              userId,
              accountId: item.id, // Usando item.id como accountId (precisa mapear corretamente)
              amount: tx.amount,
              description: tx.description,
              type: this.mapTransactionType(tx.type),
              date: new Date(tx.date),
              status: 'paid',
              pluggyTransactionId: tx.id,
            },
          });
        }
      }

      // Atualizar lastUpdatedAt do item
      await this.prisma.pluggyItem.update({
        where: { id: item.id },
        data: { lastUpdatedAt: new Date() },
      });

      this.logger.log(`Sync completed for item: ${itemId}, ${transactions.length} transactions`);
      return { success: true, transactionCount: transactions.length };
    } catch (error) {
      this.logger.error(`Sync error for item ${itemId}: ${error.message}`);
      throw error;
    }
  }

  private mapTransactionType(pluggyType: string): string {
    const mapping: Record<string, string> = {
      income: 'income',
      expense: 'expense',
      transfer: 'transfer',
      debit: 'expense',
      credit: 'income',
    };
    return mapping[pluggyType] || 'expense';
  }
}
