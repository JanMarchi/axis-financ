import { SetMetadata } from '@nestjs/common';

export const REQUIRES_PREMIUM_KEY = 'requires_premium';

export const RequiresPremium = (options?: { message?: string }) =>
  SetMetadata(REQUIRES_PREMIUM_KEY, { message: options?.message || 'Premium plan required' });
