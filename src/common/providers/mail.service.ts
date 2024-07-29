import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

type SendMailProps = {
    to: string
    subject: string
    html: string
}

@Injectable()
export class MailService {
  constructor(private readonly mailService: MailerService) {}

  async sendMail({to,subject,html}:SendMailProps) {
    await this.mailService.sendMail({
      from: {
        name: 'Equipe Plann.er',
        address: 'planner@crudbox.com.br'
      },
      to,
      subject,
      html
    });
  }
}
