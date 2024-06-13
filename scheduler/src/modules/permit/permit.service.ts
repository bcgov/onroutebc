import { HttpService } from '@nestjs/axios';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { LogAsyncMethodExecution } from 'src/common/decorator/log-async-method-execution.decorator';
import { AxiosRequestConfig } from 'axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { lastValueFrom, map } from 'rxjs';
import { getAccessToken } from 'src/common/helper/gov-common-services.helper';
import { GovCommonServices } from 'src/common/enum/gov-common-services.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Permit } from './entities/permit.entity';
import { Brackets, In, Repository } from 'typeorm';
import { ApplicationStatus } from '../common/enum/application-status.enum';
import { PermitIdDto } from '../common/dto/permit-id.dto';
import * as dayjs from 'dayjs';

@Injectable()
export class PermitService {
  private readonly logger = new Logger(PermitService.name);
  private runningIssuePermit: boolean = false;
  private runningDocGen: boolean = false;
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @InjectRepository(Permit)
    private permitRepository: Repository<Permit>,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  /**
   * Scheduler to issue permits for which payment has been completed
   * but issuance failed, Permit must be in PAYMENT_COMPLETE status.
   */
  //@Cron('0 0 0 29 2 1', {    name: 'IssuePermit',})
  @LogAsyncMethodExecution()
  async getPermitForIssuance() {
    try {
      const now = new Date();
      const date = dayjs(now).subtract(1, 'minute').toDate();
      const count = Number(process.env.ISSUE_PERMIT_LIMIT)
      const permits: Permit[] = await this.permitRepository
        .createQueryBuilder('permit')
        .where('permit.permitStatus = :permitStatus', {
          permitStatus: ApplicationStatus.PAYMENT_COMPLETE,
        })
        .andWhere('permit.updatedDateTime < :date', { date: date })
        .take(count)
        .getMany();
      const permitIds: string[] = permits.map((permit) => permit.permitId);
      this.logger.log('permit IDS ', permitIds);
      if (permitIds.length) {
        const permitDto: PermitIdDto = { ids: permitIds };
        const url =
          process.env.ACCESS_API_URL + `/applications/scheduler/issue`;
        const response = await this.accessApi(url, permitDto);
      }
    } catch (error) {
      this.logger.error(`Error in Permit Issuance Job ${error.message}`);
      throw new Error('Error in Permit Issuance Job');
    } finally {
      this.runningIssuePermit = false;
    }
  }

  @LogAsyncMethodExecution()
  async generateDocument() {
    try {
      const now = new Date();
      const date = dayjs(now).subtract(30, 'minute').toDate();
      const count = Number(process.env.DOC_GEN_LIMIT)
      const permits: Permit[] = await this.permitRepository
        .createQueryBuilder('permit')
        .innerJoinAndSelect('permit.permitTransactions', 'permitTransactions')
        .innerJoinAndSelect('permitTransactions.transaction', 'transaction')
        .innerJoinAndSelect('transaction.receipt', 'receipt')
        .where('permit.permitStatus = :permitStatus', {
          permitStatus: ApplicationStatus.ISSUED,
        })
        .andWhere(
          new Brackets((qb) => {
            qb.where('permit.documentId IS NULL').orWhere(
              'receipt.receiptDocumentId IS NULL',
            );
          }),
        )
        .andWhere('permit.updatedDateTime < :date', { date: date })
        .take(count)
        .getMany();
      const permitIds: string[] = permits.map((permit) => permit.permitId);
      this.logger.log('permit IDS ', permitIds);
      if (permitIds.length) {
        const permitDto: PermitIdDto = { ids: permitIds };
        const url =
          process.env.ACCESS_API_URL + `/applications/scheduler/document`;
        const response = await this.accessApi(url, permitDto);
      }
    } catch (error) {
      this.logger.error(`Error in GeneratePermitDocument Job ${error.message}`);
      throw new Error('Error in GeneratePermitDocument cron job');
    } finally {
      this.runningDocGen = false;
    }
  }

  async accessApi(url: string, body: PermitIdDto): Promise<any> {
    try {
      const token = await getAccessToken(
        GovCommonServices.ORBC_SERVICE_ACCOUNT,
        this.httpService,
        this.cacheManager,
      );

      const reqConfig: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const response = await lastValueFrom(
        this.httpService
          .post(url, body, reqConfig)
          .pipe(map((response) => response.data)),
      );

      return response;
    } catch (error) {
      this.logger.error(`Error in calling ${url}: ${error.message}`);
      throw new InternalServerErrorException('Unable to call Access API.');
    }
  }

  @Cron('0 */1 * * * *', { name: 'GeneratePermitDocument' })
  @LogAsyncMethodExecution()
  async runJobs() {
    if (this.runningIssuePermit) {
      this.logger.log('IssuePermit job is running already.');
    } else {
      this.logger.log('Running IssuePermit Job.');
      this.runningIssuePermit = true;
      const response = await this.getPermitForIssuance();
    }

    if (this.runningDocGen) {
      this.logger.log('GeneratePermitDocument job is running already.');
    } else {
      this.logger.log('Running GeneratePermitDocument Job.');
      this.runningDocGen = true;
      const response = await this.generateDocument();
    }
  }
}
