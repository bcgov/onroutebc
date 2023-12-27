import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { AxiosRequestConfig, AxiosError } from 'axios';
import { lastValueFrom } from 'rxjs';
import { getAccessToken } from '../../common/helper/gov-common-services.helper';
import { GovCommonServices } from '../../common/enum/gov-common-services.enum';
import * as Handlebars from 'handlebars';
import { EmailTemplate } from '../../common/enum/email-template.enum';
import { ProfileRegistrationEmailData } from '../../common/interface/profile-registration-email-data.interface';
import { IssuePermitEmailData } from '../../common/interface/issue-permit-email-data.interface';
import { AttachementEmailData } from '../../common/interface/attachment-email-data.interface';
import { CacheKey } from '../../common/enum/cache-key.enum';
import { getFromCache } from '../../common/helper/cache.helper';
import { LogAsyncMethodExecution } from '../../common/decorator/log-async-method-execution.decorator';
import { LogMethodExecution } from '../../common/decorator/log-method-execution.decorator';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  private chesUrl = process.env.CHES_URL;
  @LogAsyncMethodExecution()
  async sendEmailMessage(
    template: EmailTemplate,
    data: ProfileRegistrationEmailData | IssuePermitEmailData,
    subject: string,
    to: string[],
    attachments?: AttachementEmailData[],
  ): Promise<string> {
    const messageBody = await this.renderTemplate(template, data);
    const token = await getAccessToken(
      GovCommonServices.COMMON_HOSTED_EMAIL_SERVICE,
      this.httpService,
      this.cacheManager,
    );

    const requestData = {
      bcc: [],
      bodyType: 'html',
      body: messageBody,
      cc: [],
      delayTS: 0,
      encoding: 'utf-8',
      from: 'noreply-OnRouteBC@gov.bc.ca',
      priority: 'normal',
      subject: subject,
      to: to,
      attachments: attachments?.length ? attachments : undefined,
    };

    const requestConfig: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    };

    const responseData = await lastValueFrom(
      this.httpService.post(
        this.chesUrl.concat('email'),
        requestData,
        requestConfig,
      ),
    )
      .then((response) => {
        return response.data as {
          messages: [
            {
              msgId: string;
              tag: string;
              to: [string];
            },
          ];
          txId: string;
        };
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          const errorData = error.response.data;
          this.logger.error(
            `Error response from CHES: ${JSON.stringify(errorData, null, 2)}`,
          );
        } else {
          this.logger.error(error?.message, error?.stack);
        }
        throw new InternalServerErrorException('Error sending email');
      });

    return responseData.txId;
  }

  @LogAsyncMethodExecution()
  async renderTemplate(
    templateName: EmailTemplate,
    data: ProfileRegistrationEmailData | IssuePermitEmailData,
  ): Promise<string> {
    const template = await getFromCache(
      this.cacheManager,
      this.getCacheKeyforEmailTemplate(templateName),
    );
    if (!template?.length) {
      throw new InternalServerErrorException('Template not found');
    }
    const compiledTemplate = Handlebars.compile(template);
    const htmlBody = compiledTemplate({
      ...data,
      headerLogo: process.env.FRONT_END_URL + '/BC_Logo_MOTI.png',
      footerLogo: process.env.FRONT_END_URL + '/onRouteBC_Logo.png',
      darkModeHeaderLogo: process.env.FRONT_END_URL + '/BC_Logo_Rev_MOTI.png',
      darkModeMedHeaderLogo:
        process.env.FRONT_END_URL + '/BC_Logo_Rev_MOTI@2x.png',
      darkModeFooterLogo: process.env.FRONT_END_URL + '/onRouteBC_Rev_Logo.png',
      darkModeMedFooterLogo:
        process.env.FRONT_END_URL + '/onRouteBC_Rev_Logo@2x.png',
      whiteHeaderLogo: process.env.FRONT_END_URL + '/BC_Logo_MOTI_White.jpg',
      whiteMedHeaderLogo:
        process.env.FRONT_END_URL + '/BC_Logo_MOTI_White@2x.jpg',
      whiteFooterLogo: process.env.FRONT_END_URL + '/onRouteBC_Logo_White.jpg',
      whiteMedFooterLogo:
        process.env.FRONT_END_URL + '/onRouteBC_Logo_White@2x.jpg',
    });
    return htmlBody;
  }

  @LogMethodExecution()
  getCacheKeyforEmailTemplate(templateName: EmailTemplate): CacheKey {
    switch (templateName) {
      case EmailTemplate.ISSUE_PERMIT:
        return CacheKey.EMAIL_TEMPLATE_ISSUE_PERMIT;
      case EmailTemplate.PROFILE_REGISTRATION:
        return CacheKey.EMAIL_TEMPLATE_PROFILE_REGISTRATION;
      default:
        throw new Error('Invalid template name');
    }
  }
}
