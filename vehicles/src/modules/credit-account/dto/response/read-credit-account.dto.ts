import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import {
  CreditAccountLimit,
  CreditAccountLimitType,
} from '../../../../common/enum/credit-account-limit.enum';
import {
  CreditAccountStatus,
  CreditAccountStatusType,
} from '../../../../common/enum/credit-account-status-type.enum';
import { ReadCreditAccountUserDto } from './read-credit-account-user.dto';
import { CreditAccountType } from '../../../../common/enum/credit-account-type.enum';
import { ReadCreditAccountActivityDto } from './read-credit-account-activity.dto';
import { Expose } from 'class-transformer';
import { IDIR_USER_AUTH_GROUP_LIST } from '../../../../common/enum/user-auth-group.enum';

export class ReadCreditAccountDto {
  @AutoMap()
  @ApiProperty({
    description: 'The credit account id.',
    example: 62,
  })
  creditAccountId: number;

  @AutoMap()
  @ApiProperty({
    description: 'The credit account id.',
    example: CreditAccountType.PREPAID,
    enum: CreditAccountType,
  })
  creditAccountType: CreditAccountType;

  @AutoMap()
  @ApiProperty({
    description: 'The credit account number.',
    example: 'WS5667',
  })
  creditAccountNumber: string;

  @AutoMap()
  @ApiProperty({
    description: 'The collection of companies using this credit account.',
  })
  creditAccountUsers: ReadCreditAccountUserDto[];

  @AutoMap()
  @ApiProperty({
    description: 'The status of the credit account.',
    example: CreditAccountStatus.ACCOUNT_ACTIVE,
  })
  creditAccountStatusType: CreditAccountStatusType;

  @AutoMap()
  @ApiProperty({
    description: 'The credit account status update activity details .',
  })
  creditAccountActivities?: ReadCreditAccountActivityDto[];

  @AutoMap()
  @ApiProperty({
    description: 'The credit limit of the account.',
    example: CreditAccountLimit[10000],
  })
  creditLimit: CreditAccountLimitType;

  @AutoMap()
  @ApiProperty({
    description: 'The credit balance of the account.',
    example: 1200,
  })
  @Expose({ groups: UserAuthGroup })
  creditBalance: number;

  @AutoMap()
  @ApiProperty({
    description: 'The available credit of the account.',
    example: 800,
  })
  availableCredit: number;
}
