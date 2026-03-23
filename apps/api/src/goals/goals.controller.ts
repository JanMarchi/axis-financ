import { Controller, Get, Post, Body, Patch, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@Controller('goals')
@UseGuards(JwtAuthGuard)
export class GoalsController {
  constructor(private goalsService: GoalsService) {}
  @Post()
  create(@Request() req, @Body() dto: any) {
    return { data: this.goalsService.create(req.user.id, dto) };
  }
  @Get()
  findAll(@Request() req) {
    return { data: this.goalsService.findAll(req.user.id) };
  }
  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return { data: this.goalsService.findOne(req.user.id, id) };
  }
  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() dto: any) {
    return { data: this.goalsService.update(req.user.id, id, dto) };
  }
  @Delete(':id')
  delete(@Request() req, @Param('id') id: string) {
    return { data: this.goalsService.delete(req.user.id, id) };
  }
  @Post(':id/contribute')
  contribute(@Request() req, @Param('id') id: string, @Body() body: any) {
    return { data: this.goalsService.contribute(req.user.id, id, body.amount) };
  }
}
