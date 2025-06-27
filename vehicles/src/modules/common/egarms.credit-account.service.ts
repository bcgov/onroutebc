import { HttpService } from '@nestjs/axios';
import {
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

@Injectable()
export class EGARMSCreditAccountService {
  private readonly logger = new Logger(EGARMSCreditAccountService.name);
  constructor(private readonly httpService: HttpService) {}

  @LogAsyncMethodExecution()
  async getCreditAccountDetailsFromEGARMS(
    creditAccountNumber: string,
  ): Promise<IEGARMSResponse> {
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

    const egarmsCreditAccountDetails = await lastValueFrom(
      this.httpService.get(url, reqConfig),
    )
      .then((response) => {
        const parser = new XMLParser({ ignoreDeclaration: true });
        return parser.parse(response.data as string) as IEGARMSResponse;
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          const errorData = error.response.data as string;
          this.logger.error(`Error response from EGARMS: ${errorData}`);
        } else {
          this.logger.error(error?.message, error?.stack);
        }
        throw new InternalServerErrorException(
          'Error retrieving Credit Account details from EGARMS',
        );
      });

    return egarmsCreditAccountDetails;
  }
}
