import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  mapWithArguments,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Permit } from '../entities/permit.entity';
import { CreateApplicationDto } from '../dto/request/create-application.dto';
import { ReadApplicationDto } from '../dto/response/read-application.dto';
import { UpdateApplicationDto } from '../dto/request/update-application.dto';

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
          (permit) => permit.createdUserGuid,
          mapWithArguments((_, { userGUID }) => {
            return userGUID;
          }),
        ),
        forMember(
          (permit) => permit.createdUser,
          mapWithArguments((_, { userName }) => {
            return userName;
          }),
        ),
        forMember(
          (permit) => permit.createdUserDirectory,
          mapWithArguments((_, { directory }) => {
            return directory;
          }),
        ),

        forMember(
          (permit) => permit.createdDateTime,
          mapWithArguments((_, { timestamp }) => {
            return timestamp;
          }),
        ),

        forMember(
          (permit) => permit.updatedUserGuid,
          mapWithArguments((_, { userGUID }) => {
            return userGUID;
          }),
        ),
        forMember(
          (permit) => permit.updatedUser,
          mapWithArguments((_, { userName }) => {
            return userName;
          }),
        ),
        forMember(
          (permit) => permit.updatedUserDirectory,
          mapWithArguments((_, { directory }) => {
            return directory;
          }),
        ),

        forMember(
          (permit) => permit.updatedDateTime,
          mapWithArguments((_, { timestamp }) => {
            return timestamp;
          }),
        ),

        forMember(
          (permit) => permit.permitData.createdUserGuid,
          mapWithArguments((_, { userGUID }) => {
            return userGUID;
          }),
        ),
        forMember(
          (permit) => permit.permitData.createdUser,
          mapWithArguments((_, { userName }) => {
            return userName;
          }),
        ),
        forMember(
          (permit) => permit.permitData.createdUserDirectory,
          mapWithArguments((_, { directory }) => {
            return directory;
          }),
        ),

        forMember(
          (permit) => permit.permitData.createdDateTime,
          mapWithArguments((_, { timestamp }) => {
            return timestamp;
          }),
        ),

        forMember(
          (permit) => permit.permitData.updatedUserGuid,
          mapWithArguments((_, { userGUID }) => {
            return userGUID;
          }),
        ),
        forMember(
          (permit) => permit.permitData.updatedUser,
          mapWithArguments((_, { userName }) => {
            return userName;
          }),
        ),
        forMember(
          (permit) => permit.permitData.updatedUserDirectory,
          mapWithArguments((_, { directory }) => {
            return directory;
          }),
        ),

        forMember(
          (permit) => permit.permitData.updatedDateTime,
          mapWithArguments((_, { timestamp }) => {
            return timestamp;
          }),
        ),

        forMember(
          (permit) => permit.permitData?.permitData,
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

      createMap(
        mapper,
        UpdateApplicationDto,
        Permit,
        forMember(
          (d) => d.updatedUserGuid,
          mapWithArguments((updateApplicationDto, { userGUID }) => {
            return userGUID;
          }),
        ),
        forMember(
          (d) => d.updatedUser,
          mapWithArguments((updateApplicationDto, { userName }) => {
            return userName;
          }),
        ),
        forMember(
          (d) => d.updatedUserDirectory,
          mapWithArguments((updateApplicationDto, { directory }) => {
            return directory;
          }),
        ),

        forMember(
          (d) => d.updatedDateTime,
          mapWithArguments((updateApplicationDto, { timestamp }) => {
            return timestamp;
          }),
        ),
        forMember(
          (d) => d.permitData.updatedUserGuid,
          mapWithArguments((updateApplicationDto, { userGUID }) => {
            return userGUID;
          }),
        ),
        forMember(
          (d) => d.permitData.updatedUser,
          mapWithArguments((updateApplicationDto, { userName }) => {
            return userName;
          }),
        ),
        forMember(
          (d) => d.permitData.updatedUserDirectory,
          mapWithArguments((updateApplicationDto, { directory }) => {
            return directory;
          }),
        ),

        forMember(
          (d) => d.permitData.updatedDateTime,
          mapWithArguments((updateApplicationDto, { timestamp }) => {
            return timestamp;
          }),
        ),
        forMember(
          (d) => d.permitData?.permitData,
          mapFrom((s) => {
            return s.permitData ? JSON.stringify(s.permitData) : null;
          }),
        ),
        forMember(
          (d) => d.permitId,
          mapWithArguments((updateApplicationDto, { permitId }) => {
            return permitId;
          }),
        ),
        forMember(
          (d) => d.previousRevision,
          mapWithArguments((updateApplicationDto, { previousRevision }) => {
            return previousRevision;
          }),
        ),
        forMember(
          (d) => d.permitData.permitDataId,
          mapWithArguments((updateApplicationDto, { permitDataId }) => {
            return permitDataId;
          }),
        ),
      );
    };
  }
}
