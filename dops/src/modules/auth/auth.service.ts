import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { lastValueFrom } from 'rxjs';
import { ClsService } from 'nestjs-cls';
import { LogAsyncMethodExecution } from '../../decorator/log-async-method-execution.decorator';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
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
  async getRolesForUser(
    accessToken: string,
    companyId?: number,
  ): Promise<AxiosResponse> {
    return lastValueFrom(
      this.httpService.get(process.env.ACCESS_API_URL + '/users/roles', {
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
      this.httpService.get(process.env.ACCESS_API_URL + '/companies', {
        headers: {
          Authorization: accessToken,
          'Content-Type': 'application/json',
          'x-correlation-id': this.cls.getId(),
        },
      }),
    );
  }
}
