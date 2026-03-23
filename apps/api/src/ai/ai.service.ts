import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class AiService {
  private logger = new Logger(AiService.name);
  private anthropicApiKey = process.env.ANTHROPIC_API_KEY;

  constructor(private prisma: PrismaService) {}

  async categorizeTransactions(
    transactions: Array<{ id: string; description: string }>,
    userId: string,
  ): Promise<Array<{ id: string; categoryId: string }>> {
    const results: Array<{ id: string; categoryId: string }> = [];

    // Processar em batches de até 50
    for (let i = 0; i < transactions.length; i += 50) {
      const batch = transactions.slice(i, i + 50);

      try {
        const categorizations = await this.callClaudeAPI(batch, userId);
        results.push(...categorizations);
      } catch (error) {
        this.logger.error(`Categorization error: ${(error as Error).message}`);
        // Fallback para heurístico se Claude offline
        for (const tx of batch) {
          const categoryId = this.heuristicCategorize(tx.description);
          results.push({ id: tx.id, categoryId });
        }
      }
    }

    return results;
  }

  private async callClaudeAPI(
    transactions: Array<{ id: string; description: string }>,
    userId: string,
  ): Promise<Array<{ id: string; categoryId: string }>> {
    const prompt = `Categorize these transactions into one of: income, expense, transfer, credit_card_bill.
Return a JSON array with { id, category } for each.

Transactions:
${transactions.map((t) => `- ID: ${t.id}, Description: "${t.description}"`).join('\n')}

Return ONLY valid JSON array, no markdown.`;

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      };
      if (this.anthropicApiKey) {
        headers['x-api-key'] = this.anthropicApiKey;
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.statusText}`);
      }

      const data = (await response.json()) as any;
      const content = data.content[0].text;

      // Parse resposta JSON
      const matches = content.match(/\[[\s\S]*\]/);
      if (!matches) {
        throw new Error('Invalid JSON response from Claude');
      }

      const categorizations = JSON.parse(matches[0]);

      // Mapear para categoryIds do banco
      return await Promise.all(
        categorizations.map(async (cat: any) => {
          const dbCategory = await this.prisma.category.findFirst({
            where: {
              name: cat.category,
              OR: [{ userId }, { isSystem: true }],
            },
          });

          return {
            id: cat.id,
            categoryId: dbCategory?.id || (await this.getDefaultCategoryId(userId, cat.category)),
          };
        }),
      );
    } catch (error) {
      this.logger.error(`Claude API call failed: ${(error as Error).message}`);
      throw error;
    }
  }

  private heuristicCategorize(description: string): string {
    // Cache em Redis: hash(description) -> categoryId
    const hash = crypto.createHash('md5').update(description).digest('hex');
    const key = `categorize:${hash}`;

    // Implementação simplificada: keywords
    const desc = description.toLowerCase();

    if (
      desc.includes('salary') ||
      desc.includes('salary') ||
      desc.includes('freelance') ||
      desc.includes('income')
    ) {
      return 'income';
    } else if (
      desc.includes('transfer') ||
      desc.includes('pix') ||
      desc.includes('ted')
    ) {
      return 'transfer';
    } else if (
      desc.includes('credit') ||
      desc.includes('bill') ||
      desc.includes('invoice')
    ) {
      return 'credit_card_bill';
    }

    return 'expense';
  }

  private async getDefaultCategoryId(userId: string, categoryName: string): Promise<string> {
    let category = await this.prisma.category.findFirst({
      where: {
        name: categoryName,
        userId,
      },
    });

    if (!category) {
      // Criar categoria padrão
      category = await this.prisma.category.create({
        data: {
          name: categoryName,
          userId,
          type: 'expense',
        },
      });
    }

    return category.id;
  }

  async chat(userId: string, message: string, sessionId: string) {
    // Implementação de chat com Na_th
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      };
      if (this.anthropicApiKey) {
        headers['x-api-key'] = this.anthropicApiKey;
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1024,
          system: `You are Na_th, a financial copilot. You help users manage their finances in Portuguese.
Be concise, friendly, and always provide actionable advice.`,
          messages: [{ role: 'user', content: message }],
        }),
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.statusText}`);
      }

      const data = (await response.json()) as any;
      const reply = data.content[0].text;

      // Salvar conversa
      const conversation = await this.prisma.aiConversation.findFirst({
        where: { sessionId, userId },
      });

      if (conversation) {
        const messages = Array.isArray(conversation.messages) ? conversation.messages : [];
        messages.push({ role: 'user', content: message });
        messages.push({ role: 'assistant', content: reply });

        await this.prisma.aiConversation.update({
          where: { id: conversation.id },
          data: { messages },
        });
      } else {
        await this.prisma.aiConversation.create({
          data: {
            userId,
            sessionId,
            messages: [
              { role: 'user', content: message },
              { role: 'assistant', content: reply },
            ],
          },
        });
      }

      return { reply, sessionId };
    } catch (error) {
      this.logger.error(`Chat error: ${(error as Error).message}`);
      throw error;
    }
  }
}
