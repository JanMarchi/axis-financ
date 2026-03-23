import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class PluggyService {
  private readonly apiBaseUrl = 'https://api.pluggy.ai';
  private readonly clientId = process.env.PLUGGY_CLIENT_ID;
  private readonly clientSecret = process.env.PLUGGY_CLIENT_SECRET;

  constructor(private prisma: PrismaService) {}

  async getConnectToken(): Promise<{ url: string; token: string; expiresAt: Date }> {
    const response = await fetch(`${this.apiBaseUrl}/auth/authorize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientId: this.clientId,
        clientSecret: this.clientSecret,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get connect token: ${response.statusText}`);
    }

    const data = (await response.json()) as any;
    return {
      url: data.redirectUri,
      token: data.token,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    };
  }

  async getItems(userId: string) {
    const items = await this.prisma.pluggyItem.findMany({
      where: { userId },
    });
    return items;
  }

  async createItem(userId: string, pluggyItemId: string, institutionName: string) {
    return this.prisma.pluggyItem.create({
      data: {
        userId,
        pluggyItemId,
        institutionName,
        status: 'active',
      },
    });
  }

  async deleteItem(userId: string, itemId: string) {
    const item = await this.prisma.pluggyItem.findFirst({
      where: { id: itemId, userId },
    });

    if (!item) {
      throw new Error('Item not found');
    }

    return this.prisma.pluggyItem.delete({
      where: { id: itemId },
    });
  }

  async syncItem(userId: string, itemId: string) {
    const item = await this.prisma.pluggyItem.findFirst({
      where: { id: itemId, userId },
    });

    if (!item) {
      throw new Error('Item not found');
    }

    // Aqui viria a chamada real para a API do Pluggy para buscar transações
    // Por enquanto, apenas atualiza o lastUpdatedAt
    return this.prisma.pluggyItem.update({
      where: { id: itemId },
      data: { lastUpdatedAt: new Date() },
    });
  }

  async getTransactions(pluggyItemId: string, since?: Date) {
    // Chamada à API do Pluggy para buscar transações
    const response = await fetch(
      `${this.apiBaseUrl}/transactions?itemId=${pluggyItemId}${since ? `&since=${since.toISOString()}` : ''}`,
      {
        headers: {
          Authorization: `Bearer ${this.clientSecret}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to get transactions: ${response.statusText}`);
    }

    return (await response.json()) as any[];
  }
}
