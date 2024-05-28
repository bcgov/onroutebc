import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LogAsyncMethodExecution } from 'src/common/decorator/log-async-method-execution.decorator';
import { getAccessToken } from 'src/common/helper/gov-common-services.helper';
import { ClsService } from 'nestjs-cls';
import { AxiosRequestConfig } from 'axios';
import { GovCommonServices } from 'src/common/enum/gov-common-services.enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PermitService {
  private readonly logger = new Logger(PermitService.name);
  constructor(
    private readonly httpService: HttpService,
    private readonly cls: ClsService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  @Cron(`${process.env.ISSUE_PERMIT_POLLING_INTERVAL || '0 */1 * * * *'}`)
  @LogAsyncMethodExecution()
  async triggerIssuePermitSchedule() {
    const url = process.env.ACCESS_API_URL + `/scheduler/issue`;
    console.log(await this.accessApi(url));
  }
  @Cron(`${process.env.GENERATE_DOCUMENT_POLLING_INTERVAL || '0 */1 * * * *'}`)
  @LogAsyncMethodExecution()
  async triggerGenerateDocumentSchedule() {
    const url = process.env.ACCESS_API_URL + `/scheduler/document`;
    console.log(await this.accessApi(url));
  }

  async accessApi(url: string) {
    const reqConfig: AxiosRequestConfig = {
      headers: {
        Authorization: await getAccessToken(
          GovCommonServices.ORBC_SERVICE_ACCOUNT,
          this.httpService,
          this.cacheManager,
        ),
        'Content-Type': 'application/json',
        'x-correlation-id': this.cls.getId(),
      },
      responseType: 'json',
    };
    await lastValueFrom(this.httpService.post(url, reqConfig));
  }
}
