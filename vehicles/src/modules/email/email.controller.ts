import { Body, Controller, Post, Req } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailTemplate } from '../../common/enum/email-template.enum';
import { ProfileRegistrationEmailDto } from './dto/request/profile-registration-email.dto';
import { IssuePermitEmailDto } from './dto/request/issue-permit-email.dto';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthOnly } from '../../common/decorator/auth-only.decorator';

@ApiTags('Email Testing')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('/profile')
  @AuthOnly()
  async sendProfileRegistrationEmail(
    @Req() req: Request,
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
  @AuthOnly()
  async sendIssuePermitEmail(
    @Req() req: Request,
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
