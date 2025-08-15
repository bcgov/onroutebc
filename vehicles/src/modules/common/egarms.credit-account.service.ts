import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { LogAsyncMethodExecution } from '../../common/decorator/log-async-method-execution.decorator';
import { EGARMS_CREDIT_API_SYSTEM_ID } from '../../common/constants/api.constant';
import { lastValueFrom } from 'rxjs';
import { XMLParser } from 'fast-xml-parser';
import { IEGARMSResponse } from '../../common/interface/egarms-response.interface';
import { throwUnprocessableEntityException } from '../../common/helper/exception.helper';

@Injectable()
export class EGARMSCreditAccountService {
  private readonly logger = new Logger(EGARMSCreditAccountService.name);

  constructor(private readonly httpService: HttpService) {}

  @LogAsyncMethodExecution()
  async getCreditAccountDetailsFromEGARMS(
    creditAccountNumber: string,
  ): Promise<IEGARMSResponse> {
    try {
      const url = `${process.env.EGARMS_CREDIT_API_URL}/Send`;
      const reqConfig: AxiosRequestConfig = {
        params: {
          strSystemId: EGARMS_CREDIT_API_SYSTEM_ID,
          strClientNo: creditAccountNumber,
        },
        auth: {
          username: process.env.EGARMS_CREDIT_API_USER,
          password: process.env.EGARMS_CREDIT_API_PWD,
        },
      };

      const response = await lastValueFrom(
        this.httpService.get(url, reqConfig),
      );

      if ((response.status as HttpStatus) === HttpStatus.UNAUTHORIZED) {
        throwUnprocessableEntityException(
          'eGARMS threw an unauthorized exception. Please verify your credentials.',
          { errorCode: 'CREDIT_ACCOUNT_EGARMS_UNAUTHORIZED' },
        );
      }

      const parser = new XMLParser({ ignoreDeclaration: true });
      return parser.parse(response.data as string) as IEGARMSResponse;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private handleError(error: unknown): void {
    if (!(error instanceof AxiosError)) {
      this.logger.error(
        'Error retrieving Credit Account details from EGARMS',
        error,
      );
      throw new InternalServerErrorException(
        'Error retrieving Credit Account details from EGARMS',
      );
    }

    const axiosError = error as AxiosError;

    if (!axiosError?.response) {
      this.logger.error(axiosError?.message, axiosError?.stack);
      throw new InternalServerErrorException(
        'Error retrieving Credit Account details from EGARMS',
      );
    }

    const status = axiosError?.response?.status as HttpStatus;

    switch (status) {
      case HttpStatus.UNAUTHORIZED:
        this.logger.error(
          'Unauthorized access to EGARMS. Please verify your credentials.',
        );
        throw new InternalServerErrorException(
          'Unexpected error from EGARMS',
          axiosError?.response?.data,
        );
      case HttpStatus.BAD_REQUEST:
        this.logger.error(
          'Invalid request to EGARMS:',
          axiosError?.response?.data,
        );
        throw new BadRequestException(axiosError?.response?.data);
      default:
        this.logger.error(
          `EGARMS returned unexpected status ${status}:`,
          axiosError?.response?.data,
        );
        throw new InternalServerErrorException(
          'Unexpected error from EGARMS',
          axiosError?.response?.data,
        );
    }
  }
}
