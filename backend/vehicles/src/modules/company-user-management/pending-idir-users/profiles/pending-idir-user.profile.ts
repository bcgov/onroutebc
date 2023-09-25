import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  createMap,
  forMember,
  Mapper,
  mapWithArguments,
} from '@automapper/core';
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
      createMap(
        mapper,
        CreatePendingIdirUserDto,
        PendingIdirUser,
        forMember(
          (d) => d.createdUserGuid,
          mapWithArguments((source, { userGUID }) => {
            return userGUID;
          }),
        ),
        forMember(
          (d) => d.createdUser,
          mapWithArguments((source, { userName }) => {
            return userName;
          }),
        ),
        forMember(
          (d) => d.createdUserDirectory,
          mapWithArguments((source, { directory }) => {
            return directory;
          }),
        ),

        forMember(
          (d) => d.createdDateTime,
          mapWithArguments((source, { timestamp }) => {
            return timestamp;
          }),
        ),

        forMember(
          (d) => d.upatedUserGuid,
          mapWithArguments((source, { userGUID }) => {
            return userGUID;
          }),
        ),
        forMember(
          (d) => d.updatedUser,
          mapWithArguments((source, { userName }) => {
            return userName;
          }),
        ),
        forMember(
          (d) => d.updatedUserDirectory,
          mapWithArguments((source, { directory }) => {
            return directory;
          }),
        ),

        forMember(
          (d) => d.updatedDateTime,
          mapWithArguments((source, { timestamp }) => {
            return timestamp;
          }),
        ),
      );

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
