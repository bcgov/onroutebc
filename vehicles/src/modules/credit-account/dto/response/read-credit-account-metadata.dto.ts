import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { CreditAccountUserType } from '../../../../common/enum/credit-accounts.enum';

export class ReadCreditAccountMetadataDto {
  @AutoMap()
  @ApiProperty({
    description: 'The credit account id.',
    example: 62,
  })
  creditAccountId: number;

  @AutoMap()
  @ApiProperty({
    description: 'The credit account user type.',
    example: CreditAccountUserType.ACCOUNT_HOLDER,
  })
  userType: CreditAccountUserType;

  @AutoMap()
  @ApiProperty({
    description:
      'Indicates whether the credit account can be used as a valid payment method.',
    example: false,
  })
  isValidPaymentMethod: boolean;

  @AutoMap()
  @ApiProperty({
    description: 'EGARMS return Code.',
    example: 'I0001',
    required: false,
  })
  egarmsReturnCode?: string;
}
