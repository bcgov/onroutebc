import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { ClsService } from 'nestjs-cls';
import { LogAsyncMethodExecution } from '../../decorator/log-async-method-execution.decorator';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly cls: ClsService,
  ) {}

  @LogAsyncMethodExecution()
  async getUserDetails(
    accessToken: string,
    userGuid: string,
  ): Promise<AxiosResponse> {
    return lastValueFrom(
      this.httpService.get(process.env.ACCESS_API_URL + '/users/' + userGuid, {
        headers: {
          Authorization: accessToken,
          'Content-Type': 'application/json',
          'x-correlation-id': this.cls.getId(),
        },
      }),
    );
  }

  /**
   * The getRolesForUser() method finds and returns a {@link Role[]} object
   * for a user with a specific access token and companyId parameters. CompanyId is
   * optional
   *
   * @param accessToken The user access token.
   * @param companyId The company Id. Optional - Defaults to 0
   *
   * @returns The Roles as a promise of type {@link Role[]}
   */
  @LogAsyncMethodExecution()
  async getClaimsForUser(
    accessToken: string,
    companyId?: number,
  ): Promise<AxiosResponse> {
    return lastValueFrom(
      this.httpService.get(process.env.ACCESS_API_URL + '/users/claims', {
        params: { companyId: companyId ? companyId : undefined },
        headers: {
          Authorization: accessToken,
          'Content-Type': 'application/json',
          'x-correlation-id': this.cls.getId(),
        },
      }),
    );
  }

  /**
   * The getCompaniesForUser() method finds and returns a {@link number[]} object
   * for a user based on access token
   *
   * @param accessToken The user access token.
   *
   * @returns The associated companies as a promise of type {@link number[]}
   */
  @LogAsyncMethodExecution()
  async getCompaniesForUser(accessToken: string): Promise<AxiosResponse> {
    return lastValueFrom(
      this.httpService.get(
        process.env.ACCESS_API_URL + '/companies/meta-data',
        {
          headers: {
            Authorization: accessToken,
            'Content-Type': 'application/json',
            'x-correlation-id': this.cls.getId(),
          },
        },
      ),
    );
  }
  validateServiceAccountUser(clientId: string): boolean {
    return clientId === process.env.ORBC_SERVICE_ACCOUNT_CLIENT_ID;
  }
}
