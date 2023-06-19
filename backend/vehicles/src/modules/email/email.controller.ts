import { Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { Public } from '../../common/decorator/public.decorator';
import { EmailTemplate } from '../../common/enum/email-template.enum';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  @Public()
  async sendEmail() {
    const emailSubject = 'Welcome to onRouteBC';

    await this.emailService.sendEmailMessage(
      EmailTemplate.PROFILE_REGISTRATION_EMAIL_TEMPLATE,
      null,
      emailSubject,
      ['praveen.1.raju@gov.bc.ca', 'praveen.raju@aot-technologies.com'],
    );
  }
}
