import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@Controller('budgets')
@UseGuards(JwtAuthGuard)
export class BudgetsController {
  constructor(private budgetsService: BudgetsService) {}

  @Get()
  findByMonth(
    @Request() req,
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    return {
      data: this.budgetsService.findByMonth(
        req.user.id,
        parseInt(month),
        parseInt(year),
      ),
    };
  }

  @Post('configure')
  upsert(@Request() req, @Body() dto: any) {
    return {
      data: this.budgetsService.upsert(
        req.user.id,
        dto.categoryId,
        dto.month,
        dto.year,
        dto.budgetedAmount,
        dto.envelope,
      ),
    };
  }
}
