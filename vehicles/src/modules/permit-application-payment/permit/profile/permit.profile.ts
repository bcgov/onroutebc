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
import { ReadPermitDto } from '../dto/response/read-permit.dto';
import { PPC_FULL_TEXT } from '../../../../common/constants/api.constant';
import { Directory } from '../../../../common/enum/directory.enum';
import {
  UserRole,
  IDIR_USER_ROLE_LIST,
} from '../../../../common/enum/user-role.enum';
import { doesUserHaveRole } from '../../../../common/helper/auth.helper';
import { ReadPermitMetadataDto } from '../dto/response/read-permit-metadata.dto';

@Injectable()
export class PermitProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        Permit,
        ReadPermitDto,
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
          (d) => d.issuer,
          mapWithArguments((s, { currentUserRole }) => {
            if (s.issuer?.directory === Directory.IDIR) {
              if (
                doesUserHaveRole(
                  currentUserRole as UserRole,
                  IDIR_USER_ROLE_LIST,
                )
              ) {
                return s.issuer?.userName;
              } else {
                return PPC_FULL_TEXT;
              }
            } else {
              const firstName = s.issuer?.userContact?.firstName ?? '';
              const lastName = s.issuer?.userContact?.lastName ?? '';
              return (firstName + ' ' + lastName).trim();
            }
          }),
        ),
      );

      createMap(
        mapper,
        Permit,
        ReadPermitMetadataDto,
        forMember(
          (d) => d.companyId,
          mapFrom((s) => s?.company?.companyId),
        ),
        forMember(
          (d) => d.startDate,
          mapFrom((s) => s.permitData?.startDate),
        ),
        forMember(
          (d) => d.expiryDate,
          mapFrom((s) => s.permitData?.expiryDate),
        ),
        forMember(
          (d) => d.legalName,
          mapFrom((s) => s.company?.legalName),
        ),
        forMember(
          (d) => d.alternateName,
          mapFrom((s) => s.company?.alternateName),
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
          mapWithArguments((s, { currentUserRole }) => {
            if (s.applicationOwner?.directory === Directory.IDIR) {
              if (
                doesUserHaveRole(
                  currentUserRole as UserRole,
                  IDIR_USER_ROLE_LIST,
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
        forMember(
          (d) => d.issuer,
          mapWithArguments((s, { currentUserRole }) => {
            if (s.issuer?.directory === Directory.IDIR) {
              if (
                doesUserHaveRole(
                  currentUserRole as UserRole,
                  IDIR_USER_ROLE_LIST,
                )
              ) {
                return s.issuer?.userName;
              } else {
                return PPC_FULL_TEXT;
              }
            } else {
              const firstName = s.issuer?.userContact?.firstName ?? '';
              const lastName = s.issuer?.userContact?.lastName ?? '';
              return (firstName + ' ' + lastName).trim();
            }
          }),
        ),
      );
    };
  }
}
