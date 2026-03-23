import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('chat')
  async chat(
    @Request() req,
    @Body() body: { message: string; sessionId: string },
  ) {
    const result = await this.aiService.chat(req.user.id, body.message, body.sessionId);
    return { data: result };
  }

  @Get('conversations')
  async getConversations(@Request() req) {
    // Implementação simplificada
    return { data: [] };
  }

  @Post('categorize')
  async categorizeTransactions(
    @Request() req,
    @Body() body: { transactions: Array<{ id: string; description: string }> },
  ) {
    const result = await this.aiService.categorizeTransactions(body.transactions, req.user.id);
    return { data: result };
  }
}
