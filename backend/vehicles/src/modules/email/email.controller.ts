import { Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { Public } from '../../common/decorator/public.decorator';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  @Public()
  async sendEmail() {
    const emailSubject = 'Welcome to onRouteBC';
    await this.emailService.sendEmailMessage('<h1>Hello</h1>', emailSubject, [
      'test.1.test@gov.bc.ca',
    ]);
  }
}
