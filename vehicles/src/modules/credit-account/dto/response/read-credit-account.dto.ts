import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

import {
  CreditAccountStatus,
  CreditAccountStatusType,
} from '../../../../common/enum/credit-account-status-type.enum';

import { CreditAccountType } from '../../../../common/enum/credit-account-type.enum';

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
    description: 'Indicates whether the account is verified.',
    example: false,
  })
  isVerified: boolean;

  @AutoMap()
  @ApiProperty({
    description: 'The status of the credit account.',
    example: CreditAccountStatus.ACCOUNT_ACTIVE,
  })
  creditAccountStatusType: CreditAccountStatusType;
}
