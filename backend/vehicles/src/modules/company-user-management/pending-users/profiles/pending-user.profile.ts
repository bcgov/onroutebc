import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  createMap,
  forMember,
  Mapper,
  mapWithArguments,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { CreatePendingUserDto } from '../dto/request/create-pending-user.dto';
import { UpdatePendingUserDto } from '../dto/request/update-pending-user.dto';
import { ReadPendingUserDto } from '../dto/response/read-pending-user.dto';
import { PendingUser } from '../entities/pending-user.entity';

@Injectable()
export class PendingUsersProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        CreatePendingUserDto,
        PendingUser,
        forMember(
          (d) => d.companyGUID,
          mapWithArguments((source, { companyGUID }) => {
            return companyGUID;
          }),
        ),
      );
      createMap(
        mapper,
        UpdatePendingUserDto,
        PendingUser,
        forMember(
          (d) => d.companyGUID,
          mapWithArguments((source, { companyGUID }) => {
            return companyGUID;
          }),
        ),
        forMember(
          (d) => d.userName,
          mapWithArguments((source, { userName }) => {
            return userName;
          }),
        ),
      );

      createMap(mapper, PendingUser, ReadPendingUserDto);
    };
  }
}
