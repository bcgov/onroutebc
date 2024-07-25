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
import { CreditAccountLimitType } from '../../../common/enum/credit-account-limit.enum';
import { CreditAccountActivity } from '../entities/credit-account-activity.entity';
import { ReadCreditAccountActivityDto } from '../dto/response/read-credit-account-activity.dto';
import { ReadCreditAccountUserDetailsDto } from '../dto/response/read-credit-account-user-details.dto';
import { IDIRUserAuthGroup } from '../../../common/enum/user-auth-group.enum';
import { undefinedSubstitution } from '../../../common/helper/common.helper';

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

      createMap(
        mapper,
        CreditAccount,
        ReadCreditAccountDto,
        forMember(
          (d) => d.availableCredit,
          mapWithArguments(
            (
              _s,
              {
                userAuthGroup,
                availableCredit,
              }: { userAuthGroup: IDIRUserAuthGroup; availableCredit: number },
            ) =>
              undefinedSubstitution(
                availableCredit,
                () =>
                  userAuthGroup !== IDIRUserAuthGroup.PPC_CLERK &&
                  userAuthGroup !== IDIRUserAuthGroup.PPC_SUPERVISOR,
              ),
          ),
        ),
        forMember(
          (d) => d.creditLimit,
          mapWithArguments(
            (
              _s,
              {
                userAuthGroup,
                creditLimit,
              }: {
                userAuthGroup: IDIRUserAuthGroup;
                creditLimit: CreditAccountLimitType;
              },
            ) =>
              undefinedSubstitution(
                creditLimit,
                () =>
                  userAuthGroup !== IDIRUserAuthGroup.PPC_CLERK &&
                  userAuthGroup !== IDIRUserAuthGroup.PPC_SUPERVISOR,
              ),
          ),
        ),
        forMember(
          (d) => d.creditBalance,
          mapWithArguments(
            (
              _s,
              {
                userAuthGroup,
                creditBalance,
              }: { userAuthGroup: IDIRUserAuthGroup; creditBalance: number },
            ) =>
              undefinedSubstitution(
                creditBalance,
                () =>
                  userAuthGroup !== IDIRUserAuthGroup.PPC_CLERK &&
                  userAuthGroup !== IDIRUserAuthGroup.PPC_SUPERVISOR,
              ),
          ),
        ),
      );

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
