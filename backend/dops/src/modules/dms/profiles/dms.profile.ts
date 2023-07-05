import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  mapWithArguments,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Dms } from '../entities/dms.entity';
import { ReadCOMSDto } from '../dto/response/read-coms.dto';
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
        ReadCOMSDto,
        Dms,
        forMember(
          (d) => d.s3ObjectId,
          mapFrom((s) => s.id),
        ),
        forMember(
          (d) => d.s3VersionId,
          mapFrom((s) => s.s3VersionId),
        ),
        forMember(
          (d) => d.s3Location,
          mapFrom((s) => s.Location),
        ),
        forMember(
          (d) => d.objectMimeType,
          mapFrom((s) => s.mimeType),
        ),
        forMember(
          (d) => d.fileName,
          mapFrom((s) => {
            return s.metadata['name'] as string;
          }),
        ),
        forMember(
          (d) => d.dmsVersionId,
          mapWithArguments((source, { dmsVersionId }) => {
            return dmsVersionId;
          }),
        ),
      );
      createMap(
        mapper,
        Dms,
        ReadFileDto,
        forMember(
          (d) => d.s3ObjectId,
          mapFrom((s) => s.s3ObjectId?.toLowerCase()),
        ),
      );
    };
  }
}
