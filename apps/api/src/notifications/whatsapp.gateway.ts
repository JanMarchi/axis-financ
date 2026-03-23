import { Injectable, Logger } from '@nestjs/common';

export interface WhatsAppGatewayInterface {
  sendMessage(phoneNumber: string, message: string): Promise<boolean>;
  sendTemplate(phoneNumber: string, template: string, params?: Record<string, string>): Promise<boolean>;
}

@Injectable()
export class ZApiGateway implements WhatsAppGatewayInterface {
  private logger = new Logger(ZApiGateway.name);
  private zapiUrl = 'https://api.z-api.io/instances';
  private instanceId = process.env.ZAPI_INSTANCE_ID;
  private token = process.env.ZAPI_TOKEN;
  private readonly RATE_LIMIT_KEY = 'whatsapp:rate_limit:';

  async sendMessage(phoneNumber: string, message: string): Promise<boolean> {
    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      this.logger.log(`Sending WhatsApp message to ${formattedPhone}`);

      const response = await fetch(
        `${this.zapiUrl}/${this.instanceId}/token/${this.token}/send-text`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: formattedPhone,
            message,
          }),
        },
      );

      if (!response.ok) {
        this.logger.error(
          `Z-API error: ${response.status} ${response.statusText}`,
        );
        return false;
      }

      this.logger.log(`Message sent successfully to ${formattedPhone}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to send WhatsApp message: ${(error as Error).message}`,
      );
      return false;
    }
  }

  async sendTemplate(
    phoneNumber: string,
    template: string,
    params?: Record<string, string>,
  ): Promise<boolean> {
    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      this.logger.log(`Sending WhatsApp template to ${formattedPhone}`);

      let message = template;
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          message = message.replace(`{{${key}}}`, value);
        });
      }

      return this.sendMessage(phoneNumber, message);
    } catch (error) {
      this.logger.error(
        `Failed to send WhatsApp template: ${(error as Error).message}`,
      );
      return false;
    }
  }

  private formatPhoneNumber(phone: string): string {
    // Remover caracteres especiais
    let clean = phone.replace(/\D/g, '');

    // Se não tem o +55, adicionar
    if (!clean.startsWith('55')) {
      clean = '55' + clean;
    }

    return clean;
  }
}
