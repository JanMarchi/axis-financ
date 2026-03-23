import { Injectable, CanActivate, ExecutionContext, TooManyRequestsException } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private redis: Redis;
  private readonly maxRequests = 100;
  private readonly windowMs = 15 * 60 * 1000; // 15 minutes

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const identifier = this.getIdentifier(request);
    const key = `rate-limit:${identifier}`;

    try {
      const current = await this.redis.incr(key);

      if (current === 1) {
        await this.redis.expire(key, Math.ceil(this.windowMs / 1000));
      }

      if (current > this.maxRequests) {
        throw new TooManyRequestsException('Too many requests, please try again later.');
      }

      return true;
    } catch (error) {
      if (error instanceof TooManyRequestsException) {
        throw error;
      }
      // If Redis fails, allow the request to proceed
      return true;
    }
  }

  private getIdentifier(request: any): string {
    // Use user ID if authenticated, otherwise use IP
    if (request.user?.id) {
      return `user:${request.user.id}`;
    }
    return `ip:${request.ip}`;
  }
}
