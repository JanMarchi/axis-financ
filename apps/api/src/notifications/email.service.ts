import { Injectable, Logger } from '@nestjs/common';

interface EmailPayload {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

@Injectable()
export class EmailService {
  private logger = new Logger(EmailService.name);
  private resendApiKey = process.env.RESEND_API_KEY;

  async sendWelcomeEmail(email: string, name: string) {
    return this.sendEmail({
      to: email,
      subject: 'Bem-vindo ao Axis Finance!',
      template: 'welcome',
      data: { name },
    });
  }

  async sendSubscriptionConfirmed(email: string, planName: string, expiresAt?: Date) {
    return this.sendEmail({
      to: email,
      subject: 'Assinatura ativada com sucesso',
      template: 'subscription_confirmed',
      data: { planName, expiresAt },
    });
  }

  async sendTrialEnding(email: string, daysRemaining: number) {
    return this.sendEmail({
      to: email,
      subject: `Seu período de teste termina em ${daysRemaining} dias`,
      template: 'trial_ending',
      data: { daysRemaining },
    });
  }

  async sendPaymentFailed(email: string, planName: string) {
    return this.sendEmail({
      to: email,
      subject: 'Falha no pagamento da sua assinatura',
      template: 'payment_failed',
      data: { planName },
    });
  }

  async sendPasswordReset(email: string, resetLink: string) {
    return this.sendEmail({
      to: email,
      subject: 'Redefina sua senha',
      template: 'password_reset',
      data: { resetLink },
    });
  }

  private async sendEmail(payload: EmailPayload) {
    try {
      if (!this.resendApiKey) {
        this.logger.warn('RESEND_API_KEY not configured, skipping email');
        return { success: false, message: 'Email service not configured' };
      }

      // Make request to Resend API
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'noreply@axisfinance.app',
          to: payload.to,
          subject: payload.subject,
          html: this.renderTemplate(payload.template, payload.data),
        }),
      });

      if (!response.ok) {
        throw new Error(`Resend API error: ${response.statusText}`);
      }

      const data = await response.json();
      this.logger.log(`Email sent to ${payload.to}`);
      return { success: true, data };
    } catch (error) {
      this.logger.error(`Failed to send email: ${(error as Error).message}`);
      return { success: false, message: (error as Error).message };
    }
  }

  private renderTemplate(template: string, data: Record<string, any>): string {
    const templates: Record<string, (data: any) => string> = {
      welcome: (data) => `
        <h1>Bem-vindo ao Axis Finance!</h1>
        <p>Olá ${data.name},</p>
        <p>Sua conta foi criada com sucesso. Aproveite a plataforma!</p>
      `,
      subscription_confirmed: (data) => `
        <h1>Assinatura Ativada</h1>
        <p>Parabéns! Sua assinatura no plano ${data.planName} foi ativada com sucesso.</p>
        ${data.expiresAt ? `<p>Próxima renovação: ${new Date(data.expiresAt).toLocaleDateString('pt-BR')}</p>` : ''}
      `,
      trial_ending: (data) => `
        <h1>Seu período de teste está terminando</h1>
        <p>Seu período de teste termina em ${data.daysRemaining} dias.</p>
        <p>Faça upgrade para continuar usando todos os recursos.</p>
      `,
      payment_failed: (data) => `
        <h1>Falha no Pagamento</h1>
        <p>Não conseguimos processar o pagamento de sua assinatura ${data.planName}.</p>
        <p>Por favor, atualize seus dados de pagamento.</p>
      `,
      password_reset: (data) => `
        <h1>Redefina sua Senha</h1>
        <p>Clique no link abaixo para redefinir sua senha:</p>
        <a href="${data.resetLink}">Redefinir Senha</a>
      `,
    };

    const renderer = templates[template];
    if (!renderer) {
      this.logger.warn(`Template not found: ${template}`);
      return '<p>Template not found</p>';
    }

    return renderer(data);
  }
}
