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
import { IUserJWT } from '../../../common/interface/user-jwt.interface';
import { doesUserHaveRole } from '../../../common/helper/auth.helper';
import {
  CLIENT_USER_ROLE_LIST,
  IDIRUserRole,
} from '../../../common/enum/user-role.enum';
import { CreditAccountLimit } from '../../../common/enum/credit-account-limit.enum';
import { IEGARMSResponse } from '../../../common/interface/egarms-response.interface';

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
          (d) => d.creditAccountNumber,
          mapWithArguments(
            (source, { currentUser }: { currentUser: IUserJWT }) => {
              if (
                !source?.isVerified &&
                doesUserHaveRole(
                  currentUser?.orbcUserRole,
                  CLIENT_USER_ROLE_LIST,
                )
              ) {
                return undefined;
              } else {
                return source.creditAccountNumber;
              }
            },
          ),
        ),
      );

      createMap(
        mapper,
        CreditAccount,
        ReadCreditAccountLimitDto,
        forMember(
          (d) => d.creditLimit,
          mapWithArguments(
            (
              source,
              {
                currentUser,
                egarmsCreditAccountDetails,
              }: {
                currentUser: IUserJWT;
                egarmsCreditAccountDetails: IEGARMSResponse;
              },
            ) => {
              if (
                doesUserHaveRole(currentUser?.orbcUserRole, [
                  IDIRUserRole.PPC_CLERK,
                  IDIRUserRole.CTPO,
                ])
              ) {
                return undefined;
              } else {
                return egarmsCreditAccountDetails?.PPABalance?.negative_limit;
              }
            },
          ),
        ),
        forMember(
          (d) => d.creditBalance,
          mapWithArguments(
            (
              source,
              {
                currentUser,
                egarmsCreditAccountDetails,
              }: {
                currentUser: IUserJWT;
                egarmsCreditAccountDetails: IEGARMSResponse;
              },
            ) => {
              if (
                doesUserHaveRole(currentUser?.orbcUserRole, [
                  IDIRUserRole.PPC_CLERK,
                  IDIRUserRole.CTPO,
                ])
              ) {
                return undefined;
              } else {
                return egarmsCreditAccountDetails?.PPABalance?.account_balance;
              }
            },
          ),
        ),
        forMember(
          (d) => d.availableCredit,
          mapWithArguments(
            (
              source,
              {
                egarmsCreditAccountDetails,
              }: {
                egarmsCreditAccountDetails: IEGARMSResponse;
              },
            ) => {
              return (
                egarmsCreditAccountDetails?.PPABalance?.negative_limit +
                egarmsCreditAccountDetails?.PPABalance?.account_balance
              );
            },
          ),
        ),
        forMember(
          (d) => d.egarmsReturnCode,
          mapWithArguments(
            (
              source,
              {
                egarmsCreditAccountDetails,
              }: {
                egarmsCreditAccountDetails: IEGARMSResponse;
              },
            ) => {
              return egarmsCreditAccountDetails?.PPABalance?.return_code;
            },
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
