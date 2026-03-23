import { Controller, Post, Get, Body, UseGuards, Request, HttpCode } from '@nestjs/common';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@Controller('billing')
export class BillingController {
  constructor(private billingService: BillingService) {}

  @Get('plans')
  async getPricingPlans() {
    const plans = await this.billingService.getPricingPlans();
    return { data: plans };
  }

  @UseGuards(JwtAuthGuard)
  @Get('current')
  async getCurrentPlan(@Request() req) {
    const plan = await this.billingService.getUserPlan(req.user.id);
    return { data: plan };
  }

  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  async createCheckoutSession(@Request() req, @Body() body: { priceId: string }) {
    const result = await this.billingService.createCheckoutSession(req.user.id, body.priceId);
    return { data: result };
  }

  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(@Body() body: any) {
    await this.billingService.handleWebhook(body);
    return { success: true };
  }
}
