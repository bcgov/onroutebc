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
      /**
       * Mapping from CreatePendingUserDto to PendingUser entity, with a custom
       * mapping for the companyId property using the forMember function and
       * mapWithArguments method to extract the companyId argument from the
       * source object and map it to the destination property.
       */
      createMap(
        mapper,
        CreatePendingUserDto,
        PendingUser,
        forMember(
          (d) => d.companyId,
          mapWithArguments((source, { companyId }) => {
            return companyId;
          }),
        ),
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
          (d) => d.updatedUserGuid,
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
       * Mapping from UpdatePendingUserDto to PendingUser entity, with custom
       * mappings for the companyId and userName properties using forMember
       * and mapWithArguments.
       */
      createMap(
        mapper,
        UpdatePendingUserDto,
        PendingUser,
        forMember(
          (d) => d.companyId,
          mapWithArguments((source, { companyId }) => {
            return companyId;
          }),
        ),
        forMember(
          (d) => d.userName,
          mapWithArguments((source, { userName }) => {
            return userName;
          }),
        ),
        forMember(
          (d) => d.updatedUserGuid,
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
       * Mapping from PendingUser entity to ReadPendingUserDto response DTO.
       */
      createMap(mapper, PendingUser, ReadPendingUserDto);
    };
  }
}
