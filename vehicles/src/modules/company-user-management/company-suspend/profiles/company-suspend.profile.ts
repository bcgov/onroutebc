import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { ReadCompanySuspendActivityDto } from '../dto/response/read-company-suspend-activity.dto';
import { CompanySuspendActivity } from '../entities/company-suspend-activity.entity';

@Injectable()
export class CompanySuspendProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      /**
       * The mapping is between CompanySuspendActivity and ReadCompanySuspendActivityDto.
       */
      createMap(
        mapper,
        CompanySuspendActivity,
        ReadCompanySuspendActivityDto,
        forMember(
          (d) => d.userName,
          mapFrom((source) => source?.idirUser?.userName),
        ),
      );
    };
  }
}
