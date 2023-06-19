/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom, map } from 'rxjs';
import { getFullNameFromCache } from '../../common/helper/cache.helper';
import { getAccessToken } from '../../common/helper/gov-common-services.helper';
import { GovCommonServices } from '../../common/enum/gov-common-services.enum';

@Injectable()
export class EmailService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  private chesUrl = process.env.CHES_URL;
  async sendEmailMessage(
    messageBody: string,
    subject: string,
    to: string[],
  ): Promise<string> {
    const token = await getAccessToken(
      GovCommonServices.COMMON_HOSTED_EMAIL_SERVICE,
      this.httpService,
      this.cacheManager,
    );

    const onRouteBCLogoBase64 = (await getFullNameFromCache(
      this.cacheManager,
      'onRouteBCLogo',
    )) as string;

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
        return response.data;
      })
      .catch((error) => {
        console.log(error.response);
        return error.response;
      });

    return responseData;
  }
}
