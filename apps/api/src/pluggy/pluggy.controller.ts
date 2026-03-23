import { Controller, Get, Post, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { PluggyService } from './pluggy.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@Controller('pluggy')
@UseGuards(JwtAuthGuard)
export class PluggyController {
  constructor(private pluggyService: PluggyService) {}

  @Post('connect-token')
  async getConnectToken() {
    const token = await this.pluggyService.getConnectToken();
    return { data: token };
  }

  @Get('items')
  async getItems(@Request() req) {
    const items = await this.pluggyService.getItems(req.user.id);
    return { data: items };
  }

  @Delete('items/:id')
  async deleteItem(@Request() req, @Param('id') id: string) {
    await this.pluggyService.deleteItem(req.user.id, id);
    return { data: { success: true } };
  }

  @Post('items/:id/sync')
  async syncItem(@Request() req, @Param('id') id: string) {
    const result = await this.pluggyService.syncItem(req.user.id, id);
    return { data: result };
  }
}
