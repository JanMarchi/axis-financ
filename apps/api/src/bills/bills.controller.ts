import { Controller, Get, Post, Body, Patch, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { BillsService } from './bills.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@Controller('bills')
@UseGuards(JwtAuthGuard)
export class BillsController {
  constructor(private billsService: BillsService) {}
  @Post()
  create(@Request() req, @Body() dto: any) {
    return { data: this.billsService.create(req.user.id, dto) };
  }
  @Get()
  findAll(@Request() req) {
    return { data: this.billsService.findAll(req.user.id) };
  }
  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return { data: this.billsService.findOne(req.user.id, id) };
  }
  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() dto: any) {
    return { data: this.billsService.update(req.user.id, id, dto) };
  }
  @Delete(':id')
  delete(@Request() req, @Param('id') id: string) {
    return { data: this.billsService.delete(req.user.id, id) };
  }
  @Post(':id/pay')
  pay(@Request() req, @Param('id') id: string) {
    return { data: this.billsService.pay(req.user.id, id) };
  }
}
