import { HttpService } from '@nestjs/axios';
import {
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
import * as CircuitBreaker from 'opossum';

@Injectable()
export class EGARMSCreditAccountService {
  private readonly logger = new Logger(EGARMSCreditAccountService.name);
  private readonly circuitBreaker: CircuitBreaker;

  constructor(private readonly httpService: HttpService) {
    const options = {
      timeout: 10000,
      errorThresholdPercentage: 50,
      resetTimeout: 30000,
    };

    // Initialize CircuitBreaker with a function that returns a Promise
    this.circuitBreaker = new CircuitBreaker(
      (params: { creditAccountNumber: string }) =>
        this.makeEGARMSRequest(params.creditAccountNumber),
      options,
    );

    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.circuitBreaker.on('timeout', () => {
      this.logger.error('EGARMS Circuit Breaker - Request timed out');
    });

    this.circuitBreaker.on('open', () => {
      this.logger.error('EGARMS Circuit Breaker - Open');
    });

    this.circuitBreaker.on('close', () => {
      this.logger.error('EGARMS Circuit Breaker - close');
    });

    this.circuitBreaker.on('halfOpen', () => {
      this.logger.error('EGARMS Circuit Breaker - halfOpen');
    });

    this.circuitBreaker.on('failure', (error) => {
      this.logger.error('EGARMS circuit breaker error:', error);
    });
  }

  @LogAsyncMethodExecution()
  async getCreditAccountDetailsFromEGARMS(
    creditAccountNumber: string,
  ): Promise<IEGARMSResponse> {
    try {
      return (await this.circuitBreaker.fire({
        creditAccountNumber,
      })) as IEGARMSResponse;
    } catch (error) {
      this.logger.error('Credit Account is unavailable', error);
      throw new InternalServerErrorException('Credit Account is unavailable.');
    }
  }

  private async makeEGARMSRequest(
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
      throw new InternalServerErrorException('Credit Account is unavailable.');
    }

    const axiosError = error as AxiosError;

    if (!axiosError?.response) {
      this.logger.error(axiosError?.message, axiosError?.stack);
      throw new InternalServerErrorException('Credit Account is unavailable.');
    }

    const status = axiosError?.response?.status as HttpStatus;

    switch (status) {
      case HttpStatus.UNAUTHORIZED:
        this.logger.error(
          'Unauthorized access to EGARMS. Please verify your credentials.',
        );
        throw new InternalServerErrorException(
          'Credit Account is unavailable.',
          axiosError?.response?.data,
        );
      case HttpStatus.BAD_REQUEST:
        this.logger.error(
          'Invalid request to EGARMS:',
          axiosError?.response?.data,
        );
        throw new InternalServerErrorException(
          'Credit Account is unavailable.',
          axiosError?.response?.data,
        );
      default:
        this.logger.error(
          `EGARMS returned unexpected status ${status}:`,
          axiosError?.response?.data,
        );
        throw new InternalServerErrorException(
          'Credit Account is unavailable.',
          axiosError?.response?.data,
        );
    }
  }
}
