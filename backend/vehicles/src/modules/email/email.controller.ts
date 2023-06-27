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
    //TODO: Refactor and provide an endpoint
    const emailSubject = 'Welcome to onRouteBC';

    await this.emailService.sendEmailMessage(
      EmailTemplate.ISSUE_PERMIT,
      null,
      emailSubject,
      null,
    );
  }
}
