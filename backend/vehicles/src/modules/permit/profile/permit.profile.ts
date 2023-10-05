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
import { CreatePermitDto } from '../dto/request/create-permit.dto';
import { ReadPermitDto } from '../dto/response/read-permit.dto';

@Injectable()
export class PermitProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        CreatePermitDto,
        Permit,
        forMember(
          (d) => d.createdUserGuid,
          mapWithArguments((createPermitDto, { userGUID }) => {
            return userGUID;
          }),
        ),
        forMember(
          (d) => d.createdUser,
          mapWithArguments((createPermitDto, { userName }) => {
            return userName;
          }),
        ),
        forMember(
          (d) => d.createdUserDirectory,
          mapWithArguments((createPermitDto, { directory }) => {
            return directory;
          }),
        ),

        forMember(
          (d) => d.createdDateTime,
          mapWithArguments((createPermitDto, { timestamp }) => {
            return timestamp;
          }),
        ),

        forMember(
          (d) => d.updatedUserGuid,
          mapWithArguments((createPermitDto, { userGUID }) => {
            return userGUID;
          }),
        ),
        forMember(
          (d) => d.updatedUser,
          mapWithArguments((createPermitDto, { userName }) => {
            return userName;
          }),
        ),
        forMember(
          (d) => d.updatedUserDirectory,
          mapWithArguments((createPermitDto, { directory }) => {
            return directory;
          }),
        ),

        forMember(
          (d) => d.updatedDateTime,
          mapWithArguments((createPermitDto, { timestamp }) => {
            return timestamp;
          }),
        ),

        forMember(
          (d) => d.permitData.createdUserGuid,
          mapWithArguments((createPermitDto, { userGUID }) => {
            return userGUID;
          }),
        ),
        forMember(
          (d) => d.permitData.createdUser,
          mapWithArguments((createPermitDto, { userName }) => {
            return userName;
          }),
        ),
        forMember(
          (d) => d.permitData.createdUserDirectory,
          mapWithArguments((createPermitDto, { directory }) => {
            return directory;
          }),
        ),

        forMember(
          (d) => d.permitData.createdDateTime,
          mapWithArguments((createPermitDto, { timestamp }) => {
            return timestamp;
          }),
        ),

        forMember(
          (d) => d.permitData.updatedUserGuid,
          mapWithArguments((createPermitDto, { userGUID }) => {
            return userGUID;
          }),
        ),
        forMember(
          (d) => d.permitData.updatedUser,
          mapWithArguments((createPermitDto, { userName }) => {
            return userName;
          }),
        ),
        forMember(
          (d) => d.permitData.updatedUserDirectory,
          mapWithArguments((createPermitDto, { directory }) => {
            return directory;
          }),
        ),

        forMember(
          (d) => d.permitData.updatedDateTime,
          mapWithArguments((createPermitDto, { timestamp }) => {
            return timestamp;
          }),
        ),

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
        ReadPermitDto,
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
