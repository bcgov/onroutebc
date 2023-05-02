import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Permit } from '../entities/permit.entity';
import { CreateApplicationDto } from '../dto/request/create-application.dto';
import { ReadApplicationDto } from '../dto/response/read-application.dto';

@Injectable()
export class ApplicationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        CreateApplicationDto,
        Permit,
        forMember(
          (d) => d.permitData?.permitData,
          mapFrom((s) => {
            return s.permitData ? JSON.stringify(s.permitData) : undefined;
          }),
        ),
      );

      createMap(
        mapper,
        Permit,
        ReadApplicationDto,
        forMember(
          (d) => d.permitData,
          mapFrom((s) => {
            return s.permitData?.permitData
              ? (JSON.parse(s.permitData?.permitData) as JSON)
              : undefined;
          }),
        ),
      );
    };
  }
}
