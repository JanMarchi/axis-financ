import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  findAll(@Request() req) {
    return { data: this.categoriesService.findAll(req.user.id) };
  }

  @Post()
  create(@Request() req, @Body() dto: any) {
    return { data: this.categoriesService.create(req.user.id, dto) };
  }
}
