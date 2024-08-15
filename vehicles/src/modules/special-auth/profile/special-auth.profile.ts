import { Mapper, createMap, forMember, mapFrom } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { SpecialAuth } from '../entities/special-auth.entity';
import { ReadSpecialAuthDto } from '../dto/response/read-special-auth.dto';

@Injectable()
export class SpecialAuthProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        SpecialAuth,
        ReadSpecialAuthDto,
        forMember(
          (d) => d.companyId,
          mapFrom((s) => {
            return s.company?.companyId;
          }),
        ),
      );
    };
  }
}
