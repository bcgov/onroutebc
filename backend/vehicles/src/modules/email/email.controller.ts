import { Body, Controller, Post, Req } from '@nestjs/common';
import { EmailService } from './email.service';
import { Public } from '../../common/decorator/public.decorator';
import { EmailTemplate } from '../../common/enum/email-template.enum';
import { ProfileRegistrationEmailDto } from './dto/request/profile-registration-email.dto';
import { IssuePermitEmailDto } from './dto/request/issue-permit-email.dto';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('Email Testing')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('/profile')
  @Public()
  async sendProfileRegistrationEmail(
    @Req() _: Request,
    @Body() emailDto: ProfileRegistrationEmailDto,
  ) {
    const { subject, to, ...emailData } = emailDto;

    await this.emailService.sendEmailMessage(
      EmailTemplate.PROFILE_REGISTRATION,
      {
        ...emailData,
      },
      subject,
      to,
    );
  }

  @Post('/permit')
  @Public()
  async sendIssuePermitEmail(
    @Req() _: Request,
    @Body() emailDto: IssuePermitEmailDto,
  ) {
    const { subject, to, ...emailData } = emailDto;

    await this.emailService.sendEmailMessage(
      EmailTemplate.ISSUE_PERMIT,
      {
        ...emailData,
      },
      subject,
      to,
    );
  }
}
