import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  Mapper,
  createMap,
  forMember,
  mapFrom,
  mapWithArguments,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { CaseEvent } from '../entities/case-event.entity';
import { ReadCaseEvenDto } from '../dto/response/read-case-event.dto';
import { CaseActivity } from '../entities/case-activity.entity';
import { ReadCaseActivityDto } from '../dto/response/read-case-activity.dto';
import { IUserJWT } from '../../../common/interface/user-jwt.interface';
import { doesUserHaveRole } from '../../../common/helper/auth.helper';
import { IDIR_USER_ROLE_LIST } from '../../../common/enum/user-role.enum';

@Injectable()
export class CaseManagementProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, CaseEvent, ReadCaseEvenDto);

      createMap(
        mapper,
        CaseActivity,
        ReadCaseActivityDto,
        forMember(
          (d) => d.caseNotes,
          mapFrom((s) => s?.caseNotes?.comment),
        ),
        forMember(
          (d) => d.userName,
          mapWithArguments(
            (source, { currentUser }: { currentUser: IUserJWT }) => {
              if (
                doesUserHaveRole(currentUser.orbcUserRole, IDIR_USER_ROLE_LIST)
              ) {
                return source.user?.userName;
              }
            },
          ),
        ),
      );
    };
  }
}