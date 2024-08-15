import { Injectable } from '@nestjs/common';
import { UsersService } from '../company-user-management/users/users.service';
import { ReadUserDto } from '../company-user-management/users/dto/response/read-user.dto';
import { PendingUsersService } from '../company-user-management/pending-users/pending-users.service';
import { Claim } from '../../common/enum/claims.enum';
import { IDP } from '../../common/enum/idp.enum';
import { LogAsyncMethodExecution } from '../../common/decorator/log-async-method-execution.decorator';
import { ReadCompanyMetadataDto } from '../company-user-management/company/dto/response/read-company-metadata.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly pendingUserService: PendingUsersService,
  ) {}

  @LogAsyncMethodExecution()
  async getUserDetails(
    companyId: number,
    identity_provider: IDP,
    userGuid: string,
  ): Promise<ReadUserDto[]> {
    let user: ReadUserDto[];
    if (!companyId || identity_provider === IDP.IDIR) {
      user = await this.usersService.findUsersDto(userGuid);
    } else {
      user = await this.usersService.findUsersDto(userGuid, [companyId]);
    }

    return user;
  }

  /**
   * The getClaimsForUser() method finds and returns a {@link Claim[]} object
   * for a user with a specific userGUID and companyId parameters. CompanyId is
   * optional and defaults to 0
   *
   * @param userGUID The user GUID.
   * @param companyId The company Id. Optional - Defaults to 0
   *
   * @returns The claims as a promise of type {@link Claim[]}
   */
  @LogAsyncMethodExecution()
  async getClaimsForUser(userGuid: string, companyId = 0): Promise<Claim[]> {
    const claims = await this.usersService.getClaimsForUser(
      userGuid,
      companyId,
    );
    return claims;
  }

  /**
   * The getCompaniesForUser() method finds and returns a {@link number[]} object
   * for a user with a specific userGUID.
   *
   * @param userGUID The user GUID.
   *
   * @returns The associated companies as a promise of type {@link number[]}
   */
  @LogAsyncMethodExecution()
  async getCompaniesForUser(
    userGuid: string,
  ): Promise<ReadCompanyMetadataDto[]> {
    return await this.usersService.getCompaniesForUser(userGuid);
  }

  validateServiceAccountUser(clientId: string): boolean {
    return clientId === process.env.ORBC_SERVICE_ACCOUNT_CLIENT_ID;
  }
}
