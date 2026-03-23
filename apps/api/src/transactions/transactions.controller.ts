import { Controller, Get, Post, Body, Patch, Delete, Param, UseGuards, Request, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Post()
  create(@Request() req, @Body() dto: any) {
    return { data: this.transactionsService.create(req.user.id, dto) };
  }

  @Get()
  findAll(@Request() req, @Query() filters: any) {
    return this.transactionsService.findAll(req.user.id, filters);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return { data: this.transactionsService.findOne(req.user.id, id) };
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() dto: any) {
    return { data: this.transactionsService.update(req.user.id, id, dto) };
  }

  @Delete(':id')
  delete(@Request() req, @Param('id') id: string) {
    this.transactionsService.delete(req.user.id, id);
    return { data: { success: true } };
  }
}
