import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  Mapper,
  createMap,
  forMember,
  fromValue,
  mapFrom,
  mapWithArguments,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { CreditAccountUser } from '../entities/credit-account-user.entity';
import { CreateCreditAccountUserDto } from '../dto/request/create-credit-account-user.dto';

@Injectable()
export class CreditAccountProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        CreateCreditAccountUserDto,
        CreditAccountUser,
        forMember(
          (d) => d.company?.companyId,
          mapFrom((s) => s.companyId),
        ),
        forMember(
          (d) => d.creditAccount?.creditAccountId,
          mapWithArguments((source, { creditAccountId }) => {
            return creditAccountId;
          }),
        ),
        forMember((d) => d.isActive, fromValue(true)),
        forMember(
          (d) => d.createdUser,
          mapWithArguments((source, { userName }) => {
            return userName;
          }),
        ),
        forMember(
          (d) => d.createdDateTime,
          mapWithArguments((source, { timestamp }) => {
            return timestamp;
          }),
        ),
        forMember(
          (d) => d.createdUserDirectory,
          mapWithArguments((source, { directory }) => {
            return directory;
          }),
        ),
        forMember(
          (d) => d.createdUserGuid,
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
          (d) => d.updatedDateTime,
          mapWithArguments((source, { timestamp }) => {
            return timestamp;
          }),
        ),
        forMember(
          (d) => d.updatedUserDirectory,
          mapWithArguments((source, { directory }) => {
            return directory;
          }),
        ),
        forMember(
          (d) => d.updatedUserGuid,
          mapWithArguments((source, { userGUID }) => {
            return userGUID;
          }),
        ),
      );
    };
  }
}
