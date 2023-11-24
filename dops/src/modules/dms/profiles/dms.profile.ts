import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Document } from '../entities/document.entity';
import { ReadFileDto } from '../dto/response/read-file.dto';

@Injectable()
export class DmsProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        Document,
        ReadFileDto,
        forMember(
          (d) => d.s3ObjectId,
          mapFrom((s) => s.s3ObjectId?.toLowerCase()),
        ),
      );
    };
  }
}
