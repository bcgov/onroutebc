import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  Mapper,
  createMap,
  forMember,
  forSelf,
  fromValue,
  mapFrom,
  mapWithArguments,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { CreditAccountUser } from '../entities/credit-account-user.entity';
import { CreateCreditAccountUserDto } from '../dto/request/create-credit-account-user.dto';
import { ReadCreditAccountUserDto } from '../dto/response/read-credit-account-user.dto';
import { Company } from '../../company-user-management/company/entities/company.entity';
import { CreditAccountUserType } from '../../../common/enum/credit-accounts.enum';
import { CreditAccount } from '../entities/credit-account.entity';
import { ReadCreditAccountDto } from '../dto/response/read-credit-account.dto';
import { CreditAccountActivity } from '../entities/credit-account-activity.entity';
import { ReadCreditAccountActivityDto } from '../dto/response/read-credit-account-activity.dto';
import { ReadCreditAccountUserDetailsDto } from '../dto/response/read-credit-account-user-details.dto';
import { ReadCreditAccountLimitDto } from '../dto/response/read-credit-account-limit.dto';

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

      createMap(mapper, CreditAccount, ReadCreditAccountDto);

      createMap(mapper, CreditAccount, ReadCreditAccountLimitDto);

      createMap(
        mapper,
        CreditAccount,
        ReadCreditAccountUserDetailsDto,
        forSelf(Company, (source) => source?.company),
      );

      createMap(
        mapper,
        CreditAccountActivity,
        ReadCreditAccountActivityDto,
        forMember(
          (d) => d.userName,
          mapFrom((source) => source?.idirUser?.userName),
        ),
      );

      createMap(
        mapper,
        CreditAccountUser,
        ReadCreditAccountUserDto,
        forSelf(Company, (source) => source.company),
        forMember(
          (d) => d.userType,
          fromValue(CreditAccountUserType.ACCOUNT_USER),
        ),
      );

      //To Map the credit Account Holder to Credit Account User
      createMap(
        mapper,
        Company,
        ReadCreditAccountUserDto,
        forMember(
          (d) => d.userType,
          fromValue(CreditAccountUserType.ACCOUNT_HOLDER),
        ),
      );
    };
  }
}
