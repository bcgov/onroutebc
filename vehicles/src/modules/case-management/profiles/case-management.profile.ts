import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Mapper, createMap } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { CaseEvent } from '../entities/case-event.entity';
import { ReadCaseEvenDto } from '../dto/response/read-case-event.dto';

@Injectable()
export class CaseManagementProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, CaseEvent, ReadCaseEvenDto);
    };
  }
}
