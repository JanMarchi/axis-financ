import { Controller, Get, Query, UseGuards, Request, HttpCode, Post, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { Response } from 'express';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('cash-flow')
  async getCashFlow(@Request() req, @Query('months') months?: string): Promise<any> {
    const monthsNum = months ? parseInt(months) : 12;
    const data = await this.reportsService.getCashFlow(req.user.id, monthsNum);
    return { data };
  }

  @Get('expenses-by-category')
  async getExpensesByCategory(@Request() req, @Query('months') months?: string): Promise<any> {
    const monthsNum = months ? parseInt(months) : 12;
    const data = await this.reportsService.getExpensesByCategory(req.user.id, monthsNum);
    return { data };
  }

  @Get('net-worth-history')
  async getNetWorthHistory(@Request() req, @Query('months') months?: string): Promise<any> {
    const monthsNum = months ? parseInt(months) : 12;
    const data = await this.reportsService.getNetWorthHistory(req.user.id, monthsNum);
    return { data };
  }

  @Get('budget-history')
  async getBudgetHistory(@Request() req): Promise<any> {
    const data = await this.reportsService.getBudgetHistory(req.user.id);
    return { data };
  }

  @Get('export/csv')
  @HttpCode(200)
  async exportCsv(
    @Request() req,
    @Query('type') type: 'transactions' | 'accounts' | 'bills',
    @Res() res: Response,
  ) {
    const csv = await this.reportsService.generateCsvExport(req.user.id, type);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="export-${type}-${Date.now()}.csv"`);
    res.send(csv);
  }

  @Post('export/pdf')
  @HttpCode(202)
  async exportPdf(@Request() req, @Query('type') type: string) {
    // Enqueue to job queue for PDF generation
    return {
      message: 'PDF export queued',
      status: 'processing',
      notificationChannel: 'email',
    };
  }
}
