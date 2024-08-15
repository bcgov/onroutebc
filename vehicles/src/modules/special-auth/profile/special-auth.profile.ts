import {
  Mapper,
  createMap,
  forMember,
  mapFrom,
  mapWithArguments,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { SpecialAuth } from '../entities/special-auth.entity';
import { ReadSpecialAuthDto } from '../dto/response/read-special-auth.dto';
import { CreateSpecialAuthDto } from '../dto/request/create-special-auth.dto';

@Injectable()
export class SpecialAuthProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        CreateSpecialAuthDto,
        SpecialAuth,
        forMember(
          (d) => d.specialAuthId,
          mapWithArguments((_, { specialAuthId }) => {
            return specialAuthId;
          }),
        ),
        forMember(
          (d) => d.company.companyId,
          mapWithArguments((_, { companyId }) => {
            return companyId;
          }),
        ),
        forMember(
          (d) => d.isLcvAllowed,
          mapFrom((s) => {
            return s.isLcvAllowed;
          }),
        ),
        forMember(
          (d) => d.noFeeType,
          mapFrom((s) => {
            return s.noFeeType;
          }),
        ),
        forMember(
          (d) => d.updatedUserGuid,
          mapWithArguments((_, { userGUID }) => {
            return userGUID;
          }),
        ),
        forMember(
          (d) => d.updatedUser,
          mapWithArguments((_, { userName }) => {
            return userName;
          }),
        ),
        forMember(
          (d) => d.updatedUserDirectory,
          mapWithArguments((_, { directory }) => {
            return directory;
          }),
        ),
        forMember(
          (d) => d.updatedDateTime,
          mapWithArguments((_, { timestamp }) => {
            return timestamp;
          }),
        ),
      );
      createMap(
        mapper,
        SpecialAuth,
        ReadSpecialAuthDto,
        forMember(
          (d) => d.companyId,
          mapFrom((s) => {
            return s.company?.companyId;
          }),
        ),
      );
    };
  }
}
