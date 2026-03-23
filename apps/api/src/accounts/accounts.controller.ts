import { Controller, Get, Post, Body, Patch, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Post()
  create(@Request() req, @Body() dto: CreateAccountDto) {
    return { data: this.accountsService.create(req.user.id, dto) };
  }

  @Get()
  findAll(@Request() req) {
    return { data: this.accountsService.findAll(req.user.id) };
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return { data: this.accountsService.findOne(req.user.id, id) };
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() dto: UpdateAccountDto) {
    return { data: this.accountsService.update(req.user.id, id, dto) };
  }

  @Delete(':id')
  delete(@Request() req, @Param('id') id: string) {
    return { data: this.accountsService.delete(req.user.id, id) };
  }
}
