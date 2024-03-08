import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  mapWithArguments,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Permit } from '../entities/permit.entity';
import { ReadPermitDto } from '../dto/response/read-permit.dto';
import { Directory } from '../../../common/enum/directory.enum';
import { PPC_FULL_TEXT } from '../../../common/constants/api.constant';
import {
  IDIR_USER_AUTH_GROUP_LIST,
  UserAuthGroup,
} from '../../../common/enum/user-auth-group.enum';
import { doesUserHaveAuthGroup } from '../../../common/helper/auth.helper';

@Injectable()
export class PermitProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        Permit,
        ReadPermitDto,
        forMember(
          (d) => d.companyId,
          mapFrom((s) => s?.company?.companyId),
        ),
        forMember(
          (d) => d.permitData,
          mapFrom((s) => {
            return s.permitData?.permitData
              ? (JSON.parse(s.permitData?.permitData) as JSON)
              : undefined;
          }),
        ),
        forMember(
          (d) => d.issuer,
          mapWithArguments((s, { currentUserAuthGroup }) => {
            if (s.issuer?.directory === Directory.IDIR) {
              if (
                doesUserHaveAuthGroup(
                  currentUserAuthGroup as UserAuthGroup,
                  IDIR_USER_AUTH_GROUP_LIST,
                )
              ) {
                return s.issuer?.userName;
              } else {
                return PPC_FULL_TEXT;
              }
            } else {
              const firstName = s.issuer?.userContact?.firstName ?? '';
              const lastName = s.issuer?.userContact?.lastName ?? '';
              return (firstName + ' ' + lastName).trim();
            }
          }),
        ),
      );
    };
  }
}
