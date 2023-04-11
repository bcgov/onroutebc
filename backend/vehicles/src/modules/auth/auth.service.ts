import { Injectable } from '@nestjs/common';
import { UsersService } from '../company-user-management/users/users.service';
import { ReadUserDto } from '../company-user-management/users/dto/response/read-user.dto';
import { PendingUsersService } from '../company-user-management/pending-users/pending-users.service';
import { Role } from '../../common/enum/roles.enum';
import { IDP } from '../../common/enum/idp.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly pendingUserService: PendingUsersService,
  ) {}

  async validateUser(
    companyId: number,
    identity_provider: string,
    userGuid: string,
    userName: string,
  ): Promise<boolean> {
    let user: ReadUserDto;
    let pendingUser = false;
    if (identity_provider === IDP.IDIR) {
      user = await this.usersService.findUserbyUserGUID(userGuid);
    } else {
      if (!companyId) {
        user = await this.usersService.findUserbyUserGUID(userGuid);
      } else {
        user = await this.usersService.findUserbyUserGUIDandCompanyId(
          userGuid,
          companyId,
        );
      }
      if (!user) {
        pendingUser = !!(await this.pendingUserService.findOneByUserName(
          userName,
        ));
      }
    }
    return user || pendingUser ? true : false;
  }

  /**
   * The getRolesForUser() method finds and returns a {@link Role[]} object
   * for a user with a specific userGUID and companyId parameters. CompanyId is
   * optional and defaults to 0
   *
   * @param userGUID The user GUID.
   * @param companyId The company Id. Optional - Defaults to 0
   *
   * @returns The Roles as a promise of type {@link Role[]}
   */
  async getRolesForUser(userGuid: string, companyId = 0): Promise<Role[]> {
    const roles = await this.usersService.getRolesForUser(userGuid, companyId);
    return roles;
  }
}
