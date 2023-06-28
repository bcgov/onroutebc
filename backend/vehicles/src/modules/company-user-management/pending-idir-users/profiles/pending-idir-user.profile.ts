import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { ReadPendingIdirUserDto } from '../dto/response/read-pending-idir-user.dto';
import { CreatePendingIdirUserDto } from '../dto/request/create-pending-idir-user.dto';
import { PendingIdirUser } from '../entities/pending-idir-user.entity';
import { UpdatePendingIdirUserDto } from '../dto/request/update-pending-idir-user.dto';

@Injectable()
export class PendingIdirUsersProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      /**
       * Mapping from CreatePendingIdirUserDto to PendingIdirUser entity, with custom
       * mappings for the userName properties using forMember
       * and mapWithArguments.
       */
      createMap(mapper, CreatePendingIdirUserDto, PendingIdirUser);

      /**
       * Mapping from CreatePendingIdirUserDto to PendingIdirUser entity, with custom
       * mappings for the userName properties using forMember
       * and mapWithArguments.
       */
      createMap(mapper, UpdatePendingIdirUserDto, PendingIdirUser);

      /**
       * Mapping from PendingIdirUser entity to ReadPendingIdirUserDto response DTO.
       */
      createMap(mapper, PendingIdirUser, ReadPendingIdirUserDto);
    };
  }
}
