import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '@/prisma/prisma.service';
import { REQUIRES_PREMIUM_KEY } from '../decorators/requires-premium.decorator';

@Injectable()
export class RequiresPremiumGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiresPremium = this.reflector.getAllAndOverride<boolean>(REQUIRES_PREMIUM_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiresPremium) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;

    if (!userId) {
      throw new ForbiddenException('User not authenticated');
    }

    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription || subscription.plan === 'free') {
      throw new ForbiddenException('Premium plan required to access this feature');
    }

    return true;
  }
}
