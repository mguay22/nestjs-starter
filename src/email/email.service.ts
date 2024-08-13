import { Injectable, Logger } from '@nestjs/common';
import { IEmailService } from './email-service.interface';

@Injectable()
export class EmailService implements IEmailService {
  private readonly logger = new Logger(EmailService.name);

  async send(email: string, message: string) {
    this.logger.log(`Sending ${message} to ${email}`);
  }
}
