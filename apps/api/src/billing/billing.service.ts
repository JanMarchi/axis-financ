import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { EmailService } from '@/notifications/email.service';

@Injectable()
export class BillingService {
  private logger = new Logger(BillingService.name);
  private stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async createCheckoutSession(userId: string, priceId: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error('User not found');

      // Chamada ao Stripe (implementação simplificada)
      const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.stripeSecretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'payment_method_types[]': 'card',
          'line_items[0][price]': priceId,
          'line_items[0][quantity]': '1',
          'mode': 'subscription',
          'success_url': `${process.env.APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
          'cancel_url': `${process.env.APP_URL}/settings/billing`,
          'customer_email': user.email,
        }).toString(),
      });

      if (!response.ok) {
        throw new Error(`Stripe error: ${response.statusText}`);
      }

      const data = (await response.json()) as any;
      return { sessionId: data.id, url: data.url };
    } catch (error) {
      this.logger.error(`Failed to create checkout session: ${(error as Error).message}`);
      throw error;
    }
  }

  async handleWebhook(event: any) {
    try {
      this.logger.log(`Processing Stripe event: ${event.type}`);

      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          return this.handleSubscriptionChange(event.data.object);
        case 'invoice.payment_succeeded':
          return this.handlePaymentSucceeded(event.data.object);
        case 'invoice.payment_failed':
          return this.handlePaymentFailed(event.data.object);
        default:
          this.logger.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      this.logger.error(`Webhook error: ${(error as Error).message}`);
      throw error;
    }
  }

  private async handleSubscriptionChange(subscription: any) {
    // Buscar user pelo Stripe customer ID
    const user = await this.prisma.user.findFirst({
      where: {
        subscription: {
          stripeCustomerId: subscription.customer,
        },
      },
    });

    if (!user) {
      this.logger.warn(`User not found for subscription: ${subscription.customer}`);
      return;
    }

    // Atualizar subscription
    const status = subscription.status === 'active' ? 'active' : 'past_due';
    const plan = subscription.items.data[0]?.metadata?.plan || 'premium_monthly';

    await this.prisma.subscription.update({
      where: { userId: user.id },
      data: {
        stripeSubscriptionId: subscription.id,
        plan: plan as any,
        status: status as any,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });

    // Send confirmation email
    await this.emailService.sendSubscriptionConfirmed(
      user.email,
      plan,
      new Date(subscription.current_period_end * 1000),
    );

    this.logger.log(`Updated subscription for user ${user.id}`);
  }

  private async handlePaymentSucceeded(invoice: any) {
    this.logger.log(`Payment succeeded for invoice: ${invoice.id}`);
    // Atualizar status de pagamento se necessário
  }

  private async handlePaymentFailed(invoice: any) {
    this.logger.log(`Payment failed for invoice: ${invoice.id}`);

    try {
      const subscription = await this.prisma.subscription.findFirst({
        where: {
          stripeSubscriptionId: invoice.subscription,
        },
        include: { user: true },
      });

      if (subscription) {
        await this.emailService.sendPaymentFailed(subscription.user.email, subscription.plan);
      }
    } catch (error) {
      this.logger.error(`Failed to send payment failed email: ${(error as Error).message}`);
    }
  }

  async getUserPlan(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    return {
      plan: subscription?.plan || 'free',
      status: subscription?.status || 'active',
      currentPeriodStart: subscription?.currentPeriodStart,
      currentPeriodEnd: subscription?.currentPeriodEnd,
    };
  }

  async getPricingPlans() {
    return [
      {
        id: process.env.STRIPE_PRICE_PREMIUM_MONTHLY,
        name: 'Premium Monthly',
        price: 29.99,
        interval: 'month',
        features: [
          'Sincronização automática de 5 bancos',
          'Categorização automática com IA',
          'Lembretes de contas via WhatsApp',
          'Análise de despesas com Na_th',
          'Sem limite de transações',
        ],
      },
      {
        id: process.env.STRIPE_PRICE_PREMIUM_ANNUAL,
        name: 'Premium Annual',
        price: 299.99,
        interval: 'year',
        features: [
          'Tudo do plano mensal',
          'Desconto de 16%',
          'Suporte prioritário',
        ],
      },
    ];
  }
}
