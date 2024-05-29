import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LogAsyncMethodExecution } from 'src/common/decorator/log-async-method-execution.decorator';
import { ClsService } from 'nestjs-cls';
import { AxiosRequestConfig } from 'axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { lastValueFrom } from 'rxjs';
import axios from 'axios';
import { getAccessToken } from 'src/common/helper/gov-common-services.helper';
import { GovCommonServices } from 'src/common/enum/gov-common-services.enum';

@Injectable()
export class PermitService {
  private readonly logger = new Logger(PermitService.name);
  constructor(
    private readonly httpService: HttpService,
    private readonly cls: ClsService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  /**
   * Scheduler to issue permits for which payment has been completed
   * but issuance failed, Permit must be in PAYMENT_COMPLETE status.
   */
  @Cron(`${process.env.ISSUE_PERMIT_POLLING_INTERVAL || '0 */1 * * * *'}`)
  @LogAsyncMethodExecution()
  async triggerIssuePermitSchedule() {
    console.log('Issue Permit Schedule');
    const url = process.env.ACCESS_API_URL + `/permits/scheduler/issue`;
    console.log(await this.accessApi(url));
  }

  /**
   * Scheduler to generate documents and receipts for issued permits,
   * Permit must be issued, and document id or receipt id must be empty.
   */
  @Cron(`${process.env.GENERATE_DOCUMENT_POLLING_INTERVAL || '0 */1 * * * *'}`)
  @LogAsyncMethodExecution()
  async triggerGenerateDocumentSchedule() {
    console.log('Generate Document Schedule');
    const url = process.env.ACCESS_API_URL + `/permits/scheduler/document`;
    console.log(await this.accessApi(url));
  }

  async accessApi(url: string) {
    const token = await getAccessToken(GovCommonServices.ORBC_SERVICE_ACCOUNT, this.httpService,this.cacheManager);
    console.log(token);
    const reqConfig: AxiosRequestConfig = {
      headers: {
        Authorization: token,
      },
    };
    await lastValueFrom(this.httpService.post(url, reqConfig));
  }
}
