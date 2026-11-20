import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';

import { ReadUserManagementActivityDto } from '@modules/company-user-management/user-management-activity/dto/response/read-user-management-activity.dto';
import { UserManagementActivity } from '@modules/company-user-management/user-management-activity/entities/user-management-activity.entity';

@Injectable()
export class UsersManagementActivityProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        UserManagementActivity,
        ReadUserManagementActivityDto,
        forMember(
          (d) => d.userGUID,
          mapFrom((s) => s.user?.userGUID),
        ),
        forMember(
          (d) => d.userName,
          mapFrom((s) => {
            if (s?.user) {
              return s.user?.userName;
            } else {
              return s.pendingStaffUser?.userName;
            }
          }),
        ),
        forMember(
          (d) => d.userName,
          mapFrom((s) => s.user?.statusCode),
        ),
        forMember(
          (d) => d.updatedStaffUserName,
          mapFrom((s) => s.updatedByStaffUser?.userName),
        ),
      );
    };
  }
}
