import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom, map } from 'rxjs';
import { getFullNameFromCache } from '../../common/helper/cache.helper';
import { getAccessToken } from '../../common/helper/gov-common-services.helper';
import { GovCommonServices } from '../../common/enum/gov-common-services.enum';
import * as Handlebars from 'handlebars';
import { EmailTemplate } from '../../common/enum/email-template.enum';
import { ProfileRegistrationEmailData } from '../../common/interface/profile-registration-email-data.interface';

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
    data: ProfileRegistrationEmailData,
    subject: string,
    to: string[],
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
    data: ProfileRegistrationEmailData,
  ): Promise<string> {
    const template = await this.cacheManager.get(templateName);
    const compiledTemplate = Handlebars.compile(template);
    const htmlBody = compiledTemplate({
      ...data,
      headerLogo: process.env.FRONT_END_URL + '/BC_Logo_MOTI.png',
      footerLogo: process.env.FRONT_END_URL + '/onRouteBC_Logo.png',
      orbcEmailStyles: await this.cacheManager.get('orbcEmailStyles'),
    });
    return htmlBody;
  }
}
