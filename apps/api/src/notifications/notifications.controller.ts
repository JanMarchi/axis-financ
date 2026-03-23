import { Controller, Get, Post, Body, Param, UseGuards, Request, Query, HttpCode } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(
    @Request() req,
    @Query('limit') limit = '20',
    @Query('offset') offset = '0',
  ) {
    const notifications = await this.notificationsService.getNotifications(
      req.user.id,
      parseInt(limit),
      parseInt(offset),
    );
    return { data: notifications };
  }

  @Post(':id/read')
  @HttpCode(200)
  async markAsRead(@Request() req, @Param('id') id: string) {
    const notification = await this.notificationsService.markAsRead(id, req.user.id);
    return { data: notification };
  }
}
