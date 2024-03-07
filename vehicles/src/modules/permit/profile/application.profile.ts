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
import { Directory } from '../../../common/enum/directory.enum';
import { PPC_FULL_TEXT } from '../../../common/constants/api.constant';
import {
  UserAuthGroup,
  idirUserAuthGroupList,
} from '../../../common/enum/user-auth-group.enum';
import { ReadApplicationMetadataDto } from '../dto/response/read-application-metadata.dto';

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
          (d) => d.company.companyId,
          mapFrom((s) => s.companyId),
        ),
        forMember(
          (permit) => permit.applicationOwner?.userGUID,
          mapWithArguments((_, { userGUID }) => {
            return userGUID;
          }),
        ),
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
          (d) => d.companyId,
          mapFrom((s) => s?.company?.companyId),
        ),
        forMember(
          (d) => d.permitData,
          mapFrom((s) => {
            return s.permitData?.permitData
              ? (JSON.parse(s.permitData?.permitData) as JSON)
              : undefined;
          }),
        ),
        forMember(
          (d) => d.applicant,
          mapWithArguments((s, { currentUserAuthGroup }) => {
            if (s.applicationOwner?.directory === Directory.IDIR) {
              if (
                idirUserAuthGroupList.includes(
                  currentUserAuthGroup as UserAuthGroup,
                )
              ) {
                return s.applicationOwner?.userName;
              } else {
                return PPC_FULL_TEXT;
              }
            } else {
              const firstName =
                s.applicationOwner?.userContact?.firstName ?? '';
              const lastName = s.applicationOwner?.userContact?.lastName ?? '';
              return (firstName + ' ' + lastName).trim();
            }
          }),
        ),
      );

      createMap(
        mapper,
        Permit,
        ReadApplicationMetadataDto,
        forMember(
          (d) => d.startDate,
          mapFrom((s) => s.permitData?.startDate),
        ),
        forMember(
          (d) => d.expiryDate,
          mapFrom((s) => s.permitData?.expiryDate),
        ),
        forMember(
          (d) => d.vin,
          mapFrom((s) => s.permitData?.vin),
        ),
        forMember(
          (d) => d.unitNumber,
          mapFrom((s) => s.permitData?.unitNumber),
        ),
        forMember(
          (d) => d.plate,
          mapFrom((s) => s.permitData?.plate),
        ),
        forMember(
          (d) => d.applicant,
          mapWithArguments((s, { currentUserAuthGroup }) => {
            if (s.applicationOwner?.directory === Directory.IDIR) {
              if (
                idirUserAuthGroupList.includes(
                  currentUserAuthGroup as UserAuthGroup,
                )
              ) {
                return s.applicationOwner?.userName;
              } else {
                return PPC_FULL_TEXT;
              }
            } else {
              const firstName =
                s.applicationOwner?.userContact?.firstName ?? '';
              const lastName = s.applicationOwner?.userContact?.lastName ?? '';
              return (firstName + ' ' + lastName).trim();
            }
          }),
        ),
      );

      createMap(
        mapper,
        UpdateApplicationDto,
        Permit,
        forMember(
          (d) => d.company.companyId,
          mapFrom((s) => s.companyId),
        ),
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
