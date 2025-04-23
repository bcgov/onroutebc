import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import {
  CreditAccountLimit,
  CreditAccountLimitType,
} from '../../../../common/enum/credit-account-limit.enum';

export class ReadCreditAccountLimitDto {
  @AutoMap()
  @ApiProperty({
    description: 'The credit limit of the account.',
    example: CreditAccountLimit[10000],
  })
  creditLimit: CreditAccountLimitType;

  @AutoMap()
  @ApiProperty({
    description: 'The credit balance of the account.',
    example: 9200,
    required: false,
  })
  creditBalance?: number;

  @AutoMap()
  @ApiProperty({
    description: 'The available credit of the account.',
    example: 800,
    required: false,
  })
  availableCredit?: number;
}
