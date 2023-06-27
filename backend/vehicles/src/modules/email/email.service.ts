import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom, map } from 'rxjs';
import { getAccessToken } from '../../common/helper/gov-common-services.helper';
import { GovCommonServices } from '../../common/enum/gov-common-services.enum';
import * as Handlebars from 'handlebars';
import { EmailTemplate } from '../../common/enum/email-template.enum';
import { ProfileRegistrationEmailData } from '../../common/interface/profile-registration-email-data.interface';
import { IssuePermitEmailData } from '../../common/interface/issue-permit-email-data.interface';
import { AttachementEmailData } from '../../common/interface/attachment-email-data.interface';
import { CacheKey } from '../../common/enum/cache-key.enum';
import { getFromCache } from '../../common/helper/cache.helper';

@Injectable()
export class EmailService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  private chesUrl = process.env.CHES_URL;
  async sendEmailMessage(
    template: EmailTemplate,
    data: ProfileRegistrationEmailData | IssuePermitEmailData,
    subject: string,
    to: string[],
    attachment?: AttachementEmailData,
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
      attachments: attachment ? [attachment] : undefined,
    };

    const requestConfig: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    };

    const responseData = await lastValueFrom(
      this.httpService
        .post(this.chesUrl.concat('email'), requestData, requestConfig)
        .pipe(
          map((response) => {
            return response;
          }),
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
      .catch((error: HttpException) => {
        throw error;
      });

    return responseData.txId;
  }

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
      orbcEmailStyles: await getFromCache(
        this.cacheManager,
        CacheKey.EMAIL_TEMPLATE_ORBC_STYLE,
      ),
    });
    return htmlBody;
  }

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
