import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface User {
  email: string;
  name: string;
}
@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private config: ConfigService,
  ) {}

  async sendUserConfirmation() {
    const url = `example.com/auth/confirm?token=123`;
    await this.mailerService.sendMail({
      to: this.config.get('PERSONAL_EMAIL'),
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: process.cwd() + '/templates/confirmation', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: '',
        url,
      },
    });
  }
}
